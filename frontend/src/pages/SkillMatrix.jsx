import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { skillMatrixApi } from '../services/api'
import { NIVEL_COLOR } from '../utils/constants'
import clsx from 'clsx'

// ═══════════════════════════════════════════════════════════════════════════════
//  RADAR CHART — SVG para la geometría, HTML para las etiquetas
// ═══════════════════════════════════════════════════════════════════════════════
const VB    = 200    // viewBox (solo geometría, sin etiquetas)
const CX    = VB / 2 // 100
const CY    = VB / 2 // 100
const R     = 62     // radio del polígono
const LR    = 88     // radio de anclaje de etiquetas HTML (en unidades viewBox)
const N_LVL = 5      // niveles de la cuadrícula (1-5)

function angles(n) {
  return Array.from({ length: n }, (_, i) => (2 * Math.PI * i / n) - Math.PI / 2)
}

function point(angle, value, max = N_LVL, radius = R) {
  const ratio = value / max
  return [CX + ratio * radius * Math.cos(angle), CY + ratio * radius * Math.sin(angle)]
}

function polyPoints(angleArr, scores) {
  return angleArr.map((a, i) => point(a, scores[i]).join(',')).join(' ')
}

// Convierte coordenada viewBox → porcentaje CSS para posicionado absoluto
function toPct(v, total = VB) { return `${(v / total) * 100}%` }

