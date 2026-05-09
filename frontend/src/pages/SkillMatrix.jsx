import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { skillMatrixApi } from '../services/api'
import clsx from 'clsx'

// ═══════════════════════════════════════════════════════════════════════════════
//  CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════════
const N_LVL = 5           // escala de scores 1-5
const VB    = 200
const CX    = VB / 2
const CY    = VB / 2
const R     = 62
const LR    = 88

// ═══════════════════════════════════════════════════════════════════════════════
//  RADAR CHART
// ═══════════════════════════════════════════════════════════════════════════════
function angles(n) {
  return Array.from({ length: n }, (_, i) => (2 * Math.PI * i / n) - Math.PI / 2)
}

function point(angle, value, max = N_LVL, radius = R) {
  const ratio = value / max
  return [CX + ratio * radius * Math.cos(angle), CY + ratio * radius * Math.sin(angle)]
}

function polyPoints(angleArr, scores) {
  return angleArr.map((a, i) => point(a, scores[i] ?? 0).join(',')).join(' ')
}

function toPct(v, total = VB) { return `${(v / total) * 100}%` }

function labelStyle(angle) {
  const cos = Math.cos(angle), sin = Math.sin(angle), ε = 0.3
  let tx = '-50%', ty = '-50%', textAlign = 'center'
  if (cos > ε)  { tx = '0%';    textAlign = 'left'  }
  if (cos < -ε) { tx = '-100%'; textAlign = 'right' }
  if (sin < -ε) { ty = '-100%' }
  if (sin > ε)  { ty = '0%'   }
  return { transform: `translate(${tx}, ${ty})`, textAlign }
}

