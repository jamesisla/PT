package backups

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jamesisla/PT/internal/core/response"
	"github.com/jamesisla/PT/internal/database"
)

type BackupFile struct {
	Filename  string `json:"filename"`
	SizeBytes int64  `json:"sizeBytes"`
	SizeMB    string `json:"sizeMb"`
	CreatedAt string `json:"createdAt"`
}

func Routes() chi.Router {
	r := chi.NewRouter()

	r.Get("/", ListBackups)
	r.Post("/create", CreateHotBackup)
	r.Get("/download/{filename}", DownloadBackup)
	r.Delete("/{filename}", DeleteBackup)

	return r
}

// ListBackups returns all snapshot files in backups directory
func ListBackups(w http.ResponseWriter, r *http.Request) {
	backupDir := "backups"
	_ = os.MkdirAll(backupDir, 0755)

	entries, err := os.ReadDir(backupDir)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to read backups directory")
		return
	}

	var list []BackupFile
	for _, e := range entries {
		if !e.IsDir() && strings.HasSuffix(e.Name(), ".db") {
			info, err := e.Info()
			if err != nil {
				continue
			}
			mb := fmt.Sprintf("%.2f MB", float64(info.Size())/(1024*1024))
			list = append(list, BackupFile{
				Filename:  e.Name(),
				SizeBytes: info.Size(),
				SizeMB:    mb,
				CreatedAt: info.ModTime().Format("2006-01-02 15:04:05"),
			})
		}
	}

	// Sort newest first
	sort.Slice(list, func(i, j int) bool {
		return list[i].CreatedAt > list[j].CreatedAt
	})

	if list == nil {
		list = []BackupFile{}
	}
	response.JSON(w, http.StatusOK, list)
}

// CreateHotBackup executes SQLite VACUUM INTO for live, zero-lock snapshotting
func CreateHotBackup(w http.ResponseWriter, r *http.Request) {
	backupDir := "backups"
	_ = os.MkdirAll(backupDir, 0755)

	timestamp := time.Now().Format("20060102_150405")
	filename := fmt.Sprintf("saniapet_backup_%s.db", timestamp)
	targetPath := filepath.Join(backupDir, filename)

	// SQLite VACUUM INTO creates a live consistent snapshot in microseconds
	query := fmt.Sprintf("VACUUM INTO '%s'", targetPath)
	_, err := database.DB.Exec(query)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, fmt.Sprintf("Hot backup failed: %v", err))
		return
	}

	info, _ := os.Stat(targetPath)
	sizeMB := "0.0 MB"
	var sizeBytes int64 = 0
	if info != nil {
		sizeBytes = info.Size()
		sizeMB = fmt.Sprintf("%.2f MB", float64(sizeBytes)/(1024*1024))
	}

	response.JSON(w, http.StatusCreated, BackupFile{
		Filename:  filename,
		SizeBytes: sizeBytes,
		SizeMB:    sizeMB,
		CreatedAt: time.Now().Format("2006-01-02 15:04:05"),
	})
}

// DownloadBackup streams the .db file directly to client
func DownloadBackup(w http.ResponseWriter, r *http.Request) {
	filename := chi.URLParam(r, "filename")
	if strings.Contains(filename, "..") || strings.Contains(filename, "/") {
		response.Error(w, http.StatusBadRequest, "Invalid filename")
		return
	}

	targetPath := filepath.Join("backups", filename)
	if _, err := os.Stat(targetPath); os.IsNotExist(err) {
		response.Error(w, http.StatusNotFound, "Backup file not found")
		return
	}

	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%q", filename))
	w.Header().Set("Content-Type", "application/x-sqlite3")
	http.ServeFile(w, r, targetPath)
}

// DeleteBackup deletes a backup file
func DeleteBackup(w http.ResponseWriter, r *http.Request) {
	filename := chi.URLParam(r, "filename")
	if strings.Contains(filename, "..") || strings.Contains(filename, "/") {
		response.Error(w, http.StatusBadRequest, "Invalid filename")
		return
	}

	targetPath := filepath.Join("backups", filename)
	_ = os.Remove(targetPath)
	response.Success(w, "Backup deleted successfully")
}
