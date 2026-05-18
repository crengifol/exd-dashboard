import { useState } from 'react'
import clsx from 'clsx'
import { BEHAVIOR_BANK } from '../data/questionsBank'

const FREQ_LABELS = ['Nunca', 'Raramente', 'A veces', 'Frecuentemente', 'Siempre']
const FREQ_COLORS = [
  'border-red-200 bg-red-50 text-red-700',
  'border-orange-200 bg-orange-50 text-orange-700',
  'border-yellow-200 bg-yellow-50 text-yellow-700',
  'border-blue-200 bg-blue-50 text-blue-700',
  'border-emerald-200 bg-emerald-50 text-emerald-700',
]
const NO_OBS = 'N/O'

// ── Bloque de una competencia ─────────────────────────────────────────────────
function CompetencyBlock({ competencia, statements, scores, onChange }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
      <p className="text-xs font-semibold text-gray-700">{competencia}</p>
      {statements.map((stmt, si) => (
        <div key={si}>
          <p className="text-xs text-gray-600 mb-1.5">{stmt}</p>
          <div className="flex gap-1.5 flex-wrap">
            {FREQ_LABELS.map((label, fi) => (
              <button key={fi} type="button" onClick={() => onChange(si, fi + 1)}
                className={clsx(
                  'px-2 py-1 rounded-lg border text-xs font-medium transition-all',
                  scores[si] === fi + 1
                    ? FREQ_COLORS[fi]
                    : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600'
                )}>
                {fi + 1} · {label}
              </button>
            ))}
            <span className="text-gray-200 text-xs self-center">|</span>
            <button type="button" onClick={() => onChange(si, NO_OBS)}
              className={clsx(
                'px-2 py-1 rounded-lg border text-xs font-medium transition-all',
                scores[si] === NO_OBS
                  ? 'border-gray-400 bg-gray-100 text-gray-600'
                  : 'border-dashed border-gray-300 bg-white text-gray-400 hover:border-gray-400 hover:text-gray-500'
              )}>
              No observado
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── BehaviorContent ───────────────────────────────────────────────────────────
// Componente de contenido puro — sin wrapper de contenedor.
// Props:
//   perfil        : string
//   role          : 'manager' | 'peer'
//   evaluadoNombre: string
//   onComplete    : (scores, nps?) => void
//   onBack        : () => void
export default function BehaviorContent({ perfil, role, evaluadoNombre, onComplete, onBack }) {
  const bankPerfil   = BEHAVIOR_BANK[perfil] ?? {}
  const competencias = Object.keys(bankPerfil)

  const initScores = () =>
    Object.fromEntries(competencias.map(c => [
      c,
      Object.fromEntries((bankPerfil[c]?.[role] ?? []).map((_, i) => [i, null])),
    ]))

  const [scores, setScores] = useState(initScores)
  const [nps, setNps]       = useState(null)
  const [page, setPage]     = useState(0)
  const PAGE_SIZE = 3

  const pages = []
  for (let i = 0; i < competencias.length; i += PAGE_SIZE) {
    pages.push(competencias.slice(i, i + PAGE_SIZE))
  }
  const isLastPage    = page === pages.length - 1
  const currentComps  = pages[page] ?? []
  const npsRequired   = role === 'peer' && isLastPage

  const setScore = (comp, si, val) =>
    setScores(s => ({ ...s, [comp]: { ...s[comp], [si]: val } }))

  const isAnswered = v => v != null
  const pageComplete = currentComps.every(comp =>
    (bankPerfil[comp]?.[role] ?? []).every((_, i) => isAnswered(scores[comp]?.[i]))
  )
  const canFinish = pageComplete && (!npsRequired || nps !== null)

  const handleFinish = () => {
    const avgByComp = Object.fromEntries(
      competencias.map(comp => {
        const vals = Object.values(scores[comp] ?? {}).filter(v => v != null && v !== NO_OBS)
        const avg  = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
        return [comp, avg != null ? Number(avg.toFixed(2)) : null]
      })
    )
    onComplete(avgByComp, nps)
  }

  return (
    <div className="space-y-4">
      {/* Cabecera de navegación */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-700 text-sm">←</button>
        <div>
          <p className="text-xs font-semibold text-gray-700">
            {role === 'manager' ? 'Evaluación de manager' : 'Evaluación de par'} · {evaluadoNombre}
          </p>
          <p className="text-xs text-gray-400">
            {role === 'manager'
              ? 'Frecuencia con que se observan estos comportamientos'
              : 'Perspectiva de compañero/a de equipo'}
          </p>
        </div>
      </div>

      {/* Instrucción */}
      <div className="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-500">
        Selecciona la opción que mejor describe lo que observas.
        <span className="ml-1 font-medium">Respuestas confidenciales.</span>
      </div>

      {/* Progreso por páginas */}
      <div className="flex items-center gap-2">
        {pages.map((_, i) => (
          <div key={i} className={clsx(
            'h-1.5 flex-1 rounded-full transition-all',
            i < page ? 'bg-brand-400' : i === page ? 'bg-brand-300' : 'bg-gray-200'
          )} />
        ))}
      </div>
      <p className="text-xs text-gray-400 text-right -mt-2">Sección {page + 1} de {pages.length}</p>

      {/* Competencias de esta página */}
      <div className="space-y-3">
        {currentComps.map(comp => (
          <CompetencyBlock
            key={comp}
            competencia={comp}
            statements={bankPerfil[comp]?.[role] ?? []}
            scores={scores[comp] ?? {}}
            onChange={(si, val) => setScore(comp, si, val)}
          />
        ))}

        {/* NPS — solo peer, última página */}
        {npsRequired && (
          <div className="border border-gray-100 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-700">Reputación técnica</p>
            <p className="text-xs text-gray-600">
              ¿Recomendarías a <span className="font-medium">{evaluadoNombre}</span> como referente
              de {perfil}? (0 = definitivamente no · 10 = definitivamente sí)
            </p>
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: 11 }, (_, i) => (
                <button key={i} type="button" onClick={() => setNps(i)}
                  className={clsx(
                    'w-9 h-9 rounded-lg border text-xs font-bold transition-all',
                    nps === i
                      ? i >= 9 ? 'border-emerald-400 bg-emerald-100 text-emerald-700'
                        : i >= 7 ? 'border-blue-400 bg-blue-100 text-blue-700'
                        : 'border-orange-400 bg-orange-100 text-orange-700'
                      : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                  )}>
                  {i}
                </button>
              ))}
            </div>
            {nps !== null && (
              <p className="text-xs text-gray-500">
                {nps >= 9 ? '😊 Promotor' : nps >= 7 ? '😐 Pasivo' : '😟 Detractor'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navegación */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <button type="button" onClick={() => setPage(p => p - 1)} disabled={page === 0}
          className="btn-secondary disabled:opacity-30">
          ← Anterior
        </button>
        {!isLastPage ? (
          <button type="button" onClick={() => setPage(p => p + 1)} disabled={!pageComplete}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            Siguiente →
          </button>
        ) : (
          <button type="button" onClick={handleFinish} disabled={!canFinish}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            Guardar evaluación
          </button>
        )}
      </div>

      {!pageComplete && (
        <p className="text-xs text-orange-500 text-center -mt-2">
          Responde todas las afirmaciones para continuar
        </p>
      )}
    </div>
  )
}
