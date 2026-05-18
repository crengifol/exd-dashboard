import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { skillsApi } from '../services/api'
import clsx from 'clsx'

const SIN_CAT = '— Sin categoría —'

const CAT_COLOR = {
  'Research, Discovery & Insight':                            'text-violet-700',
  'UX/UI, Interaction & Visual Design':                       'text-indigo-700',
  'Product Design & Strategy':                                'text-blue-700',
  'Service Design & Transformation':                          'text-cyan-700',
  'Design Systems, Accesibility & Quality':                   'text-teal-700',
  'Strategy, Business & Measurement':                         'text-amber-700',
  'Facilitation/Leadership & Stakeholder Management':         'text-emerald-700',
  'Technology, Tools, & AI Enablement':                       'text-fuchsia-700',
  'Professional & Interpersonal Skills':                      'text-pink-700',
}
const catColor = c => CAT_COLOR[c] ?? 'text-gray-600'

/**
 * Selector de skills por checkboxes agrupados por categoría.
 *
 * Props:
 *   value:    string[]              -- nombres de skills seleccionadas
 *   onChange: (string[]) => void    -- callback con la nueva lista
 */
export default function SkillCheckboxes({ value = [], onChange }) {
  const [search, setSearch] = useState('')

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn:  skillsApi.list,
  })

  const valueSet = useMemo(() => new Set(value), [value])

  // Skills activas (catálogo) + huérfanas (declaradas en `value` pero no en el catálogo)
  const skillsActivas = skills.filter(s => s.activa)
  const nombresEnCat  = useMemo(() => new Set(skills.map(s => s.nombre)), [skills])
  const huerfanas     = value.filter(v => !nombresEnCat.has(v))

  // Agrupar por categoría
  const grupos = useMemo(() => {
    const g = {}
    const filtro = search.trim().toLowerCase()
    for (const s of skillsActivas) {
      // Filtro: incluir si matchea la búsqueda O si ya está seleccionada
      if (filtro && !s.nombre.toLowerCase().includes(filtro) && !valueSet.has(s.nombre)) continue
      const cat = s.categoria ?? SIN_CAT
      if (!g[cat]) g[cat] = []
      g[cat].push(s)
    }
    // Ordenar dentro del grupo: seleccionadas primero, luego alfabético
    for (const cat in g) {
      g[cat].sort((a, b) => {
        const aSel = valueSet.has(a.nombre) ? 0 : 1
        const bSel = valueSet.has(b.nombre) ? 0 : 1
        if (aSel !== bSel) return aSel - bSel
        return a.nombre.localeCompare(b.nombre)
      })
    }
    // Ordenar categorías: sin categoría al final
    return Object.entries(g).sort((a, b) => {
      if (a[0] === SIN_CAT) return 1
      if (b[0] === SIN_CAT) return -1
      return a[0].localeCompare(b[0])
    })
  }, [skillsActivas, search, valueSet])

  const toggle = nombre => {
    if (valueSet.has(nombre)) onChange(value.filter(v => v !== nombre))
    else onChange([...value, nombre])
  }

  const clearAll = () => onChange([])

  if (isLoading) {
    return <p className="text-xs text-gray-400 py-3">Cargando catálogo de skills…</p>
  }

  if (skillsActivas.length === 0 && huerfanas.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 p-4 text-center">
        <p className="text-xs text-gray-500">
          El catálogo de skills está vacío. Agrega skills desde la pestaña <strong>Skills</strong> primero.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Header: buscador + contador + clear */}
      <div className="flex items-center gap-2 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Filtrar skills…"
          className="input text-xs flex-1 min-w-32 max-w-64" />
        <span className="text-xs text-gray-400">
          {value.length} seleccionada{value.length !== 1 ? 's' : ''}
        </span>
        {value.length > 0 && (
          <button type="button" onClick={clearAll}
            className="text-xs text-gray-400 hover:text-red-600">
            Limpiar
          </button>
        )}
      </div>

      {/* Grupos por categoría */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {grupos.map(([cat, items]) => (
          <div key={cat}>
            <p className={clsx('text-xs font-bold uppercase tracking-wider mb-1.5', catColor(cat))}>
              {cat}
              <span className="ml-1.5 text-gray-400 font-normal normal-case tracking-normal">
                ({items.filter(s => valueSet.has(s.nombre)).length}/{items.length})
              </span>
            </p>
            <div className="grid grid-cols-2 gap-1">
              {items.map(s => {
                const checked = valueSet.has(s.nombre)
                return (
                  <label key={s.id}
                    className={clsx(
                      'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors',
                      checked
                        ? 'bg-brand-50 hover:bg-brand-100'
                        : 'hover:bg-gray-50',
                    )}>
                    <input type="checkbox" checked={checked}
                      onChange={() => toggle(s.nombre)}
                      className="w-3.5 h-3.5 accent-brand-500 shrink-0" />
                    <span className={clsx(
                      'truncate',
                      checked ? 'text-brand-700 font-medium' : 'text-gray-700',
                    )} title={s.nombre}>
                      {s.nombre}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}

        {grupos.length === 0 && search && (
          <p className="text-xs text-gray-400 italic py-3">Sin resultados para "{search}".</p>
        )}
      </div>

      {/* Skills huérfanas: existen en la persona pero ya no en el catálogo */}
      {huerfanas.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5">
          <p className="text-xs text-amber-800 font-semibold mb-1.5">
            ⚠️ Skills no presentes en el catálogo ({huerfanas.length})
          </p>
          <p className="text-xs text-amber-700 mb-2">
            Probablemente fueron renombradas o eliminadas. Quítalas o pídele a un admin que las añada al catálogo.
          </p>
          <div className="flex flex-wrap gap-1">
            {huerfanas.map(h => (
              <span key={h}
                className="inline-flex items-center gap-1 text-xs bg-white border border-amber-200 px-2 py-0.5 rounded">
                {h}
                <button type="button" onClick={() => toggle(h)}
                  className="text-amber-500 hover:text-red-600 font-bold">×</button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
