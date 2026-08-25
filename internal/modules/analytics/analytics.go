package analytics

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"sync/atomic"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jamesisla/PT/internal/core/response"
	"github.com/jamesisla/PT/internal/database"
)

// Global in-memory atomic toggle for instant 0-cost checks in middleware
var trackingEnabled atomic.Bool

// EventChannel for non-blocking asynchronous event batching
var eventChannel = make(chan EventRecord, 1000)

type EventRecord struct {
	Path       string
	Method     string
	StatusCode int
	DurationMs int64
	UserAgent  string
	IPHash     string
	CreatedAt  string
}

func init() {
	// Default enabled, will be synced on DB init
	trackingEnabled.Store(true)
	// Start background worker to write events without blocking HTTP handlers
	go eventWorker()
}

func eventWorker() {
	for ev := range eventChannel {
		if database.DB == nil {
			continue
		}
		_, err := database.DB.Exec(`
			INSERT INTO analytics_events (path, method, status_code, duration_ms, user_agent, ip_hash, created_at)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`, ev.Path, ev.Method, ev.StatusCode, ev.DurationMs, ev.UserAgent, ev.IPHash, ev.CreatedAt)
		if err != nil {
			log.Printf("Warning: failed to record analytics event: %v", err)
		}
	}
}

// IsTrackingEnabled returns true if telemetry capture is currently active
func IsTrackingEnabled() bool {
	return trackingEnabled.Load()
}

// SetTrackingEnabled updates both memory and database
func SetTrackingEnabled(enabled bool) error {
	trackingEnabled.Store(enabled)
	val := "0"
	if enabled {
		val = "1"
	}
	_, err := database.DB.Exec(`
		INSERT INTO analytics_config (key, value) VALUES ('tracking_enabled', ?)
		ON CONFLICT(key) DO UPDATE SET value = excluded.value
	`, val)
	return err
}

// SyncConfigFromDB reads state on boot
func SyncConfigFromDB(db *sql.DB) {
	var val string
	err := db.QueryRow("SELECT value FROM analytics_config WHERE key = 'tracking_enabled'").Scan(&val)
	if err == nil {
		trackingEnabled.Store(val == "1" || val == "true")
	} else {
		// Insert default enabled
		_, _ = db.Exec("INSERT OR IGNORE INTO analytics_config (key, value) VALUES ('tracking_enabled', '1')")
		trackingEnabled.Store(true)
	}
}

// Middleware records traffic if tracking is turned on
func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Skip static assets or if tracking is disabled
		if !IsTrackingEnabled() {
			next.ServeHTTP(w, r)
			return
		}

		path := r.URL.Path
		// Skip favicon and static asset chunk queries from cluttering analytics
		if strings.HasPrefix(path, "/assets/") || strings.HasSuffix(path, ".ico") || strings.HasSuffix(path, ".png") {
			next.ServeHTTP(w, r)
			return
		}

		start := time.Now()
		rw := &responseWriterInterceptor{ResponseWriter: w, statusCode: http.StatusOK}
		next.ServeHTTP(rw, r)
		duration := time.Since(start).Milliseconds()

		// Hash IP for privacy compliance
		ip := r.RemoteAddr
		if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
			ip = strings.Split(xff, ",")[0]
		}
		hasher := sha256.New()
		hasher.Write([]byte(ip))
		ipHash := hex.EncodeToString(hasher.Sum(nil))[:16]

		ua := r.UserAgent()
		if len(ua) > 100 {
			ua = ua[:100]
		}

		ev := EventRecord{
			Path:       path,
			Method:     r.Method,
			StatusCode: rw.statusCode,
			DurationMs: duration,
			UserAgent:  ua,
			IPHash:     ipHash,
			CreatedAt:  time.Now().Format("2006-01-02 15:04:05"),
		}

		// Push to channel without blocking
		select {
		case eventChannel <- ev:
		default:
			// Channel full, drop gracefully
		}
	})
}

type responseWriterInterceptor struct {
	http.ResponseWriter
	statusCode int
}

func (w *responseWriterInterceptor) WriteHeader(code int) {
	w.statusCode = code
	w.ResponseWriter.WriteHeader(code)
}

// Routes for SuperAdmin Analytics Management
func Routes() chi.Router {
	r := chi.NewRouter()

	r.Get("/config", GetConfig)
	r.Put("/toggle", ToggleTracking)
	r.Get("/metrics", GetMetrics)
	r.Delete("/purge", PurgeAnalytics)

	return r
}

func GetConfig(w http.ResponseWriter, r *http.Request) {
	var total int
	_ = database.DB.QueryRow("SELECT COUNT(*) FROM analytics_events").Scan(&total)

	response.JSON(w, http.StatusOK, map[string]any{
		"enabled":     IsTrackingEnabled(),
		"totalEvents": total,
	})
}

func ToggleTracking(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Enabled bool `json:"enabled"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	if err := SetTrackingEnabled(body.Enabled); err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, map[string]any{
		"enabled": body.Enabled,
		"message": "Analytics tracking configuration updated successfully",
	})
}

func GetMetrics(w http.ResponseWriter, r *http.Request) {
	// 1. Top visited paths
	rows, err := database.DB.Query(`
		SELECT path, COUNT(*) as visits, AVG(duration_ms) as avg_duration
		FROM analytics_events 
		GROUP BY path 
		ORDER BY visits DESC 
		LIMIT 10
	`)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	type PathStat struct {
		Path        string  `json:"path"`
		Visits      int     `json:"visits"`
		AvgDuration float64 `json:"avgDurationMs"`
	}
	var topPaths []PathStat
	for rows.Next() {
		var p PathStat
		_ = rows.Scan(&p.Path, &p.Visits, &p.AvgDuration)
		topPaths = append(topPaths, p)
	}

	// 2. Daily views last 7 days
	dailyRows, _ := database.DB.Query(`
		SELECT SUBSTR(created_at, 1, 10) as day, COUNT(*) as total
		FROM analytics_events
		GROUP BY day
		ORDER BY day DESC
		LIMIT 7
	`)
	type DailyStat struct {
		Day   string `json:"day"`
		Total int    `json:"total"`
	}
	var dailyStats []DailyStat
	if dailyRows != nil {
		defer dailyRows.Close()
		for dailyRows.Next() {
			var d DailyStat
			_ = dailyRows.Scan(&d.Day, &d.Total)
			dailyStats = append(dailyStats, d)
		}
	}

	// 3. Status codes summary
	var total2xx, total4xx, total5xx int
	_ = database.DB.QueryRow("SELECT COUNT(*) FROM analytics_events WHERE status_code >= 200 AND status_code < 400").Scan(&total2xx)
	_ = database.DB.QueryRow("SELECT COUNT(*) FROM analytics_events WHERE status_code >= 400 AND status_code < 500").Scan(&total4xx)
	_ = database.DB.QueryRow("SELECT COUNT(*) FROM analytics_events WHERE status_code >= 500").Scan(&total5xx)

	response.JSON(w, http.StatusOK, map[string]any{
		"enabled":    IsTrackingEnabled(),
		"topPaths":   topPaths,
		"dailyViews": dailyStats,
		"statusCodes": map[string]int{
			"ok":     total2xx,
			"client": total4xx,
			"server": total5xx,
		},
	})
}

func PurgeAnalytics(w http.ResponseWriter, r *http.Request) {
	_, err := database.DB.Exec("DELETE FROM analytics_events")
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(w, "Analytics logs purged successfully")
}
