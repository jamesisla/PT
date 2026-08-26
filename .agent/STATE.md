# 📍 Sania Pet — Estado Operativo & Continuidad

* **Proyecto:** Sania Pet (Medical Record Dashboard & SOS Radar Mascotas)
* **Repositorio:** `https://github.com/jamesisla/PT.git`
* **Rama:** `main`
* **Servidor Producción (OCI Alpine):** `alpine@146.181.38.232`
* **Última Actualización:** 2026-08-25

---

## 🎯 Estado Actual (Sprint Activo)
* **Completado:**
  * ✅ Backend modular en Go con Chi Router y persistencia SQLite en modo WAL.
  * ✅ Módulo clínico: Vacunas, desparasitaciones, diagnósticos, recetas y telemetría biométrica.
  * ✅ Módulo SOS Radar: Geolocalización de mascotas perdidas con OpenStreetMap / Leaflet.
  * ✅ Frontend React Vite móvil-first con embebido estático en binario único Go.
  * ✅ Despliegue funcional en OCI Alpine Linux con servicio OpenRC.

---

## 📋 Próximos Pasos (Backlog Inmediato)
1. [ ] Agregar notificaciones push / web push para recordatorios de vacunas pendientes.
2. [ ] Exportar ficha clínica de mascota en PDF descargable.
3. [ ] Probar sincronización offline con PWA / IndexedDB.
