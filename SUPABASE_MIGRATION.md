# Migración de la base de datos a Supabase

La BD pasó de **Render PostgreSQL free** (se borra a los 30 días) a **Supabase**
(Postgres gratuito permanente). El backend sigue en Render y el frontend en Vercel.

Los cambios de código ya están hechos y commiteados. Lo único que falta son pasos
manuales que requieren tu cuenta (crear el proyecto y obtener la contraseña).

---

## Qué cambió en el código

- `backend/database.py` — `normalize_db_url()` (convierte `postgres://` → `postgresql://`)
  y `make_engine()` con `pool_pre_ping=True` + `pool_recycle=300`, necesario porque
  Supabase free cierra conexiones ociosas y pausa la BD tras inactividad.
- `backend/main.py` — los endpoints `/api/admin/*` ahora usan `make_engine()`.
- `render.yaml` — se eliminó la BD de Render; `DATABASE_URL` ahora es un secreto
  (`sync: false`) que defines en el dashboard de Render.

---

## Paso 1 — Crear el proyecto en Supabase

1. Entra a https://supabase.com y crea cuenta (puedes usar GitHub).
2. **New project** → nombre `exd-control`, define una **Database Password** (guárdala).
   Elige la región más cercana (ej. `East US` o `South America (São Paulo)`).
3. Espera ~2 min a que aprovisione.

## Paso 2 — Obtener el connection string

1. En el proyecto → **Connect** (botón arriba) → pestaña **Connection string**.
2. Elige **Session pooler** (modo `Session`, puerto `5432`). Es compatible con IPv4 y
   con un proceso persistente como el backend en Render.
3. Copia la URL. Se ve así:
   ```
   postgresql://postgres.<ref>:[YOUR-PASSWORD]@aws-0-<region>.pooler.supabase.com:5432/postgres
   ```
4. Reemplaza `[YOUR-PASSWORD]` por la contraseña del Paso 1.

## Paso 3 — Configurar Render

1. https://dashboard.render.com → servicio `exd-dashboard` → **Environment**.
2. Añade/edita la variable `DATABASE_URL` con la URL completa del Paso 2.
3. Guarda. Render hará redeploy automáticamente.

## Paso 4 — Crear tablas y poblar datos

La BD nueva está vacía. Dos opciones:

**Opción A — desde tu máquina (recomendada, puebla los datos reales del equipo):**
```bash
cd backend
export DATABASE_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres"
pip install -r requirements.txt
python seed_data.py          # crea tablas (create_all) + upsert de datos reales
python -c "from main import migrate_skills_catalog; print(migrate_skills_catalog())"
```

**Opción B — solo crear tablas vacías (vía API, sin datos):**
```bash
curl -X POST https://exd-dashboard.onrender.com/api/admin/init-db
curl -X POST https://exd-dashboard.onrender.com/api/admin/migrate-skills-catalog
```

## Paso 5 — Verificar

```bash
curl https://exd-dashboard.onrender.com/api/health           # {"status":"healthy"}
curl https://exd-dashboard.onrender.com/api/dashboard/summary # conteos > 0 si poblaste
```
Abre https://exd-dashboard.vercel.app y confirma que carga datos.

---

## Nota importante sobre el free tier de Supabase

El proyecto **se pausa tras 7 días sin actividad**; mientras está pausado la BD no
responde hasta que alguien lo reactiva desde el dashboard. Si el dashboard se usa
con regularidad, no se pausará. Si te preocupa, opciones:

- Un cron que haga `GET /api/dashboard/summary` cada pocos días (mantiene viva la BD
  y de paso evita el arranque en frío de Render).
- Migrar a **Neon**, cuyo free tier no se pausa de la misma forma (reactivación
  instantánea y automática). El cambio sería solo otra `DATABASE_URL`.
