from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas

router = APIRouter(prefix="/proyectos", tags=["proyectos"])


@router.get("/", response_model=List[schemas.ProyectoOut])
def list_proyectos(
    fase: Optional[str] = Query(None),
    health: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(models.Proyecto)
    if fase:
        q = q.filter(models.Proyecto.fase == fase)
    if health:
        q = q.filter(models.Proyecto.health == health)
    return q.order_by(models.Proyecto.nombre).all()


@router.get("/{proyecto_id}", response_model=schemas.ProyectoOut)
def get_proyecto(proyecto_id: str, db: Session = Depends(get_db)):
    p = db.query(models.Proyecto).filter(models.Proyecto.id == proyecto_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return p


@router.post("/", response_model=schemas.ProyectoOut, status_code=201)
def create_proyecto(data: schemas.ProyectoCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Proyecto).filter(models.Proyecto.id == data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="ID ya existe")
    proyecto = models.Proyecto(**data.model_dump())
    db.add(proyecto)
    db.commit()
    db.refresh(proyecto)
    return proyecto


@router.put("/{proyecto_id}", response_model=schemas.ProyectoOut)
def update_proyecto(proyecto_id: str, data: schemas.ProyectoUpdate, db: Session = Depends(get_db)):
    p = db.query(models.Proyecto).filter(models.Proyecto.id == proyecto_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(p, field, value)
    db.commit()
    db.refresh(p)
    return p


@router.delete("/{proyecto_id}", status_code=204)
def delete_proyecto(proyecto_id: str, db: Session = Depends(get_db)):
    p = db.query(models.Proyecto).filter(models.Proyecto.id == proyecto_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    db.delete(p)
    db.commit()
