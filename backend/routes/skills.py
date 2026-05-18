from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import re
import unicodedata
from database import get_db
import models, schemas

router = APIRouter(prefix="/skills", tags=["skills"])


def _slugify(text: str) -> str:
    """Genera un slug minúsculas-con-guiones a partir del nombre."""
    if not text:
        return ""
    # Quita acentos
    nfkd = unicodedata.normalize("NFKD", text)
    ascii_only = "".join(c for c in nfkd if not unicodedata.combining(c))
    # A minúsculas, espacios y caracteres no-alfanuméricos -> guión, comprime guiones
    s = ascii_only.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s or "skill"


def _personas_count(db: Session, skill_nombre: str) -> int:
    """Cuenta personas que tienen `skill_nombre` en su array de habilidades."""
    # Postgres JSONB: usar el operador ? para ver si contiene el string
    # SQLAlchemy: cast a text + LIKE como fallback portable
    personas = db.query(models.Persona).all()
    return sum(1 for p in personas if skill_nombre in (p.habilidades or []))


@router.get("/", response_model=List[schemas.SkillOut])
def list_skills(db: Session = Depends(get_db)):
    """Lista todas las skills del catálogo, con conteo de uso."""
    skills = db.query(models.Skill).order_by(
        models.Skill.categoria.nullslast(), models.Skill.nombre
    ).all()
    # Calcular personas_count en una sola pasada por la tabla personas
    personas = db.query(models.Persona).all()
    use_counts = {}
    for p in personas:
        for hab in (p.habilidades or []):
            use_counts[hab] = use_counts.get(hab, 0) + 1

    out = []
    for s in skills:
        s_dict = {
            "id": s.id, "nombre": s.nombre, "categoria": s.categoria,
            "descripcion": s.descripcion, "activa": s.activa,
            "created_at": s.created_at, "updated_at": s.updated_at,
            "personas_count": use_counts.get(s.nombre, 0),
        }
        out.append(s_dict)
    return out


@router.get("/categorias", response_model=List[str])
def list_categorias(db: Session = Depends(get_db)):
    """Devuelve las categorías existentes (para autocompletar en el form)."""
    rows = db.query(models.Skill.categoria).filter(models.Skill.categoria.isnot(None)).distinct().all()
    return sorted([r[0] for r in rows])


@router.post("/", response_model=schemas.SkillOut, status_code=201)
def create_skill(data: schemas.SkillCreate, db: Session = Depends(get_db)):
    """Crea una skill nueva. Si no se da `id`, se genera del nombre."""
    skill_id = data.id or _slugify(data.nombre)
    if not skill_id:
        raise HTTPException(status_code=400, detail="Nombre inválido")

    # ID único
    if db.query(models.Skill).filter(models.Skill.id == skill_id).first():
        raise HTTPException(status_code=400, detail=f"Ya existe una skill con id '{skill_id}'")
    # Nombre único
    if db.query(models.Skill).filter(models.Skill.nombre == data.nombre).first():
        raise HTTPException(status_code=400, detail=f"Ya existe una skill con nombre '{data.nombre}'")

    skill = models.Skill(
        id=skill_id,
        nombre=data.nombre,
        categoria=data.categoria,
        descripcion=data.descripcion,
        activa=data.activa if data.activa is not None else True,
    )
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return {**skill.__dict__, "personas_count": 0}


@router.put("/{skill_id}", response_model=schemas.SkillOut)
def update_skill(skill_id: str, data: schemas.SkillUpdate, db: Session = Depends(get_db)):
    """
    Edita una skill. Si cambia el nombre, propaga el cambio a `personas.habilidades`
    para mantener consistencia.
    """
    skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill no encontrada")

    payload = data.model_dump(exclude_unset=True)

    # Si renombra: validar unicidad y propagar a personas
    if "nombre" in payload and payload["nombre"] != skill.nombre:
        nuevo = payload["nombre"]
        existe = db.query(models.Skill).filter(
            models.Skill.nombre == nuevo, models.Skill.id != skill.id
        ).first()
        if existe:
            raise HTTPException(status_code=400, detail=f"Ya existe una skill con nombre '{nuevo}'")
        # Propagar a personas
        viejo = skill.nombre
        personas = db.query(models.Persona).all()
        for p in personas:
            habs = p.habilidades or []
            if viejo in habs:
                p.habilidades = [nuevo if h == viejo else h for h in habs]

    for field, value in payload.items():
        setattr(skill, field, value)

    db.commit()
    db.refresh(skill)
    return {**skill.__dict__, "personas_count": _personas_count(db, skill.nombre)}


@router.delete("/{skill_id}", status_code=204)
def delete_skill(skill_id: str, db: Session = Depends(get_db)):
    """
    Borra una skill SI no está en uso. Si está en uso, error 409.
    Para "ocultar" una skill en uso, edita y pon `activa=false`.
    """
    skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill no encontrada")

    count = _personas_count(db, skill.nombre)
    if count > 0:
        raise HTTPException(
            status_code=409,
            detail=f"La skill está en uso por {count} persona(s). Quítala de sus perfiles, o desactívala en lugar de borrarla.",
        )
    db.delete(skill)
    db.commit()
