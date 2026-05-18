import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { skillMatrixApi } from '../services/api'
import { NIVEL_COLOR, NIVELES } from '../utils/constants'
import clsx from 'clsx'

const SIN_CATEGORIA = '— Sin categoría —'
const HUERFANAS_TAB = '__huerfanas__'

const CAT_COLOR = {
  'Research, Discovery & Insight':                            'text-violet-700 bg-violet-50 border-violet-200',
  'UX/UI, Interaction & Visual Design':                       'text-indigo-700 bg-indigo-50 border-indigo-200',
  'Product Design & Strategy':                                'text-blue-700 bg-blue-50 border-blue-200',
  'Service Design & Transformation':                          'text-cyan-700 bg-cyan-50 border-cyan-200',
  'Design Systems, Accesibility & Quality':                   'text-teal-700 bg-teal-50 border-teal-200',
  'Strategy, Business & Measurement':                         'text-amber-700 bg-amber-50 border-amber-200',
  'Facilitation/Leadership & Stakeholder Management':         'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Technology, Tools, & AI Enablement':                       'text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200',
  'Professional & Interpersonal Skills':                      'text-pink-700 bg-pink-50 border-pink-200',
}
const catColor = c => CAT_COLOR[c] ?? 'text-gray-700 bg-gray-50 border-gray-200'

