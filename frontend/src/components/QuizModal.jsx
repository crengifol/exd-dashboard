import { useState } from 'react'
import clsx from 'clsx'
import { QUIZ_BANK, mapScoreToLevel, SCORE_LABEL } from '../data/questionsBank'

// Componente de contenido puro — sin wrapper de contenedor.
// El Panel/Panel lo provee el padre (Carrera.jsx).
// Props:
//   perfil      : string
//   competencia : string
//   onComplete  : (score: number, detail: object) => void
//   onBack      : () => void
export default function QuizContent({ perfil, competencia, onComplete, onBack }) {
  const questions = QUIZ_BANK[perfil]?.[competencia] ?? []
  const [step, setStep]           = useState(0)
  const [selected, setSelected]   = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [results, setResults]     = useState([])

  const q     = questions[step]
  const total = questions.length
  const isLast  = step === total - 1
  const isDone  = results.length === total

  if (!questions.length) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">No hay preguntas disponibles para esta competencia.</p>
        <button onClick={onBack} className="btn-secondary">← Volver</button>
      </div>
    )
  }

  const handleConfirm = () => {
    if (selected === null) return
    const correct    = selected === q.correct
    const newResults = [...results, { correct, selected, correctIndex: q.correct }]
    setResults(newResults)
    setConfirmed(true)
  }

  const handleNext = () => {
    setStep(s => s + 1)
    setSelected(null)
    setConfirmed(false)
  }

  // ── Resultado final ───────────────────────────────────────────────────────
  if (isDone) {
    const correctas = results.filter(r => r.correct).length
    const score = mapScoreToLevel(correctas, total)
    const pct   = Math.round((correctas / total) * 100)

    const scoreColors = {
      5: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      4: 'text-blue-700 bg-blue-50 border-blue-200',
      3: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      2: 'text-orange-700 bg-orange-50 border-orange-200',
      1: 'text-red-700 bg-red-50 border-red-200',
    }

    return (
      <div className="space-y-4">
        <div className={clsx('rounded-xl p-5 border text-center', scoreColors[score])}>
          <p className="text-5xl font-bold mb-1">{score}</p>
          <p className="text-sm font-semibold">{SCORE_LABEL[score]}</p>
          <p className="text-xs mt-1 opacity-70">{correctas}/{total} correctas · {pct}%</p>
        </div>

        <div className="space-y-2">
          {questions.map((q, i) => {
            const r = results[i]
            return (
              <div key={i} className={clsx(
                'rounded-lg p-3 text-xs border',
                r.correct ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
              )}>
                <p className={clsx('font-medium mb-1', r.correct ? 'text-emerald-800' : 'text-red-800')}>
                  {r.correct ? '✓' : '✗'} {q.q}
                </p>
                {!r.correct && (
                  <p className="text-gray-600">
                    Correcta: <span className="font-semibold">{q.options[q.correct]}</span>
                  </p>
                )}
                {q.explanation && <p className="text-gray-500 mt-1 italic">{q.explanation}</p>}
              </div>
            )
          })}
        </div>

        <div className="flex justify-between gap-2 pt-2 border-t border-gray-100">
          <button onClick={onBack} className="btn-secondary">← Volver al formulario</button>
          <button
            onClick={() => onComplete(score, { correctas, total, resultados: results })}
            className="btn-primary"
          >
            Guardar ({score} — {SCORE_LABEL[score]})
          </button>
        </div>
      </div>
    )
  }

  // ── Pregunta activa ───────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Cabecera de competencia */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-700 text-sm">←</button>
        <div>
          <p className="text-xs font-semibold text-gray-700">{competencia}</p>
          <p className="text-xs text-gray-400">Pregunta {step + 1} de {total}</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-brand-400 rounded-full transition-all"
          style={{ width: `${(step / total) * 100}%` }} />
      </div>

      {/* Pregunta */}
      <p className="text-sm font-medium text-gray-800 leading-relaxed">{q.q}</p>

      {/* Opciones */}
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let style = 'border-gray-200 bg-white hover:border-brand-300 hover:bg-brand-50 cursor-pointer'
          if (confirmed) {
            if (i === q.correct)
              style = 'border-emerald-400 bg-emerald-50 cursor-default'
            else if (i === selected && selected !== q.correct)
              style = 'border-red-300 bg-red-50 cursor-default'
            else
              style = 'border-gray-100 bg-gray-50 opacity-50 cursor-default'
          } else if (selected === i) {
            style = 'border-brand-400 bg-brand-50 cursor-pointer'
          }
          return (
            <button key={i} type="button" disabled={confirmed}
              onClick={() => !confirmed && setSelected(i)}
              className={clsx('w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors', style)}
            >
              <span className="text-gray-400 text-xs mr-2 font-mono">{String.fromCharCode(65 + i)}.</span>
              {opt}
              {confirmed && i === q.correct && <span className="ml-2 text-emerald-600">✓</span>}
              {confirmed && i === selected && selected !== q.correct && <span className="ml-2 text-red-500">✗</span>}
            </button>
          )
        })}
      </div>

      {confirmed && q.explanation && (
        <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-700">
          💡 {q.explanation}
        </div>
      )}

      <div className="flex justify-end pt-2 border-t border-gray-100">
        {!confirmed ? (
          <button onClick={handleConfirm} disabled={selected === null}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            Confirmar respuesta
          </button>
        ) : (
          <button onClick={handleNext} className="btn-primary">
            {isLast ? 'Ver resultado →' : 'Siguiente →'}
          </button>
        )}
      </div>
    </div>
  )
}
