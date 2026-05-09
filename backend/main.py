from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import settings
from database import Base, engine
from routes import personas, asignaciones, proyectos, oportunidades, skill_matrix


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Note: Tables are created via alembic migrations in production
    # or manually via: python -c "from database import Base, engine; Base.metadata.create_all(bind=engine)"
    yield


app = FastAPI(
    title="ExD Control Center API",
    description="Centro de Control Operativo para el Equipo Experience Design",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(personas.router, prefix="/api")
app.include_router(asignaciones.router, prefix="/api")
app.include_router(proyectos.router, prefix="/api")
app.include_router(oportunidades.router, prefix="/api")
app.include_router(skill_matrix.router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok", "app": "ExD Control Center", "version": "1.0.0"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}


@app.post("/api/admin/init-db")
def init_db():
    """Initialize database tables. Call this endpoint once after deployment."""
    import os
    from sqlalchemy import create_engine as sa_create_engine

    try:
        # Read DATABASE_URL from environment (not from config which may have stale value)
        db_url = os.environ.get("DATABASE_URL", "postgresql://localhost/exd_control")
        print(f"[DEBUG] Using DATABASE_URL: {db_url[:50]}...")

        # Create a fresh engine with the correct DATABASE_URL
        temp_engine = sa_create_engine(db_url)
        Base.metadata.create_all(bind=temp_engine)
        temp_engine.dispose()

        return {"status": "success", "message": "Database tables created successfully!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/api/admin/migrate-proyecto-types")
def migrate_proyecto_types():
    """Idempotent migration: add `tipo` and `estado` columns to `proyectos`.

    Adds enum types and columns if missing. Safe to call multiple times.
    Existing rows default to tipo='fixed_scope', estado='active'.
    """
    import os
    from sqlalchemy import create_engine as sa_create_engine, text

    db_url = os.environ.get("DATABASE_URL", "postgresql://localhost/exd_control")
    temp_engine = sa_create_engine(db_url)

    statements = [
        # Create enum types if they don't exist (PostgreSQL requires this dance)
        """
        DO $$ BEGIN
            CREATE TYPE proyecto_tipo_enum AS ENUM ('fixed_scope', 'time_materials');
        EXCEPTION WHEN duplicate_object THEN null; END $$;
        """,
        """
        DO $$ BEGIN
            CREATE TYPE proyecto_estado_enum AS ENUM ('pre_sales', 'active', 'paused', 'completed', 'cancelled');
        EXCEPTION WHEN duplicate_object THEN null; END $$;
        """,
        # Add columns if they don't exist
        """
        ALTER TABLE proyectos
        ADD COLUMN IF NOT EXISTS tipo proyecto_tipo_enum NOT NULL DEFAULT 'fixed_scope';
        """,
        """
        ALTER TABLE proyectos
        ADD COLUMN IF NOT EXISTS estado proyecto_estado_enum NOT NULL DEFAULT 'active';
        """,
    ]

    try:
        with temp_engine.begin() as conn:
            for stmt in statements:
                conn.execute(text(stmt))
        temp_engine.dispose()
        return {"status": "success", "message": "Proyecto type/estado columns migrated"}
    except Exception as e:
        temp_engine.dispose()
        return {"status": "error", "message": str(e)}


@app.get("/api/dashboard/summary")
def dashboard_summary(db=None):
    """Quick stats para el dashboard principal."""
    from database import SessionLocal
    from sqlalchemy import func
    from datetime import date, timedelta
    import models

    db = SessionLocal()
    try:
        total_personas = db.query(func.count(models.Persona.id)).scalar()
        asignaciones_activas = db.query(func.count(models.Asignacion.id)).filter(
            models.Asignacion.estado == "active"
        ).scalar()
        proyectos_activos = db.query(func.count(models.Proyecto.id)).scalar()
        oportunidades_abiertas = db.query(func.count(models.Oportunidad.id)).filter(
            models.Oportunidad.status.in_(["opportunity", "approved", "bidding"])
        ).scalar()

        # Liberaciones próximas (14 días)
        hoy = date.today()
        limite = hoy + timedelta(days=14)
        liberaciones = db.query(models.Asignacion).filter(
            models.Asignacion.estado == "active",
            models.Asignacion.fecha_liberacion >= hoy,
            models.Asignacion.fecha_liberacion <= limite,
        ).count()

        # At risk
        at_risk = db.query(func.count(models.Proyecto.id)).filter(
            models.Proyecto.health.in_(["at_risk", "blocked"])
        ).scalar()

        return {
            "total_personas": total_personas,
            "asignaciones_activas": asignaciones_activas,
            "proyectos_activos": proyectos_activos,
            "oportunidades_abiertas": oportunidades_abiertas,
            "liberaciones_proximas": liberaciones,
            "proyectos_at_risk": at_risk,
        }
    finally:
        db.close()


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=settings.DEBUG)