// Transform + textAlign para cada cuadrante
function labelStyle(angle) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const ε   = 0.3
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
      {/* ── Geometría SVG ── */}
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {/* Fondo */}
        <polygon
          points={polyPoints(ang, gridLevels.map(() => N_LVL))}
          fill="#f9fafb" stroke="none"
        />
        {/* Anillos */}
        {gridLevels.map(lvl => (
          <polygon key={lvl}
            points={polyPoints(ang, gridLevels.map(() => lvl))}
            fill="none"
            stroke={lvl === N_LVL ? '#d1d5db' : '#e5e7eb'}
            strokeWidth={lvl === N_LVL ? 1.5 : 1}
          />
        ))}
        {/* Ejes */}
        {ang.map((a, i) => {
          const [x2, y2] = point(a, N_LVL)
          return <line key={i} x1={CX} y1={CY} x2={x2} y2={y2} stroke="#e5e7eb" strokeWidth="1" />
        })}
        {/* Relleno del perfil */}
        <polygon points={polyPoints(ang, scores)} fill="rgba(79,70,229,0.13)" stroke="none" />
        {/* Borde del perfil */}
        <polygon points={polyPoints(ang, scores)} fill="none"
          stroke="rgb(79,70,229)" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Vértices */}
        {ang.map((a, i) => {
          if (!scores[i]) return null
          const [px, py] = point(a, scores[i])
          return <circle key={i} cx={px} cy={py} r="3.5" fill="rgb(79,70,229)" />
        })}
      </svg>

      {/* ── Etiquetas HTML — no se clipan, se envuelven correctamente ── */}
      {ang.map((a, i) => {
        const lx = CX + LR * Math.cos(a)
        const ly = CY + LR * Math.sin(a)
        const { transform, textAlign } = labelStyle(a)
        return (
          <span
            key={i}
            className="absolute pointer-events-none leading-tight"
            style={{
              left: toPct(lx),
              top:  toPct(ly),
              transform,
              textAlign,
              fontSize: 9,
              fontWeight: 500,
              color: '#6b7280',
              whiteSpace: 'normal',
              maxWidth: 72,
              lineHeight: 1.25,
            }}
          >
            {competencias[i]}
          </span>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  TARJETA DE PERSONA
// ═══════════════════════════════════════════════════════════════════════════════
const NIVEL_SCORE = { Junior: 1, Mid: 2, Senior: 3, Lead: 4, Director: 5 }

function PersonaCard({ persona, competencias }) {
  const scores    = competencias.map(c => persona.skills[c]?.nivel_score ?? 0)
  const filled    = scores.filter(s => s > 0)
  const avgScore  = filled.length
    ? filled.reduce((a, b) => a + b, 0) / (competencias.length * N_LVL)
    : 0
  const score      = Math.round(avgScore * 100)
  const coverage   = Math.round((filled.length / competencias.length) * 100)
  const initials   = persona.nombre.split(' ').map(w => w[0]).slice(0, 2).join('')

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">

      {/* ── Cabecera ── */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0 select-none">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">{persona.nombre}</p>
          <p className="text-xs text-gray-400">{persona.nivel_seniority}</p>
        </div>
        <span className="shrink-0 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          {score}/100
        </span>
      </div>

      {/* ── Radar + Score ──
          El SVG (156×156px) está centrado dentro de un wrapper de 224×200px.
          Los 34px de margen a cada lado dan espacio para las etiquetas HTML
          sin que ningún padre tenga overflow:hidden.
      ── */}
      <div className="flex items-start gap-5">

        {/* Radar wrapper — más ancho que el SVG para acomodar etiquetas */}
        <div className="shrink-0 relative" style={{ width: 224, height: 200 }}>
          {/* SVG centrado dentro del wrapper */}
          <div
            className="absolute"
            style={{
              width: 156, height: 156,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <RadarChart competencias={competencias} scores={scores} />
          </div>
        </div>

        {/* Score + barras */}
        <div className="flex-1 min-w-0 flex flex-col justify-center" style={{ minHeight: 200 }}>

          {/* Número grande */}
          <div className="flex items-baseline gap-1 mb-0.5">
            <span className="text-5xl font-bold text-gray-900 leading-none tracking-tight">{score}</span>
            <span className="text-base text-gray-400 leading-none">/100</span>
          </div>
          <p className="text-xs font-semibold text-gray-500 mb-4">Score</p>

          {/* Reliability */}
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${coverage}%` }} />
            </div>
          </div>
          <p className="text-gray-400 mb-5" style={{ fontSize: 11 }}>{coverage}% habilidades declaradas</p>

          {/* Barras por competencia */}
          <div className="space-y-2">
            {competencias.map((c, i) => (
              <div key={c} className="flex items-center gap-2.5">
                <span
                  className="text-gray-500 shrink-0"
                  style={{ fontSize: 11, width: 88, minWidth: 88, lineHeight: 1.3 }}
                  title={c}
                >
                  {c}
                </span>
                <div className="flex gap-1 flex-1">
                  {Array.from({ length: N_LVL }, (_, lvl) => (
                    <div key={lvl} className={clsx(
                      'flex-1 h-2 rounded',
                      lvl < scores[i] ? 'bg-indigo-500' : 'bg-gray-100'
                    )} />
                  ))}
                </div>
                <span
                  className="shrink-0 text-right font-medium"
                  style={{ fontSize: 11, width: 14, color: scores[i] ? '#4f46e5' : '#d1d5db' }}
                >
                  {scores[i] || '—'}
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
//  TABLA HEATMAP (vista alternativa)
// ═══════════════════════════════════════════════════════════════════════════════
const SCORE_STYLES = [
  'bg-gray-100 text-gray-400',
  'bg-indigo-100 text-indigo-700',
  'bg-indigo-200 text-indigo-800',
  'bg-indigo-400 text-white',
  'bg-indigo-600 text-white',
  'bg-indigo-800 text-white',
]
const NIVEL_LABELS = ['—', 'J', 'M', 'S', 'L', 'D']
const NIVEL_FULL   = ['Sin skill', 'Junior', 'Mid', 'Senior', 'Lead', 'Director']

function HeatmapTable({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
      <table className="text-sm w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4 w-44">Persona</th>
            {data.competencias.map(c => (
              <th key={c} className="text-center text-xs font-semibold text-gray-500 py-3 px-2 w-28">
                {c}
              </th>
            ))}
            <th className="text-center text-xs font-semibold text-gray-500 py-3 px-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.personas.map(p => {
            const scores = data.competencias.map(c => p.skills[c]?.nivel_score ?? 0)
            const avg    = scores.reduce((a, b) => a + b, 0) / (data.competencias.length * N_LVL)
            const score  = Math.round(avg * 100)
            return (
              <tr key={p.persona_id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="py-2 px-4">
                  <p className="font-medium text-gray-900 text-xs">{p.nombre}</p>
                  <p className="text-gray-400 text-xs">{p.nivel_seniority}</p>
                </td>
                {data.competencias.map((c, i) => (
                  <td key={c} className="py-2 px-1 text-center">
                    <div className={clsx(
                      'mx-auto w-9 h-8 rounded flex items-center justify-center text-xs font-medium',
                      SCORE_STYLES[scores[i]]
                    )}>
                      {NIVEL_LABELS[scores[i]]}
                    </div>
                  </td>
                ))}
                <td className="py-2 px-2 text-center">
                  <span className="text-xs font-semibold text-gray-700">{score}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
        {data.summary && (
          <tfoot>
            <tr className="border-t-2 border-gray-100 bg-gray-50/60">
              <td className="py-2 px-4 text-xs text-gray-500 font-medium">Equipo</td>
              {data.competencias.map(c => (
                <td key={c} className="py-2 px-1 text-center">
                  <p className="text-xs font-semibold text-gray-700">{data.summary[c]?.total_personas}</p>
                  <p className="text-xs text-gray-400">{data.summary[c]?.score_promedio}/5</p>
                </td>
              ))}
              <td />
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  LEYENDA HEATMAP
// ═══════════════════════════════════════════════════════════════════════════════
function HeatmapLegend() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs text-gray-400 font-medium">Nivel:</span>
      {NIVEL_LABELS.map((l, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className={clsx('w-6 h-6 rounded text-xs flex items-center justify-center font-medium', SCORE_STYLES[i])}>
            {l}
          </div>
          <span className="text-xs text-gray-500">{NIVEL_FULL[i]}</span>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PÁGINA
// ═══════════════════════════════════════════════════════════════════════════════
export default function SkillMatrix() {
  const [view,   setView]   = useState('radar')    // 'radar' | 'tabla'
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['skill-matrix'],
    queryFn:  () => skillMatrixApi.get(),
  })

  const { data: gaps } = useQuery({
    queryKey: ['skill-gaps'],
    queryFn:  skillMatrixApi.gaps,
  })

  const filtered = (data?.personas ?? []).filter(p =>
    !search || p.nombre.toLowerCase().includes(search.toLowerCase())
  )

  // Stats para el header
  const totalPersonas  = data?.personas?.length ?? 0
  const avgTeamScore   = data?.personas
    ? Math.round(
        data.personas.reduce((sum, p) => {
          const s = data.competencias.reduce((a, c) => a + (p.skills[c]?.nivel_score ?? 0), 0)
          return sum + s / (data.competencias.length * N_LVL) * 100
        }, 0) / Math.max(1, totalPersonas)
      )
    : 0

  return (
    <div className="p-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Skill Matrix</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalPersonas} personas · Score promedio del equipo: {avgTeamScore}/100
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Búsqueda */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar persona…"
            className="input text-sm max-w-48"
          />

          {/* Toggle de vista */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
            <button
              onClick={() => setView('radar')}
              className={clsx(
                'px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5',
                view === 'radar' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'
              )}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <polygon points="8,1 15,5.5 15,10.5 8,15 1,10.5 1,5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <polygon points="8,4 12,6.5 12,9.5 8,12 4,9.5 4,6.5" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
              Radar
            </button>
            <button
              onClick={() => setView('tabla')}
              className={clsx(
                'px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5',
                view === 'tabla' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'
              )}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="1" width="14" height="14" rx="1" />
                <line x1="1" y1="5" x2="15" y2="5" />
                <line x1="5" y1="5" x2="5" y2="15" />
                <line x1="10" y1="5" x2="10" y2="15" />
              </svg>
              Tabla
            </button>
          </div>
        </div>
      </div>

      {/* ── Leyenda (solo tabla) ── */}
      {view === 'tabla' && <HeatmapLegend />}

      {/* ── Contenido principal ── */}
      {isLoading ? (
        <p className="text-sm text-gray-400 py-10 text-center">Cargando…</p>
      ) : view === 'radar' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <PersonaCard
              key={p.persona_id}
              persona={p}
              competencias={data.competencias}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 col-span-full py-8 text-center">Sin resultados.</p>
          )}
        </div>
      ) : (
        data && <HeatmapTable data={{ ...data, personas: filtered }} />
      )}

      {/* ── Skill Gaps ── */}
      {gaps?.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
            <span>⚠️</span> Skill Gaps detectados
          </h3>
          <div className="space-y-3">
            {gaps.map(g => (
              <div key={g.competencia} className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-amber-900">{g.competencia}</span>
                    <span className={clsx(
                      'badge text-xs',
                      g.severidad === 'alta' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    )}>
                      {g.severidad}
                    </span>
                  </div>
                  <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden w-48">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${(g.score_promedio / N_LVL) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-amber-800">{g.personas_con_skill} personas</p>
                  <p className="text-xs text-amber-600">Prom: {g.score_promedio}/5</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
