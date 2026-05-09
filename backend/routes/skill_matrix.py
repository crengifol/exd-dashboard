from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict
from database import get_db
import models

router = APIRouter(prefix="/skill-matrix", tags=["skill-matrix"])

# ── Framework de competencias por perfil ─────────────────────────────────────
# Espejo de COMPETENCIAS / PERFILES en frontend/src/pages/Carrera.jsx.
# Mantener sincronizado con esa fuente.

PERFILES = ["UX Research", "UX Design", "UI Design", "Product Design", "Service Design"]

COMPETENCIAS_POR_PERFIL: Dict[str, List[str]] = {
    "UX Research": [
        "Research Planning & Strategy", "Qualitative Methods", "Quantitative Methods",
        "Synthesis & Artifacts", "Communication & Storytelling",
        "AI Tool Fluency", "AI Applied to Research", "AI Critical Judgment",
    ],
    "UX Design": [
        "User Research & Empathy", "Interaction Design & Flows", "Information Architecture",
        "Design Systems & Consistency", "Prototyping & Fidelity", "Accessibility (WCAG)",
        "Design-to-Code Collaboration", "AI Tool Fluency", "AI Applied to Design", "AI Critical Judgment",
    ],
    "UI Design": [
        "Visual Hierarchy & Aesthetics", "Design Systems & Tokens", "Interaction Feedback",
        "Accessibility & Inclusion", "Responsive Design",
        "AI Tool Fluency", "AI Applied to Design Systems", "AI Critical Judgment",
    ],
    "Product Design": [
        "User Research & Validation", "Problem Framing & Strategy", "Interaction Design & Prototyping",
        "Metrics & Analytics", "Design Systems Thinking", "Stakeholder Management", "Business Acumen & ROI",
        "AI Tool Fluency", "AI Applied to Product", "AI Critical Judgment",
    ],
    "Service Design": [
        "Service Blueprinting & Journey Mapping", "Facilitation & Co-design", "Systems Thinking",
        "Research Integration", "Service Measurement & KPIs", "Organizational Design & Change",
        "AI Tool Fluency", "AI Applied to Service Design", "AI Critical Judgment",
    ],
}


def detectar_perfil(rol: Optional[str]) -> str:
    """Espejo de detectarPerfil() en Carrera.jsx. Default: UX Design."""
    r = (rol or "").lower()
    if "research" in r:
        return "UX Research"
    if "service" in r:
        return "Service Design"
    if "product" in r:
        return "Product Design"
    if "ui" in r:
        return "UI Design"
    return "UX Design"


def consenso_competencia(eval_data: dict, comp: str) -> Optional[float]:
    """Score consenso = promedio de las perspectivas no-null (self/manager/peer)."""
    if not eval_data or not isinstance(eval_data, dict):
        return None
    scores = []
    for perspectiva in ("self", "manager", "peer"):
        bloque = eval_data.get(perspectiva)
        if isinstance(bloque, dict):
            valor = bloque.get(comp)
            if valor is not None:
                scores.append(valor)
    if not scores:
        return None
    return round(sum(scores) / len(scores), 1)


def _build_perfil_data(prf: str, personas_perfil: list) -> dict:
    """Construye la estructura de respuesta para un perfil concreto."""
    comps = COMPETENCIAS_POR_PERFIL[prf]
    evaluados = []
    no_evaluados = []

    for p in personas_perfil:
        eval_ = p.evaluacion_ultima
        # Solo cuenta como evaluación válida si:
        #   - existe el JSON
        #   - es un dict
        #   - su perfil coincide con el perfil de la persona
        es_valida = (
            eval_
            and isinstance(eval_, dict)
            and eval_.get("perfil") == prf
        )

        if es_valida:
            scores = {comp: consenso_competencia(eval_, comp) for comp in comps}
            vals = [s for s in scores.values() if s is not None]
            promedio = round(sum(vals) / len(vals), 1) if vals else None
            evaluados.append({
                "persona_id": p.id,
                "nombre": p.nombre,
                "nivel_seniority": p.nivel_seniority,
                "rol": p.rol,
                "evaluado": True,
                "fecha_evaluacion": eval_.get("fecha"),
                "periodo": eval_.get("periodo"),
                "scores": scores,
                "promedio": promedio,
            })
        else:
            no_evaluados.append({
                "persona_id": p.id,
                "nombre": p.nombre,
                "nivel_seniority": p.nivel_seniority,
                "rol": p.rol,
                "evaluado": False,
                "habilidades_declaradas": p.habilidades or [],
            })

    # Skill gaps — solo se calculan a partir de evaluaciones reales.
    # Sin evaluaciones no hay datos para detectar gaps.
    gaps = []
    for comp in comps:
        scores_comp = [
            e["scores"].get(comp)
            for e in evaluados
            if e["scores"].get(comp) is not None
        ]
        if scores_comp:
            promedio = round(sum(scores_comp) / len(scores_comp), 1)
            if len(scores_comp) < 3 or promedio < 2.5:
                severidad = "alta" if (len(scores_comp) < 2 or promedio < 2) else "media"
                gaps.append({
                    "competencia": comp,
                    "personas_evaluadas": len(scores_comp),
                    "score_promedio": promedio,
                    "severidad": severidad,
                })

    return {
        "perfil": prf,
        "competencias": comps,
        "evaluados": evaluados,
        "no_evaluados": no_evaluados,
        "skill_gaps": gaps,
        "total_personas": len(personas_perfil),
        "total_evaluados": len(evaluados),
    }


@router.get("/")
def get_skill_matrix(
    perfil: Optional[str] = Query(None, description="Filtrar por un perfil específico."),
    db: Session = Depends(get_db),
):
    """
    Skill matrix agrupada por perfil.

    Para cada persona del perfil:
      - Si tiene `evaluacion_ultima` cuyo `perfil` coincide → scores consenso reales (1-5)
        por competencia (promedio de self/manager/peer).
      - Si no → entra en `no_evaluados` con sus `habilidades_declaradas`.

    Skill gaps se calculan solo sobre evaluaciones reales (sin evaluaciones no hay gap).
    """
    personas = db.query(models.Persona).order_by(models.Persona.nombre).all()
    perfiles_persona = {p.id: detectar_perfil(p.rol) for p in personas}

    # Determinar qué perfiles incluir
    if perfil:
        if perfil not in COMPETENCIAS_POR_PERFIL:
            return {
                "error": f"Perfil desconocido: {perfil}",
                "perfiles": PERFILES,
                "data": {},
            }
        perfiles_a_devolver = [perfil]
    else:
        perfiles_a_devolver = PERFILES

    resultado = {}
    for prf in perfiles_a_devolver:
        personas_perfil = [p for p in personas if perfiles_persona[p.id] == prf]
        resultado[prf] = _build_perfil_data(prf, personas_perfil)

    return {
        "perfiles": PERFILES,
        "data": resultado,
    }


@router.get("/gaps")
def get_skill_gaps(db: Session = Depends(get_db)):
    """Skill gaps consolidados de todos los perfiles. Solo basados en evaluaciones reales."""
    matriz = get_skill_matrix(perfil=None, db=db)
    all_gaps = []
    for prf, data in matriz.get("data", {}).items():
        for gap in data["skill_gaps"]:
            all_gaps.append({**gap, "perfil": prf})
    return sorted(all_gaps, key=lambda x: (x["severidad"] != "alta", x["personas_evaluadas"]))
