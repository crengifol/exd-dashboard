from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, timedelta
from database import get_db
import models, schemas

router = APIRouter(prefix="/asignaciones", tags=["asignaciones"])


@router.get("/", response_model=List[schemas.AsignacionOut])
def list_asignaciones(
    estado: Optional[str] = Query(None),
    persona_id: Optional[str] = Query(None),
    libera_antes: Optional[date] = Query(None, description="Personas que se liberan antes de esta fecha"),
    db: Session = Depends(get_db)
):
    q = db.query(models.Asignacion)
    if estado:
        q = q.filter(models.Asignacion.estado == estado)
    if persona_id:
        q = q.filter(models.Asignacion.persona_id == persona_id)
    if libera_antes:
        q = q.filter(models.Asignacion.fecha_liberacion <= libera_antes)
    return q.order_by(models.Asignacion.fecha_liberacion).all()


@router.get("/proximas-liberaciones", response_model=List[schemas.AsignacionOut])
def proximas_liberaciones(dias: int = 14, db: Session = Depends(get_db)):
    """Personas que se liberan en los próximos N días (default 14)."""
    hoy = date.today()
    limite = hoy + timedelta(days=dias)
    return (
        db.query(models.Asignacion)
        .filter(
            models.Asignacion.estado == "active",
            models.Asignacion.fecha_liberacion >= hoy,
            models.Asignacion.fecha_liberacion <= limite
        )
        .order_by(models.Asignacion.fecha_liberacion)
        .all()
    )


@router.get("/{asignacion_id}", response_model=schemas.AsignacionOut)
def get_asignacion(asignacion_id: str, db: Session = Depends(get_db)):
    a = db.query(models.Asignacion).filter(models.Asignacion.id == asignacion_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Asignacion no encontrada")
    return a


@router.post("/", response_model=schemas.AsignacionOut, status_code=201)
def create_asignacion(data: schemas.AsignacionCreate, db: Session = Depends(get_db)):
    persona = db.query(models.Persona).filter(models.Persona.id == data.persona_id).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    asignacion = models.Asignacion(**data.model_dump())
    db.add(asignacion)
    db.commit()
    db.refresh(asignacion)
    return asignacion


@router.put("/{asignacion_id}", response_model=schemas.AsignacionOut)
def update_asignacion(asignacion_id: str, data: schemas.AsignacionUpdate, db: Session = Depends(get_db)):
    a = db.query(models.Asignacion).filter(models.Asignacion.id == asignacion_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Asignacion no encontrada")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(a, field, value)
    db.commit()
    db.refresh(a)
    return a


@router.delete("/{asignacion_id}", status_code=204)
def delete_asignacion(asignacion_id: str, db: Session = Depends(get_db)):
    a = db.query(models.Asignacion).filter(models.Asignacion.id == asignacion_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Asignacion no encontrada")
    db.delete(a)
    db.commit()
