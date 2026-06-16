"""
Skill Matrix — inventario del equipo organizado por el catálogo de skills.

A diferencia de las evaluaciones del framework de Carrera (que viven en
/carrera y `persona.evaluacion_ultima`), esta vista opera sobre el catálogo
de habilidades declaradas (`skills` table) y `persona.habilidades`.

Estructura de la respuesta (GET /):

  {
    "categorias_orden": ["Research", "Diseño", ..., "— Sin categoría —"],
    "data": {
      "<categoria>": {
        "categoria": str,
        "skills": [
          {
            "skill_id": str,
            "nombre": str,
            "activa": bool,
            "personas": [{persona_id, nombre, rol, nivel_seniority}],
            "distribucion": {Junior: n, Mid: n, Senior: n, Lead: n, Director: n}
          }, ...
        ]
      }, ...
    },
    "huerfanas": [
      {"nombre": str, "personas": [...]}    # declaradas pero NO en catálogo
    ],
    "total_personas": int,
    "total_skills_catalogo": int,
    "skills_sin_personas": int             # # de skills del catálogo con 0 personas
  }
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, List
from collections import defaultdict
from database import get_db
import models

router = APIRouter(prefix="/skill-matrix", tags=["skill-matrix"])

NIVELES = ["Junior Designer", "Designer", "Lead Designer", "Expert Designer", "Chief Designer"]
SIN_CATEGORIA = "— Sin categoría —"

# Orden preferido para las categorías sugeridas. Otras se ordenan alfabético.
CATEGORIAS_SUGERIDAS_ORDEN = [
    "Research, Discovery & Insight",
    "UX/UI, Interaction & Visual Design",
    "Product Design & Strategy",
    "Service Design & Transformation",
    "Design Systems, Accesibility & Quality",
    "Strategy, Business & Measurement",
    "Facilitation/Leadership & Stakeholder Management",
    "Technology, Tools, & AI Enablement",
    "Professional & Interpersonal Skills",
]


def _ordenar_categorias(cats: List[str]) -> List[str]:
    """Sugeridas en su orden, otras alfabéticas, '— Sin categoría —' al final."""
    sugeridas = [c for c in CATEGORIAS_SUGERIDAS_ORDEN if c in cats]
    sin_cat = [SIN_CATEGORIA] if SIN_CATEGORIA in cats else []
    otras = sorted(c for c in cats if c not in CATEGORIAS_SUGERIDAS_ORDEN and c != SIN_CATEGORIA)
    return sugeridas + otras + sin_cat


@router.get("/")
def get_skill_matrix(db: Session = Depends(get_db)):
    """Devuelve el inventario del equipo agrupado por categoría del catálogo."""
    skills = db.query(models.Skill).order_by(models.Skill.nombre).all()
    personas = db.query(models.Persona).order_by(models.Persona.nombre).all()

    # Catálogo: nombre -> Skill
    skill_by_nombre: Dict[str, models.Skill] = {s.nombre: s for s in skills}

    # Index inverso: skill_nombre -> [persona, ...]
    personas_por_skill: Dict[str, List[models.Persona]] = defaultdict(list)
    nombres_declarados = set()
    for p in personas:
        for hab in (p.habilidades or []):
            if isinstance(hab, str) and hab:
                personas_por_skill[hab].append(p)
                nombres_declarados.add(hab)

    # Construir agrupación por categoría
    grupos: Dict[str, List[dict]] = defaultdict(list)
    for s in skills:
        cat = s.categoria or SIN_CATEGORIA
        plist = personas_por_skill.get(s.nombre, [])
        distribucion = {nivel: 0 for nivel in NIVELES}
        for p in plist:
            if p.nivel_seniority in distribucion:
                distribucion[p.nivel_seniority] += 1

        grupos[cat].append({
            "skill_id": s.id,
            "nombre": s.nombre,
            "activa": s.activa,
            "descripcion": s.descripcion,
            "personas": [
                {
                    "persona_id": p.id,
                    "nombre": p.nombre,
                    "rol": p.rol,
                    "nivel_seniority": p.nivel_seniority,
                }
                for p in plist
            ],
            "distribucion": distribucion,
        })

    # Skills huérfanas: declaradas en alguna persona pero NO en el catálogo
    huerfanas = []
    for nombre in sorted(nombres_declarados - set(skill_by_nombre.keys())):
        plist = personas_por_skill[nombre]
        huerfanas.append({
            "nombre": nombre,
            "personas": [
                {"persona_id": p.id, "nombre": p.nombre, "nivel_seniority": p.nivel_seniority}
                for p in plist
            ],
        })

    categorias_orden = _ordenar_categorias(list(grupos.keys()))
    data = {
        cat: {
            "categoria": cat,
            "skills": grupos[cat],
        }
        for cat in categorias_orden
    }

    skills_sin_personas = sum(1 for s in skills if not personas_por_skill.get(s.nombre))

    return {
        "categorias_orden": categorias_orden,
        "data": data,
        "huerfanas": huerfanas,
        "total_personas": len(personas),
        "total_skills_catalogo": len(skills),
        "skills_sin_personas": skills_sin_personas,
    }


@router.get("/gaps")
def get_skill_gaps(db: Session = Depends(get_db)):
    """Skills del catálogo con 0 o 1 personas (gap real respecto al catálogo)."""
    skills = db.query(models.Skill).filter(models.Skill.activa == True).all()
    personas = db.query(models.Persona).all()

    counts: Dict[str, int] = defaultdict(int)
    for p in personas:
        for hab in (p.habilidades or []):
            if isinstance(hab, str):
                counts[hab] += 1

    gaps = []
    for s in skills:
        n = counts.get(s.nombre, 0)
        if n <= 1:
            gaps.append({
                "skill_id": s.id,
                "nombre": s.nombre,
                "categoria": s.categoria,
                "personas_count": n,
                "severidad": "alta" if n == 0 else "media",
            })
    return sorted(gaps, key=lambda g: (g["personas_count"], g["nombre"]))
