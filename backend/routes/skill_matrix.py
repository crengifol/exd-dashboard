from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
import models

router = APIRouter(prefix="/skill-matrix", tags=["skill-matrix"])

COMPETENCIAS = ["UX Research", "UI Design", "Product Design", "Service Design", "Design Systems"]

NIVEL_SCORE = {"Junior": 1, "Mid": 2, "Senior": 3, "Lead": 4, "Director": 5}


@router.get("/")
def get_skill_matrix(
    competencia: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Retorna la matriz de habilidades del equipo.
    - Filas: personas
    - Columnas: competencias (COMPETENCIAS)
    - Valor: {'tiene': bool, 'nivel_score': int, 'nivel': str}
    """
    personas = db.query(models.Persona).order_by(models.Persona.nombre).all()

    competencias_filtradas = COMPETENCIAS
    if competencia:
        competencias_filtradas = [c for c in COMPETENCIAS if competencia.lower() in c.lower()]

    matriz = []
    for p in personas:
        habilidades = p.habilidades or []
        nivel_score = NIVEL_SCORE.get(p.nivel_seniority, 0)

        skills = {}
        for comp in competencias_filtradas:
            tiene = comp in habilidades
            skills[comp] = {
                "tiene": tiene,
                "nivel_score": nivel_score if tiene else 0,
                "nivel": p.nivel_seniority if tiene else None,
            }

        matriz.append({
            "persona_id": p.id,
            "nombre": p.nombre,
            "nivel_seniority": p.nivel_seniority,
            "skills": skills,
        })

    # Summary: por cada competencia, contar personas y nivel promedio
    summary = {}
    for comp in competencias_filtradas:
        tiene_comp = [row for row in matriz if row["skills"][comp]["tiene"]]
        scores = [NIVEL_SCORE.get(r["nivel_seniority"], 0) for r in tiene_comp]
        summary[comp] = {
            "total_personas": len(tiene_comp),
            "score_promedio": round(sum(scores) / len(scores), 1) if scores else 0,
        }

    return {
        "competencias": competencias_filtradas,
        "personas": matriz,
        "summary": summary,
    }


@router.get("/gaps")
def get_skill_gaps(db: Session = Depends(get_db)):
    """Identifica competencias con menos de 3 personas o score promedio < 2."""
    personas = db.query(models.Persona).all()
    gaps = []

    for comp in COMPETENCIAS:
        tiene_comp = [p for p in personas if comp in (p.habilidades or [])]
        scores = [NIVEL_SCORE.get(p.nivel_seniority, 0) for p in tiene_comp]
        promedio = round(sum(scores) / len(scores), 1) if scores else 0

        if len(tiene_comp) < 3 or promedio < 2:
            gaps.append({
                "competencia": comp,
                "personas_con_skill": len(tiene_comp),
                "score_promedio": promedio,
                "severidad": "alta" if len(tiene_comp) < 2 else "media",
            })

    return sorted(gaps, key=lambda x: x["personas_con_skill"])
