from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings


def normalize_db_url(url: str) -> str:
    """Normaliza el connection string para SQLAlchemy + psycopg2.

    Supabase (y otros) entregan la URL con el esquema `postgres://`, pero
    SQLAlchemy 2.x exige `postgresql://`. Esta función hace el reemplazo de
    forma idempotente.
    """
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url


def make_engine(url: str):
    """Crea un engine con parámetros aptos para Postgres gestionado (Supabase).

    `pool_pre_ping` valida cada conexión antes de usarla: imprescindible porque
    el free tier de Supabase cierra conexiones ociosas y pausa la BD tras
    inactividad. `pool_recycle` recicla conexiones antes de que el pooler las
    descarte.
    """
    return create_engine(
        normalize_db_url(url),
        pool_pre_ping=True,
        pool_recycle=300,
    )


engine = make_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
