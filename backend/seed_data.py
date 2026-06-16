"""
seed_data.py
Pobla la base de datos con los datos reales del equipo ExD NTT DATA.
Uso: python seed_data.py

Requiere que la DB esté vacía o limpia:
  TRUNCATE personas, asignaciones, proyectos, oportunidades CASCADE;
"""

import os
import sys
from datetime import date
from dotenv import load_dotenv

load_dotenv()

# ── Setup path para importar modelos ────────────────────────────────────────
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine
from models import Base, Persona, Asignacion, Proyecto, Oportunidad

Base.metadata.create_all(bind=engine)
db = SessionLocal()


# ── HELPERS ──────────────────────────────────────────────────────────────────
def upsert_persona(data):
    existing = db.query(Persona).filter(Persona.id == data["id"]).first()
    if existing:
        for k, v in data.items():
            setattr(existing, k, v)
    else:
        db.add(Persona(**data))


def upsert_proyecto(data):
    existing = db.query(Proyecto).filter(Proyecto.id == data["id"]).first()
    if existing:
        for k, v in data.items():
            setattr(existing, k, v)
    else:
        db.add(Proyecto(**data))


# ═══════════════════════════════════════════════════════════════════════════
# 1. PERSONAS
# ═══════════════════════════════════════════════════════════════════════════