function RadarChart({ competencias, scores }) {
  const n   = competencias.length
  const ang = angles(n)
  const gridLevels = Array.from({ length: N_LVL }, (_, i) => i + 1)

  return (
    <div className="relative w-full h-full">
      <svg viewBox={`0 0 ${VB} ${VB}`} className="absolute inset-0 w-full h-full" aria-hidden="true">
        <polygon points={polyPoints(ang, gridLevels.map(() => N_LVL))} fill="#f9fafb" stroke="none" />
        {gridLevels.map(lvl => (
          <polygon key={lvl}
            points={polyPoints(ang, gridLevels.map(() => lvl))}
            fill="none"
            stroke={lvl === N_LVL ? '#d1d5db' : '#e5e7eb'}
            strokeWidth={lvl === N_LVL ? 1.5 : 1}
          />
        ))}
        {ang.map((a, i) => {
          const [x2, y2] = point(a, N_LVL)
          return <line key={i} x1={CX} y1={CY} x2={x2} y2={y2} stroke="#e5e7eb" strokeWidth="1" />
        })}
        <polygon points={polyPoints(ang, scores)} fill="rgba(79,70,229,0.13)" stroke="none" />
        <polygon points={polyPoints(ang, scores)} fill="none"
          stroke="rgb(79,70,229)" strokeWidth="2.5" strokeLinejoin="round" />
        {ang.map((a, i) => {
          if (!scores[i]) return null
          const [px, py] = point(a, scores[i])
          return <circle key={i} cx={px} cy={py} r="3.5" fill="rgb(79,70,229)" />
        })}
      </svg>
      {ang.map((a, i) => {
        const lx = CX + LR * Math.cos(a)
        const ly = CY + LR * Math.sin(a)
        const { transform, textAlign } = labelStyle(a)
        return (
          <span key={i} className="absolute pointer-events-none leading-tight"
            style={{
              left: toPct(lx), top: toPct(ly), transform, textAlign,
              fontSize: 9, fontWeight: 500, color: '#6b7280',
              whiteSpace: 'normal', maxWidth: 72, lineHeight: 1.25,
            }}>
            {competencias[i]}
          </span>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CARD PERSONA EVALUADA — usa scores reales (1-5) de la evaluación
// ═══════════════════════════════════════════════════════════════════════════════
function PersonaCardEvaluado({ persona, competencias }) {
  const scores   = competencias.map(c => persona.scores[c] ?? 0)
  const filled   = scores.filter(s => s > 0)
  const avg      = filled.length
    ? filled.reduce((a, b) => a + b, 0) / (competencias.length * N_LVL)
    : 0
  const score    = Math.round(avg * 100)
  const coverage = Math.round((filled.length / competencias.length) * 100)
  const initials = persona.nombre.split(' ').map(w => w[0]).slice(0, 2).join('')

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0 select-none">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">{persona.nombre}</p>
          <p className="text-xs text-gray-400">
            {persona.nivel_seniority}
            {persona.fecha_evaluacion && <> · evaluado {persona.fecha_evaluacion}</>}
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          {score}/100
        </span>
      </div>

      <div className="flex items-start gap-5">
        <div className="shrink-0 relative" style={{ width: 224, height: 200 }}>
          <div className="absolute" style={{
            width: 156, height: 156,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
          }}>
            <RadarChart competencias={competencias} scores={scores} />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center" style={{ minHeight: 200 }}>
          <div className="flex items-baseline gap-1 mb-0.5">
            <span className="text-5xl font-bold text-gray-900 leading-none tracking-tight">{score}</span>
            <span className="text-base text-gray-400 leading-none">/100</span>
          </div>
          <p className="text-xs font-semibold text-gray-500 mb-4">Score consenso</p>

          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${coverage}%` }} />
            </div>
          </div>
          <p className="text-gray-400 mb-5" style={{ fontSize: 11 }}>{coverage}% competencias evaluadas</p>

          <div className="space-y-2">
            {competencias.map((c, i) => (
              <div key={c} className="flex items-center gap-2.5">
                <span className="text-gray-500 shrink-0"
                  style={{ fontSize: 11, width: 110, minWidth: 110, lineHeight: 1.3 }} title={c}>
                  {c}
                </span>
                <div className="flex gap-1 flex-1">
                  {Array.from({ length: N_LVL }, (_, lvl) => (
                    <div key={lvl} className={clsx(
                      'flex-1 h-2 rounded',
                      lvl < Math.round(scores[i]) ? 'bg-indigo-500' : 'bg-gray-100'
                    )} />
                  ))}
                </div>
                <span className="shrink-0 text-right font-medium"
                  style={{ fontSize: 11, width: 22, color: scores[i] ? '#4f46e5' : '#d1d5db' }}>
                  {scores[i] ? scores[i].toFixed(1) : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CARD PERSONA NO EVALUADA — solo muestra habilidades declaradas + CTA
// ═══════════════════════════════════════════════════════════════════════════════
function PersonaCardNoEvaluado({ persona }) {
  const initials = persona.nombre.split(' ').map(w => w[0]).slice(0, 2).join('')
  const habs     = persona.habilidades_declaradas ?? []

  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-4 hover:border-indigo-300 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-sm font-bold shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">{persona.nombre}</p>
          <p className="text-xs text-gray-400">{persona.nivel_seniority} · {persona.rol}</p>
        </div>
        <span className="text-xs text-gray-400 shrink-0">Sin evaluar</span>
      </div>

      {habs.length > 0 ? (
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-1.5">Habilidades declaradas:</p>
          <div className="flex flex-wrap gap-1">
            {habs.map(h => (
              <span key={h} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md border border-gray-100">
                {h}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic mb-3">Sin habilidades declaradas.</p>
      )}

      <Link to="/carrera"
        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800">
        Iniciar evaluación →
      </Link>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  TABLA HEATMAP — solo evaluados
// ═══════════════════════════════════════════════════════════════════════════════
function colorForScore(score) {
  if (!score) return 'bg-gray-100 text-gray-400'
  if (score < 1.5) return 'bg-indigo-100 text-indigo-700'
  if (score < 2.5) return 'bg-indigo-200 text-indigo-800'
  if (score < 3.5) return 'bg-indigo-400 text-white'
  if (score < 4.5) return 'bg-indigo-600 text-white'
  return 'bg-indigo-800 text-white'
}

function HeatmapTable({ evaluados, competencias }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
      <table className="text-sm w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4 w-44">Persona</th>
            {competencias.map(c => (
              <th key={c} className="text-center text-xs font-semibold text-gray-500 py-3 px-2"
                style={{ minWidth: 88, maxWidth: 110 }}>
                <span className="block leading-tight">{c}</span>
              </th>
            ))}
            <th className="text-center text-xs font-semibold text-gray-500 py-3 px-2">Promedio</th>
          </tr>
        </thead>
        <tbody>
          {evaluados.map(p => (
            <tr key={p.persona_id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
              <td className="py-2 px-4">
                <p className="font-medium text-gray-900 text-xs">{p.nombre}</p>
                <p className="text-gray-400 text-xs">{p.nivel_seniority}</p>
              </td>
              {competencias.map(c => {
                const s = p.scores[c]
                return (
                  <td key={c} className="py-2 px-1 text-center">
                    <div className={clsx(
                      'mx-auto w-10 h-8 rounded flex items-center justify-center text-xs font-medium',
                      colorForScore(s),
                    )}>
                      {s != null ? s.toFixed(1) : '—'}
                    </div>
                  </td>
                )
              })}
              <td className="py-2 px-2 text-center">
                <span className="text-xs font-semibold text-gray-700">
                  {p.promedio != null ? p.promedio.toFixed(1) : '—'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  EMPTY STATE — cuando no hay evaluaciones en el perfil
// ═══════════════════════════════════════════════════════════════════════════════
function EmptyStateSinEvaluaciones({ perfil, totalPersonas }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-10 text-center">
      <div className="text-4xl mb-3">📋</div>
      <h3 className="text-base font-bold text-gray-900 mb-1">
        Aún no hay evaluaciones para {perfil}
      </h3>
      <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
        {totalPersonas > 0
          ? `Hay ${totalPersonas} persona${totalPersonas !== 1 ? 's' : ''} en este perfil sin evaluación. Inicia la primera para ver scores reales por competencia.`
          : 'Ningún miembro del equipo encaja con este perfil aún.'}
      </p>
      {totalPersonas > 0 && (
        <Link to="/carrera"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Iniciar evaluación →
        </Link>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PÁGINA
// ═══════════════════════════════════════════════════════════════════════════════
export default function SkillMatrix() {
  const [perfilActivo, setPerfilActivo] = useState(null)
  const [view, setView]                 = useState('radar')
  const [search, setSearch]             = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['skill-matrix'],
    queryFn:  () => skillMatrixApi.get(),
  })

  const perfiles = data?.perfiles ?? []

  // Auto-seleccionar el primer perfil con personas
  useEffect(() => {
    if (!data || perfilActivo) return
    const conPersonas = perfiles.find(p => (data.data?.[p]?.total_personas ?? 0) > 0)
    setPerfilActivo(conPersonas ?? perfiles[0] ?? null)
  }, [data, perfilActivo, perfiles])

  if (isLoading) {
    return <p className="p-6 text-sm text-gray-400 text-center">Cargando…</p>
  }

  if (!data || !perfilActivo) {
    return <p className="p-6 text-sm text-gray-400 text-center">Sin datos.</p>
  }

  const dataPerfil = data.data[perfilActivo] ?? {
    competencias: [], evaluados: [], no_evaluados: [], skill_gaps: [], total_personas: 0, total_evaluados: 0,
  }
  const { competencias, evaluados, no_evaluados, skill_gaps, total_personas, total_evaluados } = dataPerfil

  const filtroBusqueda = p => !search || p.nombre.toLowerCase().includes(search.toLowerCase())
  const evaluadosFiltrados    = evaluados.filter(filtroBusqueda)
  const noEvaluadosFiltrados  = no_evaluados.filter(filtroBusqueda)

  return (
    <div className="p-6 space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Skill Matrix</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Scores basados en evaluaciones tripartitas (self · manager · par). Las personas sin evaluación
            aparecen abajo con sus habilidades declaradas.
          </p>
        </div>
      </div>

      {/* ── Tabs por perfil ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {perfiles.map(p => {
          const stats = data.data[p]
          const total = stats?.total_personas ?? 0
          const conEval = stats?.total_evaluados ?? 0
          const isActive = p === perfilActivo
          return (
            <button
              key={p}
              onClick={() => setPerfilActivo(p)}
              className={clsx(
                'px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px flex items-center gap-2',
                isActive
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
              )}
            >
              {p}
              <span className={clsx(
                'text-xs px-1.5 py-0.5 rounded-full',
                isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500',
              )}>
                {conEval}/{total}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Filtros ────────────────────────────────────────────────────────── */}
      {(evaluados.length > 0 || no_evaluados.length > 0) && (
        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar persona…"
            className="input text-sm max-w-48"
          />
          {evaluados.length > 0 && (
            <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
              <button onClick={() => setView('radar')}
                className={clsx('px-3 py-1.5 text-xs font-medium transition-colors',
                  view === 'radar' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50')}>
                Radar
              </button>
              <button onClick={() => setView('tabla')}
                className={clsx('px-3 py-1.5 text-xs font-medium transition-colors',
                  view === 'tabla' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50')}>
                Tabla
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Vista principal ───────────────────────────────────────────────── */}
      {evaluados.length === 0 ? (
        <EmptyStateSinEvaluaciones perfil={perfilActivo} totalPersonas={total_personas} />
      ) : (
        <>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-700">
                Evaluados ({total_evaluados})
              </h3>
            </div>
            {view === 'radar' ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {evaluadosFiltrados.map(p => (
                  <PersonaCardEvaluado key={p.persona_id} persona={p} competencias={competencias} />
                ))}
                {evaluadosFiltrados.length === 0 && (
                  <p className="col-span-full text-sm text-gray-400 py-6 text-center">Sin resultados.</p>
                )}
              </div>
            ) : (
              evaluadosFiltrados.length > 0
                ? <HeatmapTable evaluados={evaluadosFiltrados} competencias={competencias} />
                : <p className="text-sm text-gray-400 py-6 text-center">Sin resultados.</p>
            )}
          </div>

          {/* ── Skill Gaps ── */}
          {skill_gaps.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <span>⚠️</span> Skill Gaps en {perfilActivo}
              </h3>
              <p className="text-xs text-amber-700 mb-3">
                Basado solo en personas evaluadas. Pocos evaluados o scores bajos generan alertas.
              </p>
              <div className="space-y-3">
                {skill_gaps.map(g => (
                  <div key={g.competencia} className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-medium text-amber-900 truncate">{g.competencia}</span>
                        <span className={clsx(
                          'text-xs px-1.5 py-0.5 rounded-full font-medium',
                          g.severidad === 'alta' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        )}>{g.severidad}</span>
                      </div>
                      <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden w-48">
                        <div className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${(g.score_promedio / N_LVL) * 100}%` }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-amber-800">{g.personas_evaluadas} eval.</p>
                      <p className="text-xs text-amber-600">Prom: {g.score_promedio}/5</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Pendientes de evaluar ─────────────────────────────────────────── */}
      {no_evaluados.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700">
              Pendientes de evaluar ({no_evaluados.length})
            </h3>
            <p className="text-xs text-gray-400">
              Datos basados en habilidades autodeclaradas, no en evaluación formal.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {noEvaluadosFiltrados.map(p => (
              <PersonaCardNoEvaluado key={p.persona_id} persona={p} />
            ))}
            {noEvaluadosFiltrados.length === 0 && (
              <p className="col-span-full text-sm text-gray-400 py-4 text-center">Sin resultados.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