const NIVEL_DOT = {
  Junior:   'bg-gray-400',
  Mid:      'bg-sky-500',
  Senior:   'bg-brand-500',
  Lead:     'bg-violet-500',
  Director: 'bg-pink-500',
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CARD POR SKILL
// ═══════════════════════════════════════════════════════════════════════════════
function SkillCard({ skill }) {
  const total = skill.personas.length
  const empty = total === 0

  // Niveles con > 0
  const nivelesPresentes = NIVELES.filter(n => skill.distribucion[n] > 0)

  return (
    <div className={clsx(
      'rounded-2xl border p-4 transition-shadow',
      empty
        ? 'border-amber-200 bg-amber-50'
        : 'border-gray-200 bg-white hover:shadow-md',
      !skill.activa && 'opacity-60',
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-bold text-gray-900 truncate">{skill.nombre}</p>
            {!skill.activa && (
              <span className="text-[10px] uppercase tracking-wider bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                inactiva
              </span>
            )}
          </div>
          {skill.descripcion && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{skill.descripcion}</p>
          )}
        </div>
        <span className={clsx(
          'shrink-0 text-xs font-bold px-2 py-0.5 rounded-full',
          empty ? 'bg-amber-200 text-amber-800' : 'bg-brand-50 text-brand-700',
        )}>
          {total}
        </span>
      </div>

      {empty ? (
        <p className="text-xs text-amber-700 italic">
          ⚠️ Nadie en el equipo declara esta skill.
        </p>
      ) : (
        <>
          {/* Mini barra de distribución de seniority */}
          {nivelesPresentes.length > 0 && (
            <div className="mb-3">
              <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-100">
                {NIVELES.map(n => {
                  const v = skill.distribucion[n]
                  if (!v) return null
                  return (
                    <div key={n} className={NIVEL_DOT[n]}
                      style={{ width: `${(v / total) * 100}%` }} title={`${n}: ${v}`} />
                  )
                })}
              </div>
              <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 mt-1.5">
                {nivelesPresentes.map(n => (
                  <span key={n} className="text-[10px] text-gray-500 inline-flex items-center gap-1">
                    <span className={clsx('w-1.5 h-1.5 rounded-full', NIVEL_DOT[n])} />
                    {n} <span className="text-gray-400">{skill.distribucion[n]}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Personas */}
          <div className="flex flex-wrap gap-1">
            {skill.personas.map(p => (
              <span key={p.persona_id}
                className={clsx('badge text-xs', NIVEL_COLOR[p.nivel_seniority] ?? 'bg-gray-100 text-gray-600')}
                title={`${p.nombre} · ${p.nivel_seniority} · ${p.rol}`}>
                {p.nombre}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  HUÉRFANAS — skills declaradas en personas pero no en el catálogo
// ═══════════════════════════════════════════════════════════════════════════════
function HuerfanaCard({ huerfana }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900 truncate">{huerfana.nombre}</p>
          <p className="text-xs text-amber-700 mt-0.5">
            ⚠️ No está en el catálogo
          </p>
        </div>
        <span className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
          {huerfana.personas.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {huerfana.personas.map(p => (
          <span key={p.persona_id}
            className={clsx('badge text-xs', NIVEL_COLOR[p.nivel_seniority] ?? 'bg-gray-100 text-gray-600')}>
            {p.nombre}
          </span>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  TABLA HEATMAP — personas × skills (dentro de la categoría activa)
// ═══════════════════════════════════════════════════════════════════════════════
function HeatmapTable({ skills, personas }) {
  // personas únicas que aparecen en alguna skill de la categoría
  const personaIdToData = {}
  for (const s of skills) {
    for (const p of s.personas) {
      personaIdToData[p.persona_id] = p
    }
  }
  const personasOrdenadas = Object.values(personaIdToData).sort((a, b) => a.nombre.localeCompare(b.nombre))

  if (personasOrdenadas.length === 0 || skills.length === 0) {
    return <p className="text-sm text-gray-400 py-6 text-center">Sin datos para esta vista.</p>
  }

  // Set lookup: persona_id -> Set(skill_ids)
  const tiene = {}
  for (const s of skills) {
    for (const p of s.personas) {
      if (!tiene[p.persona_id]) tiene[p.persona_id] = new Set()
      tiene[p.persona_id].add(s.skill_id)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
      <table className="text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4 sticky left-0 bg-white"
              style={{ minWidth: 180 }}>Persona</th>
            {skills.map(s => (
              <th key={s.skill_id} className="text-center text-xs font-semibold text-gray-500 py-3 px-2"
                style={{ minWidth: 100, maxWidth: 130 }}>
                <span className="block leading-tight">{s.nombre}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {personasOrdenadas.map(p => (
            <tr key={p.persona_id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
              <td className="py-2 px-4 sticky left-0 bg-white">
                <p className="font-medium text-gray-900 text-xs">{p.nombre}</p>
                <p className="text-gray-400 text-xs">{p.nivel_seniority}</p>
              </td>
              {skills.map(s => {
                const has = tiene[p.persona_id]?.has(s.skill_id)
                return (
                  <td key={s.skill_id} className="py-2 px-1 text-center">
                    {has ? (
                      <div className={clsx(
                        'mx-auto w-6 h-6 rounded flex items-center justify-center',
                        NIVEL_COLOR[p.nivel_seniority] ?? 'bg-gray-100',
                      )}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    ) : (
                      <div className="mx-auto w-6 h-6" />
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PÁGINA
// ═══════════════════════════════════════════════════════════════════════════════
export default function SkillMatrix() {
  const [tab, setTab]       = useState(null)
  const [view, setView]     = useState('cards')  // 'cards' | 'tabla'
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['skill-matrix'],
    queryFn:  () => skillMatrixApi.get(),
  })

  // Auto-seleccionar primera tab al cargar
  useEffect(() => {
    if (!data || tab) return
    setTab(data.categorias_orden?.[0] ?? null)
  }, [data, tab])

  if (isLoading) return <p className="p-6 text-sm text-gray-400 text-center">Cargando…</p>
  if (!data)     return <p className="p-6 text-sm text-gray-400 text-center">Sin datos.</p>

  const cats = data.categorias_orden ?? []
  const huerfanasCount = data.huerfanas?.length ?? 0
  const isHuerfanas = tab === HUERFANAS_TAB

  // Filtrar skills/huérfanas con la búsqueda
  const filtroTexto = search.trim().toLowerCase()
  const matchesSearch = (skill) => {
    if (!filtroTexto) return true
    if (skill.nombre.toLowerCase().includes(filtroTexto)) return true
    return (skill.personas ?? []).some(p => p.nombre.toLowerCase().includes(filtroTexto))
  }

  let skillsToShow = []
  let huerfanasToShow = []
  if (isHuerfanas) {
    huerfanasToShow = (data.huerfanas ?? []).filter(matchesSearch)
  } else if (tab && data.data[tab]) {
    skillsToShow = data.data[tab].skills.filter(matchesSearch)
  }

  return (
    <div className="p-6 space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Skill Matrix</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Inventario de habilidades del equipo basado en el catálogo.
            Para evaluación detallada por competencias, ve a <Link to="/carrera" className="text-brand-600 font-medium hover:underline">Carrera</Link>.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          <Stat label="Skills" value={data.total_skills_catalogo} />
          <Stat label="Personas" value={data.total_personas} />
          <Stat label="Sin nadie" value={data.skills_sin_personas}
            tone={data.skills_sin_personas > 0 ? 'warn' : 'normal'} />
          {huerfanasCount > 0 && (
            <Stat label="Huérfanas" value={huerfanasCount} tone="warn" />
          )}
        </div>
      </div>

      {/* ── Tabs por categoría ── */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {cats.map(c => {
          const stats = data.data[c]
          const skillCount = stats?.skills?.length ?? 0
          const isActive = c === tab
          return (
            <button key={c} onClick={() => setTab(c)}
              className={clsx(
                'px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px flex items-center gap-2',
                isActive
                  ? 'border-brand-500 text-brand-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
              )}>
              {c}
              <span className={clsx(
                'text-xs px-1.5 py-0.5 rounded-full',
                isActive ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500',
              )}>
                {skillCount}
              </span>
            </button>
          )
        })}
        {huerfanasCount > 0 && (
          <button onClick={() => setTab(HUERFANAS_TAB)}
            className={clsx(
              'px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px flex items-center gap-2',
              isHuerfanas
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-amber-600 hover:text-amber-700',
            )}>
            ⚠️ Huérfanas
            <span className={clsx(
              'text-xs px-1.5 py-0.5 rounded-full',
              isHuerfanas ? 'bg-amber-100 text-amber-700' : 'bg-amber-50 text-amber-600',
            )}>
              {huerfanasCount}
            </span>
          </button>
        )}
      </div>

      {/* ── Filtros ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar skill o persona…"
          className="input text-sm max-w-64" />
        {!isHuerfanas && skillsToShow.length > 0 && (
          <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
            <button onClick={() => setView('cards')}
              className={clsx('px-3 py-1.5 text-xs font-medium transition-colors',
                view === 'cards' ? 'bg-brand-500 text-white' : 'text-gray-500 hover:bg-gray-50')}>
              Cards
            </button>
            <button onClick={() => setView('tabla')}
              className={clsx('px-3 py-1.5 text-xs font-medium transition-colors',
                view === 'tabla' ? 'bg-brand-500 text-white' : 'text-gray-500 hover:bg-gray-50')}>
              Tabla
            </button>
          </div>
        )}
      </div>

      {/* ── Contenido principal ── */}
      {isHuerfanas ? (
        <div>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-4">
            <p className="text-sm text-amber-900 font-semibold mb-1">
              {huerfanasToShow.length} skill(s) declaradas en personas pero no en el catálogo
            </p>
            <p className="text-xs text-amber-700">
              Estas skills aparecen en <code className="bg-amber-100 px-1 rounded">persona.habilidades</code> pero
              no existen como entrada en el catálogo. Ve a <Link to="/skills" className="font-semibold underline">Skills</Link> para
              añadirlas, o pídele a la persona que las quite/actualice de su perfil.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {huerfanasToShow.map(h => <HuerfanaCard key={h.nombre} huerfana={h} />)}
            {huerfanasToShow.length === 0 && (
              <p className="col-span-full text-sm text-gray-400 py-6 text-center">Sin resultados.</p>
            )}
          </div>
        </div>
      ) : skillsToShow.length === 0 ? (
        <p className="text-sm text-gray-400 py-10 text-center">
          {filtroTexto
            ? 'Sin resultados para esta búsqueda.'
            : 'Esta categoría no tiene skills en el catálogo. Agrega alguna desde la sección Skills.'}
        </p>
      ) : view === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {skillsToShow.map(s => <SkillCard key={s.skill_id} skill={s} />)}
        </div>
      ) : (
        <HeatmapTable skills={skillsToShow.filter(s => s.personas.length > 0)} />
      )}
    </div>
  )
}

// ── Pequeño chip de estadística ────────────────────────────────────────────
function Stat({ label, value, tone = 'normal' }) {
  return (
    <div className={clsx(
      'rounded-lg px-3 py-1.5 border',
      tone === 'warn' ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200',
    )}>
      <p className={clsx(
        'text-base font-bold leading-none',
        tone === 'warn' ? 'text-amber-700' : 'text-gray-900',
      )}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}
