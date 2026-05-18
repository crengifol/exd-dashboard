export const NIVELES = ['Junior', 'Mid', 'Senior', 'Lead', 'Director']

export const COMPETENCIAS = [
  'UX Research',
  'UI Design',
  'Product Design',
  'Service Design',
  'Design Systems',
]

export const FASES_PROYECTO = ['discovery', 'design', 'testing', 'launch', 'evolution']

export const FASES_LABEL = {
  discovery: 'Discovery',
  design: 'Design',
  testing: 'Testing',
  launch: 'Launch',
  evolution: 'Evolution',
}

// Tipo de engagement: proyecto cerrado (fixed scope) vs T&M (capacidad)
export const TIPO_PROYECTO = ['fixed_scope', 'time_materials']

export const TIPO_LABEL = {
  fixed_scope:    'Proyecto',
  time_materials: 'Time & Materials',
}

export const TIPO_COLOR = {
  fixed_scope:    'bg-indigo-100 text-indigo-700',
  time_materials: 'bg-cyan-100 text-cyan-700',
}

// Estado operativo (aplica a ambos tipos)
export const ESTADOS_PROYECTO = ['pre_sales', 'active', 'paused', 'completed', 'cancelled']

export const ESTADO_LABEL = {
  pre_sales:  'Pre-venta',
  active:     'Activo',
  paused:     'Pausado',
  completed:  'Completado',
  cancelled:  'Cancelado',
}

export const ESTADO_COLOR = {
  pre_sales:  'bg-violet-100 text-violet-700',
  active:     'bg-emerald-100 text-emerald-700',
  paused:     'bg-amber-100 text-amber-700',
  completed:  'bg-gray-200 text-gray-700',
  cancelled:  'bg-red-100 text-red-700',
}

export const OPORTUNIDAD_STATUS = ['opportunity', 'approved', 'bidding', 'signed', 'executing']

export const OPORTUNIDAD_STATUS_LABEL = {
  opportunity: 'Oportunidad',
  approved: 'Aprobada',
  bidding: 'En Licitación',
  signed: 'Firmada',
  executing: 'En Ejecución',
}

export const HEALTH_COLOR = {
  on_track: 'bg-emerald-100 text-emerald-700',
  at_risk:  'bg-amber-100 text-amber-700',
  blocked:  'bg-red-100 text-red-700',
}

export const HEALTH_LABEL = {
  on_track: 'En curso',
  at_risk:  'En riesgo',
  blocked:  'Bloqueado',
}

export const NIVEL_COLOR = {
  Junior:   'bg-gray-100 text-gray-600',
  Mid:      'bg-sky-100 text-sky-700',
  Senior:   'bg-brand-100 text-brand-600',
  Lead:     'bg-violet-100 text-violet-700',
  Director: 'bg-pink-100 text-pink-700',
}

// Heatmap skill: score 0-5 → bg color (escala de brand)
export const SKILL_COLORS = [
  'bg-gray-100',     // 0 — sin skill
  'bg-brand-100',    // 1 — Junior
  'bg-brand-200',    // 2 — Mid
  'bg-brand-300',    // 3 — Senior
  'bg-brand-500',    // 4 — Lead
  'bg-brand-700',    // 5 — Director
]
