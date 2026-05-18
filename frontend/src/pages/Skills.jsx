import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { skillsApi } from '../services/api'
import Panel from '../components/Panel'
import clsx from 'clsx'

// Categorías sugeridas (el usuario puede crear nuevas)
const CATEGORIAS_SUGERIDAS = ['Research', 'Diseño', 'Sistemas y herramientas', 'AI', 'Soft skills']

const SIN_CATEGORIA = '— Sin categoría —'

const CAT_COLOR = {
  'Research':                  'bg-violet-100 text-violet-700',
  'Diseño':                    'bg-indigo-100 text-indigo-700',
  'Sistemas y herramientas':   'bg-cyan-100 text-cyan-700',
  'AI':                        'bg-fuchsia-100 text-fuchsia-700',
  'Soft skills':               'bg-emerald-100 text-emerald-700',
}
const catColor = c => CAT_COLOR[c] ?? 'bg-gray-100 text-gray-600'

// ── Form (crear/editar) ────────────────────────────────────────────────────
function SkillForm({ initial, onClose, categoriasExistentes }) {
  const qc = useQueryClient()
  const [form, setForm] = useState(initial ? {
    nombre:      initial.nombre ?? '',
    categoria:   initial.categoria ?? '',
    descripcion: initial.descripcion ?? '',
    activa:      initial.activa ?? true,
  } : {
    nombre: '', categoria: '', descripcion: '', activa: true,
  })
  const [creandoCat, setCreandoCat] = useState(false)
  const [nuevaCat,   setNuevaCat]   = useState('')

  // Combinar sugeridas con las existentes en BD
  const categorias = useMemo(() => {
    const set = new Set([...CATEGORIAS_SUGERIDAS, ...(categoriasExistentes ?? [])])
    return Array.from(set).sort()
  }, [categoriasExistentes])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const done = () => {
    qc.invalidateQueries({ queryKey: ['skills'] })
    qc.invalidateQueries({ queryKey: ['skills-categorias'] })
    qc.invalidateQueries({ queryKey: ['personas'] })  // por si el rename propaga
    onClose()
  }

  const create = useMutation({ mutationFn: skillsApi.create, onSuccess: done })
  const update = useMutation({ mutationFn: d => skillsApi.update(initial.id, d), onSuccess: done })
  const busy = create.isPending || update.isPending
  const err  = create.error || update.error

  const submit = e => {
    e.preventDefault()
    const data = { ...form, categoria: form.categoria || null }
    if (initial) update.mutate(data)
    else create.mutate(data)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="form-label">Nombre *</label>
        <input required className="input" value={form.nombre}
          onChange={e => set('nombre', e.target.value)}
          placeholder="ej: UX Research" />
      </div>

      <div>
        <label className="form-label">Categoría</label>
        {creandoCat ? (
          <div className="flex gap-2">
            <input className="input flex-1" autoFocus
              value={nuevaCat} onChange={e => setNuevaCat(e.target.value)}
              placeholder="Nombre de la nueva categoría"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (nuevaCat.trim()) {
                    set('categoria', nuevaCat.trim())
                    setCreandoCat(false)
                    setNuevaCat('')
                  }
                }
              }}
            />
            <button type="button" className="btn-secondary text-xs"
              onClick={() => {
                if (nuevaCat.trim()) {
                  set('categoria', nuevaCat.trim())
                  setCreandoCat(false)
                  setNuevaCat('')
                }
              }}>OK</button>
            <button type="button" className="btn-secondary text-xs"
              onClick={() => { setCreandoCat(false); setNuevaCat('') }}>Cancelar</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <select className="input flex-1" value={form.categoria}
              onChange={e => set('categoria', e.target.value)}>
              <option value="">{SIN_CATEGORIA}</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="button" className="btn-secondary text-xs whitespace-nowrap"
              onClick={() => setCreandoCat(true)}>+ Nueva</button>
          </div>
        )}
      </div>

      <div>
        <label className="form-label">Descripción</label>
        <textarea rows={2} className="input resize-none" value={form.descripcion}
          onChange={e => set('descripcion', e.target.value)}
          placeholder="Opcional. Aclara qué cubre esta skill." />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.activa}
          onChange={e => set('activa', e.target.checked)}
          className="w-4 h-4 accent-brand-500" />
        <span className="text-sm text-gray-700">Activa</span>
        <span className="text-xs text-gray-400">
          (las inactivas no aparecen en el formulario de personas)
        </span>
      </label>

      {err && <p className="text-xs text-red-500">Error: {err.response?.data?.detail || err.message}</p>}

      <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
        <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? 'Guardando...' : (initial ? 'Guardar cambios' : 'Crear skill')}
        </button>
      </div>
    </form>
  )
}

