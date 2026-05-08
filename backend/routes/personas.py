from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas

router = APIRouter(prefix="/personas", tags=["personas"])


@router.get("/", response_model=List[schemas.PersonaOut])
def list_personas(
    nivel: Optional[str] = Query(None),
    habilidad: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(models.Persona)
    if nivel:
        q = q.filter(models.Persona.nivel_seniority == nivel)
    personas = q.order_by(models.Persona.nombre).all()
    if habilidad:
        personas = [p for p in personas if habilidad in (p.habilidades or [])]
    return personas


@router.get("/{persona_id}", response_model=schemas.PersonaOut)
def get_persona(persona_id: str, db: Session = Depends(get_db)):
    persona = db.query(models.Persona).filter(models.Persona.id == persona_id).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    return persona


@router.post("/", response_model=schemas.PersonaOut, status_code=201)
def create_persona(data: schemas.PersonaCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Persona).filter(models.Persona.id == data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="ID ya existe")
    persona = models.Persona(**data.model_dump())
    db.add(persona)
    db.commit()
    db.refresh(persona)
    return persona


@router.put("/{persona_id}", response_model=schemas.PersonaOut)
def update_persona(persona_id: str, data: schemas.PersonaUpdate, db: Session = Depends(get_db)):
    persona = db.query(models.Persona).filter(models.Persona.id == persona_id).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(persona, field, value)
    db.commit()
    db.refresh(persona)
    return persona


@router.delete("/{persona_id}", status_code=204)
def delete_persona(persona_id: str, db: Session = Depends(get_db)):
    persona = db.query(models.Persona).filter(models.Persona.id == persona_id).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    db.delete(persona)
    db.commit()