personas = [
    {
        "id": "carlos-rojas",
        "nombre": "Carlos Rojas",
        "rol": "Lead Designer",
        "empresa_actual": "NTT DATA Chile",
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Expert Designer",
        "anos_experiencia": None,
        "habilidades": ["UX Design", "Product Design", "UI Design"],
        "certificaciones": [],
        "intereses": [],
        "disponible_mentoria": True,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
    {
        "id": "alejandro-penaloza",
        "nombre": "Alejandro Peñaloza",
        "rol": "Senior UX/UI Designer",
        "empresa_actual": "NTT DATA Chile",
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Lead Designer",
        "anos_experiencia": 10,
        "habilidades": ["UX Design", "UI Design", "Service Design", "Design Systems"],
        "certificaciones": ["Diplomado UX Design - UFT"],
        "intereses": ["Enterprise UX", "Omnichannel", "UX Strategy"],
        "disponible_mentoria": True,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
    {
        "id": "alexandra-salosny",
        "nombre": "Alexandra Salosny",
        "rol": "Designer / Product Designer",
        "empresa_actual": "NTT DATA Chile",
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Designer",
        "anos_experiencia": None,
        "habilidades": ["Product Design", "UX Design"],
        "certificaciones": [],
        "intereses": ["Agentes Conversacionales", "Conversational UX"],
        "disponible_mentoria": False,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
    # Brigitte: ex-colaboradora, baja 2026-04-30 — incluida pero marcada con nivel sin asignación activa
    {
        "id": "brigitte-arriojas",
        "nombre": "Brigitte Arriojas",
        "rol": "Designer (ex-NTT DATA)",
        "empresa_actual": None,
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Designer",
        "anos_experiencia": None,
        "habilidades": ["UX Design", "UI Design"],
        "certificaciones": [],
        "intereses": [],
        "disponible_mentoria": False,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
    {
        "id": "carolina-espinoza",
        "nombre": "Carolina Espinoza",
        "rol": "Expert Designer",
        "empresa_actual": "NTT DATA Chile",
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Expert Designer",
        "anos_experiencia": None,
        "habilidades": ["UX Design", "UI Design", "Product Design", "Design Systems"],
        "certificaciones": [],
        "intereses": [],
        "disponible_mentoria": True,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
    {
        "id": "carolina-varela",
        "nombre": "Carolina Varela",
        "rol": "Designer",
        "empresa_actual": "NTT DATA Chile",
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Designer",
        "anos_experiencia": None,
        "habilidades": ["UX Design", "UI Design"],
        "certificaciones": [],
        "intereses": ["XR Design", "Spatial Computing", "AR/VR"],
        "disponible_mentoria": False,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
    {
        "id": "isidora-perez",
        "nombre": "Isidora Pérez",
        "rol": "Senior Experience Designer",
        "empresa_actual": "Thoughtworks / NTT DATA",
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Lead Designer",
        "anos_experiencia": 5,
        "habilidades": ["Service Design", "UX Research", "Product Design"],
        "certificaciones": [],
        "intereses": ["Expert Designer", "Thought Leadership", "IA/Agentic"],
        "disponible_mentoria": True,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
    {
        "id": "jaime-castillo",
        "nombre": "Jaime Castillo",
        "rol": "Lead Designer",
        "empresa_actual": "NTT DATA Chile",
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Expert Designer",
        "anos_experiencia": None,
        "habilidades": ["UX Design", "Product Design", "UI Design"],
        "certificaciones": [],
        "intereses": [],
        "disponible_mentoria": False,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
    {
        "id": "john-calderon",
        "nombre": "John Calderón",
        "rol": "Junior Designer",
        "empresa_actual": "NTT DATA Chile",
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Junior Designer",
        "anos_experiencia": None,
        "habilidades": ["UX Design"],
        "certificaciones": [],
        "intereses": [],
        "disponible_mentoria": False,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
    {
        "id": "jonathan-calderon",
        "nombre": "Jonathan Calderón",
        "rol": "Lead Designer",
        "empresa_actual": "NTT DATA Chile",
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Expert Designer",
        "anos_experiencia": None,
        "habilidades": ["UX Design", "Product Design", "UI Design"],
        "certificaciones": [],
        "intereses": [],
        "disponible_mentoria": True,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
    {
        "id": "lysset-hernandez",
        "nombre": "Lysset Hernández",
        "rol": "Junior Designer",
        "empresa_actual": "NTT DATA Chile",
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Junior Designer",
        "anos_experiencia": None,
        "habilidades": ["UI Design"],
        "certificaciones": [],
        "intereses": [],
        "disponible_mentoria": False,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
    {
        "id": "marcela-bozzo",
        "nombre": "Marcela Bozzo",
        "rol": "Lead Designer",
        "empresa_actual": "NTT DATA Chile",
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Expert Designer",
        "anos_experiencia": 17,
        "habilidades": ["UI Design", "UX Design", "UX Research", "Design Systems"],
        "certificaciones": ["Carrera UX/UI - Coderhouse", "Diseño Gráfico - PUCV"],
        "intereses": ["IA aplicada a diseño", "Thought Leadership", "Design Systems"],
        "disponible_mentoria": True,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
    {
        "id": "mauro-zuniga",
        "nombre": "Mauro Zúñiga",
        "rol": "Lead Designer",
        "empresa_actual": "NTT DATA Chile",
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Expert Designer",
        "anos_experiencia": None,
        "habilidades": ["UX Design", "UI Design", "Product Design"],
        "certificaciones": [],
        "intereses": [],
        "disponible_mentoria": False,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
    {
        "id": "raimundo-ruffin",
        "nombre": "Raimundo Ruffin",
        "rol": "Designer",
        "empresa_actual": "NTT DATA Chile",
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Designer",
        "anos_experiencia": None,
        "habilidades": ["UX Design", "Product Design"],
        "certificaciones": [],
        "intereses": [],
        "disponible_mentoria": False,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
    {
        "id": "rebecca-tapia",
        "nombre": "Rebecca Tapia",
        "rol": "UX Researcher / Analista CX",
        "empresa_actual": "Kaizen Gaming S.A.",
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Lead Designer",
        "anos_experiencia": 6,
        "habilidades": ["UX Research", "Product Design"],
        "certificaciones": ["Magíster en Procesamiento y Gestión de Datos - PUC"],
        "intereses": ["Python para Ciencia de Datos", "Data-driven UX", "Personas Sintéticas"],
        "disponible_mentoria": True,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
    {
        "id": "valentina-herrera",
        "nombre": "Valentina Herrera",
        "rol": "Junior Designer",
        "empresa_actual": "NTT DATA Chile",
        "area": "Digital Experience (DX)",
        "nivel_seniority": "Junior Designer",
        "anos_experiencia": None,
        "habilidades": ["UI Design", "UX Design"],
        "certificaciones": [],
        "intereses": [],
        "disponible_mentoria": False,
        "portfolio_link": None,
        "evaluacion_ultima": None,
        "evaluacion_historico": [],
    },
]


# ═══════════════════════════════════════════════════════════════════════════
# 2. PROYECTOS ACTIVOS
# Derivados de los proyectos 2026 en las fichas
# ═══════════════════════════════════════════════════════════════════════════

proyectos = [
    {
        "id": "latam-amelia",
        "nombre": "LATAM - Amelia",
        "cliente": "LATAM Airlines",
        "descripcion": "Proyecto LATAM Airlines - Amelia",
        "fase": "design",
        "porcentaje_completado": 50,
        "fecha_inicio": date(2026, 1, 1),
        "fecha_launch": date(2026, 12, 31),
        "stakeholder": "LATAM Airlines",
        "health": "on_track",
        "equipo": [{"persona_id": "carlos-rojas", "rol": "Lead Designer"}],
        "issues": None,
        "next_milestone": None,
    },
    {
        "id": "latam-canales",
        "nombre": "LATAM - Canales",
        "cliente": "LATAM Airlines",
        "descripcion": "Diseño de experiencia para canales digitales de LATAM Airlines",
        "fase": "design",
        "porcentaje_completado": 45,
        "fecha_inicio": date(2026, 1, 1),
        "fecha_launch": date(2026, 6, 30),
        "stakeholder": "LATAM Airlines",
        "health": "on_track",
        "equipo": [
            {"persona_id": "alexandra-salosny", "rol": "Designer"},
            {"persona_id": "carolina-varela", "rol": "Designer"},
            {"persona_id": "valentina-herrera", "rol": "Junior Designer"},
        ],
        "issues": None,
        "next_milestone": None,
    },
    {
        "id": "latam-compass",
        "nombre": "LATAM - Compass",
        "cliente": "LATAM Airlines",
        "descripcion": "Airport Operations - Demo Compass para Aeropuerto Digital (Apto+)",
        "fase": "design",
        "porcentaje_completado": 60,
        "fecha_inicio": date(2026, 1, 1),
        "fecha_launch": date(2026, 6, 30),
        "stakeholder": "Mariana Valenzuela (LATAM)",
        "health": "on_track",
        "equipo": [{"persona_id": "raimundo-ruffin", "rol": "Designer"}],
        "issues": None,
        "next_milestone": "Demo Compass presentada",
    },
    {
        "id": "latam-contingencias",
        "nombre": "LATAM - Contingencias",
        "cliente": "LATAM Airlines",
        "descripcion": "Experiencia de gestión de contingencias LATAM",
        "fase": "design",
        "porcentaje_completado": 40,
        "fecha_inicio": date(2026, 2, 1),
        "fecha_launch": date(2026, 6, 30),
        "stakeholder": "LATAM Airlines",
        "health": "on_track",
        "equipo": [{"persona_id": "isidora-perez", "rol": "Senior Experience Designer"}],
        "issues": None,
        "next_milestone": None,
    },
    {
        "id": "cas-nucleo",
        "nombre": "CAS - Núcleo",
        "cliente": "CAS",
        "descripcion": "Proyecto Núcleo para cliente CAS",
        "fase": "design",
        "porcentaje_completado": 55,
        "fecha_inicio": date(2026, 1, 1),
        "fecha_launch": date(2026, 9, 30),
        "stakeholder": "CAS",
        "health": "on_track",
        "equipo": [
            {"persona_id": "jaime-castillo", "rol": "Lead Designer"},
            {"persona_id": "john-calderon", "rol": "Junior Designer"},
            {"persona_id": "lysset-hernandez", "rol": "Junior Designer"},
        ],
        "issues": None,
        "next_milestone": None,
    },
    {
        "id": "itau",
        "nombre": "Itaú",
        "cliente": "Banco Itaú",
        "descripcion": "Experiencias financieras enterprise para Banco Itaú",
        "fase": "design",
        "porcentaje_completado": 50,
        "fecha_inicio": date(2026, 1, 1),
        "fecha_launch": date(2026, 6, 30),
        "stakeholder": "Banco Itaú",
        "health": "on_track",
        "equipo": [{"persona_id": "jonathan-calderon", "rol": "Lead Designer"}],
        "issues": None,
        "next_milestone": None,
    },
    {
        "id": "amsa",
        "nombre": "AMSA",
        "cliente": "AMSA",
        "descripcion": "Proyecto AMSA",
        "fase": "design",
        "porcentaje_completado": 40,
        "fecha_inicio": date(2026, 1, 1),
        "fecha_launch": date(2026, 12, 31),
        "stakeholder": "AMSA",
        "health": "on_track",
        "equipo": [{"persona_id": "carolina-espinoza", "rol": "Expert Designer"}],
        "issues": None,
        "next_milestone": None,
    },
    {
        "id": "banco-estado",
        "nombre": "Banco Estado",
        "cliente": "Banco Estado",
        "descripcion": "Diseño omnicanal para crédito consumo (WhatsApp, Contact Center, Sucursal)",
        "fase": "design",
        "porcentaje_completado": 30,
        "fecha_inicio": date(2026, 4, 1),
        "fecha_launch": date(2026, 6, 30),
        "stakeholder": "Banco Estado",
        "health": "on_track",
        "equipo": [{"persona_id": "alejandro-penaloza", "rol": "Senior Designer"}],
        "issues": None,
        "next_milestone": None,
    },
    {
        "id": "santander-evaluacion",
        "nombre": "Santander - Evaluación Clientes",
        "cliente": "Banco Santander",
        "descripcion": "Evaluación de clientes para Santander Chile",
        "fase": "discovery",
        "porcentaje_completado": 10,
        "fecha_inicio": date(2026, 5, 1),
        "fecha_launch": date(2026, 6, 30),
        "stakeholder": "Banco Santander",
        "health": "on_track",
        "equipo": [{"persona_id": "mauro-zuniga", "rol": "Lead Designer"}],
        "issues": None,
        "next_milestone": None,
    },
    {
        "id": "normaliza",
        "nombre": "Normaliza",
        "cliente": "Normaliza",
        "descripcion": "Proyecto Normaliza",
        "fase": "design",
        "porcentaje_completado": 40,
        "fecha_inicio": date(2026, 1, 1),
        "fecha_launch": date(2026, 6, 30),
        "stakeholder": "Normaliza",
        "health": "on_track",
        "equipo": [{"persona_id": "marcela-bozzo", "rol": "Lead Designer"}],
        "issues": None,
        "next_milestone": None,
    },
    {
        "id": "latam-cargo-miami",
        "nombre": "LATAM Cargo Miami",
        "cliente": "LATAM Airlines",
        "descripcion": "Simulador de manejo de grúas para LATAM Cargo Miami",
        "fase": "design",
        "porcentaje_completado": 20,
        "fecha_inicio": date(2026, 4, 1),
        "fecha_launch": date(2026, 6, 30),
        "stakeholder": "LATAM Cargo",
        "health": "on_track",
        "equipo": [{"persona_id": "carolina-varela", "rol": "Designer"}],
        "issues": None,
        "next_milestone": "Prototipo simulador v1",
    },
]


# ═══════════════════════════════════════════════════════════════════════════
# 3. ASIGNACIONES ACTIVAS (Mayo-Junio 2026)
# ═══════════════════════════════════════════════════════════════════════════

asignaciones = [
    # Carlos Rojas → LATAM Amelia (todo 2026)
    {"persona_id": "carlos-rojas",       "proyecto_id": "latam-amelia",        "cliente": "LATAM Airlines",  "dedicacion": 100, "fecha_inicio": date(2026, 1, 1),  "fecha_liberacion": date(2026, 12, 31)},
    # Alejandro Peñaloza → Banco Estado (ABR-JUN)
    {"persona_id": "alejandro-penaloza", "proyecto_id": "banco-estado",        "cliente": "Banco Estado",    "dedicacion": 100, "fecha_inicio": date(2026, 4, 1),  "fecha_liberacion": date(2026, 6, 30)},
    # Alexandra Salosny → LATAM Canales (todo 2026)
    {"persona_id": "alexandra-salosny", "proyecto_id": "latam-canales",        "cliente": "LATAM Airlines",  "dedicacion": 100, "fecha_inicio": date(2026, 1, 1),  "fecha_liberacion": date(2026, 6, 30)},
    # Carolina Espinoza → AMSA (todo 2026)
    {"persona_id": "carolina-espinoza", "proyecto_id": "amsa",                 "cliente": "AMSA",            "dedicacion": 100, "fecha_inicio": date(2026, 1, 1),  "fecha_liberacion": date(2026, 12, 31)},
    # Carolina Varela → LATAM Cargo Miami (ABR-JUN)
    {"persona_id": "carolina-varela",   "proyecto_id": "latam-cargo-miami",    "cliente": "LATAM Airlines",  "dedicacion": 100, "fecha_inicio": date(2026, 4, 1),  "fecha_liberacion": date(2026, 6, 30)},
    # Isidora Pérez → LATAM Contingencias (MAY-JUN)
    {"persona_id": "isidora-perez",     "proyecto_id": "latam-contingencias",  "cliente": "LATAM Airlines",  "dedicacion": 100, "fecha_inicio": date(2026, 5, 1),  "fecha_liberacion": date(2026, 6, 30)},
    # Jaime Castillo → CAS Nucleo (hasta SEP)
    {"persona_id": "jaime-castillo",    "proyecto_id": "cas-nucleo",           "cliente": "CAS",             "dedicacion": 100, "fecha_inicio": date(2026, 1, 1),  "fecha_liberacion": date(2026, 9, 30)},
    # John Calderón → CAS Nucleo (hasta SEP)
    {"persona_id": "john-calderon",     "proyecto_id": "cas-nucleo",           "cliente": "CAS",             "dedicacion": 100, "fecha_inicio": date(2026, 1, 1),  "fecha_liberacion": date(2026, 9, 30)},
    # Jonathan Calderón → Itaú (hasta JUN)
    {"persona_id": "jonathan-calderon", "proyecto_id": "itau",                 "cliente": "Banco Itaú",      "dedicacion": 100, "fecha_inicio": date(2026, 1, 1),  "fecha_liberacion": date(2026, 6, 30)},
    # Lysset Hernández → CAS Nucleo (hasta SEP)
    {"persona_id": "lysset-hernandez",  "proyecto_id": "cas-nucleo",           "cliente": "CAS",             "dedicacion": 100, "fecha_inicio": date(2026, 1, 1),  "fecha_liberacion": date(2026, 9, 30)},
    # Marcela Bozzo → Normaliza (hasta JUN)
    {"persona_id": "marcela-bozzo",     "proyecto_id": "normaliza",            "cliente": "Normaliza",       "dedicacion": 100, "fecha_inicio": date(2026, 1, 1),  "fecha_liberacion": date(2026, 6, 30)},
    # Mauro Zúñiga → Santander (MAY-JUN)
    {"persona_id": "mauro-zuniga",      "proyecto_id": "santander-evaluacion", "cliente": "Banco Santander", "dedicacion": 100, "fecha_inicio": date(2026, 5, 1),  "fecha_liberacion": date(2026, 6, 30)},
    # Raimundo Ruffin → LATAM Compass (hasta JUN)
    {"persona_id": "raimundo-ruffin",   "proyecto_id": "latam-compass",        "cliente": "LATAM Airlines",  "dedicacion": 100, "fecha_inicio": date(2026, 1, 1),  "fecha_liberacion": date(2026, 6, 30)},
    # Valentina Herrera → LATAM Canales (hasta JUN)
    {"persona_id": "valentina-herrera", "proyecto_id": "latam-canales",        "cliente": "LATAM Airlines",  "dedicacion": 100, "fecha_inicio": date(2026, 1, 1),  "fecha_liberacion": date(2026, 6, 30)},
    # Rebecca Tapia → Sin asignación en NTT (está en Kaizen Gaming externo)
    # Brigitte Arriojas → Sin asignación (baja 2026-04-30)
]


# ═══════════════════════════════════════════════════════════════════════════
# EJECUTAR SEED
# ═══════════════════════════════════════════════════════════════════════════

print("Poblando base de datos con datos reales del equipo ExD...")

print(f"  Insertando {len(personas)} personas...")
for p in personas:
    upsert_persona(p)
db.flush()  # Escribe personas a la DB antes de crear asignaciones

print(f"  Insertando {len(proyectos)} proyectos...")
for p in proyectos:
    upsert_proyecto(p)
db.flush()  # Escribe proyectos a la DB antes de crear asignaciones

print(f"  Insertando {len(asignaciones)} asignaciones activas...")
for a in asignaciones:
    db.add(Asignacion(**a, estado="active"))

db.commit()
db.close()

print()
print(f"OK — {len(personas)} personas, {len(proyectos)} proyectos, {len(asignaciones)} asignaciones insertadas.")
print()
print("Personas sin asignación activa (disponibles o externas):")
sin_asignacion = {"rebecca-tapia": "En Kaizen Gaming (externo)", "brigitte-arriojas": "Baja 2026-04-30"}
for pid, razon in sin_asignacion.items():
    print(f"  - {pid}: {razon}")