// ── Página ─────────────────────────────────────────────────────────────────
export default function Skills() {
  const qc = useQueryClient()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [search, setSearch]     = useState('')
  const [filtroCat, setFiltroCat] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(null)

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn:  skillsApi.list,
  })
  const { data: categoriasExistentes = [] } = useQuery({
    queryKey: ['skills-categorias'],
    queryFn:  skillsApi.categorias,
  })

  const del = useMutation({
    mutationFn: id => skillsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['skills'] })
      setConfirmingDelete(null)
    },
  })

  // Filtrado
  const filtered = skills.filter(s => {
    if (search && !s.nombre.toLowerCase().includes(search.toLowerCase())) return false
    if (filtroCat === '__sin__' && s.categoria) return false
    if (filtroCat && filtroCat !== '__sin__' && s.categoria !== filtroCat) return false
    return true
  })

  // Agrupar por categoría
  const byCategoria = useMemo(() => {
    const grupos = {}
    for (const s of filtered) {
      const cat = s.categoria ?? SIN_CATEGORIA
      if (!grupos[cat]) grupos[cat] = []
      grupos[cat].push(s)
    }
    // Ordenar: categorías sugeridas primero, otras alfabético, "sin categoría" al final
    const sortedKeys = Object.keys(grupos).sort((a, b) => {
      if (a === SIN_CATEGORIA) return 1
      if (b === SIN_CATEGORIA) return -1
      const aIdx = CATEGORIAS_SUGERIDAS.indexOf(a)
      const bIdx = CATEGORIAS_SUGERIDAS.indexOf(b)
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
      if (aIdx !== -1) return -1
      if (bIdx !== -1) return 1
      return a.localeCompare(b)
    })
    return sortedKeys.map(k => [k, grupos[k]])
  }, [filtered])

  const totalSinCat = skills.filter(s => !s.categoria).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Catálogo de Skills</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">
            {skills.length} skill{skills.length !== 1 ? 's' : ''}
            {totalSinCat > 0 && ` · ${totalSinCat} sin categoría`}
          </p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary">+ Nueva skill</button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar skill…" className="input text-sm max-w-64" />
        <select value={filtroCat} onChange={e => setFiltroCat(e.target.value)}
          className="input text-sm max-w-56">
          <option value="">Todas las categorías</option>
          {[...CATEGORIAS_SUGERIDAS, ...categoriasExistentes.filter(c => !CATEGORIAS_SUGERIDAS.includes(c))]
            .map(c => <option key={c} value={c}>{c}</option>)}
          <option value="__sin__">— Sin categoría —</option>
        </select>
      </div>

      {/* Lista agrupada */}
      {isLoading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Cargando…</p>
      ) : skills.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
          <p className="text-sm text-gray-500 mb-3">El catálogo está vacío.</p>
          <button onClick={() => setCreating(true)} className="btn-primary text-sm">+ Crear primera skill</button>
        </div>
      ) : (
        <div className="space-y-6">
          {byCategoria.map(([cat, items]) => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-2">
                <span className={clsx('badge text-xs', catColor(cat))}>{cat}</span>
                <span className="text-xs text-gray-400">{items.length}</span>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
                {items.map(s => (
                  <div key={s.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50/60">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={clsx(
                          'text-sm font-semibold',
                          s.activa ? 'text-gray-900' : 'text-gray-400 line-through',
                        )}>{s.nombre}</p>
                        {!s.activa && <span className="text-xs text-gray-400">(inactiva)</span>}
                      </div>
                      {s.descripcion && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{s.descripcion}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 w-20 text-right">
                      {s.personas_count} {s.personas_count === 1 ? 'persona' : 'personas'}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {confirmingDelete === s.id ? (
                        <>
                          <span className="text-xs text-red-600">¿Borrar?</span>
                          <button onClick={() => del.mutate(s.id)}
                            className="text-xs text-red-600 font-semibold hover:underline">Sí</button>
                          <button onClick={() => setConfirmingDelete(null)}
                            className="text-xs text-gray-500 hover:underline">No</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setEditing(s)}
                            className="text-xs text-brand-600 hover:text-brand-800 font-semibold">✏️</button>
                          <button onClick={() => setConfirmingDelete(s.id)}
                            className="text-xs text-red-400 hover:text-red-600">✕</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 py-6 text-center">Sin resultados con esos filtros.</p>
          )}
        </div>
      )}

      {/* Error de borrado */}
      {del.error && (
        <div className="fixed bottom-6 right-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 max-w-md shadow-lg">
          <p className="text-sm text-red-700 font-semibold">No se pudo borrar</p>
          <p className="text-xs text-red-600 mt-1">{del.error.response?.data?.detail || del.error.message}</p>
        </div>
      )}

      {creating && (
        <Panel title="Nueva skill" onClose={() => setCreating(false)}>
          <SkillForm onClose={() => setCreating(false)} categoriasExistentes={categoriasExistentes} />
        </Panel>
      )}
      {editing && (
        <Panel title={`Editar — ${editing.nombre}`} onClose={() => setEditing(null)}>
          <SkillForm initial={editing} onClose={() => setEditing(null)}
            categoriasExistentes={categoriasExistentes} />
        </Panel>
      )}
    </div>
  )
}
