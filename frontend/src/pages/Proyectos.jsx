import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { proyectosApi, asignacionesApi, personasApi } from '../services/api'
import { FASES_PROYECTO, FASES_LABEL, HEALTH_COLOR, HEALTH_LABEL, NIVEL_COLOR } from '../utils/constants'
import clsx from 'clsx'
import Panel from '../components/Panel'

const slugify = s =>
  s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

const EMPTY = {
  nombre: '', cliente: '', descripcion: '', fase: 'discovery',
  health: 'on_track', porcentaje_completado: 0,
  stakeholder: '', next_milestone: '',
  fecha_inicio: '', fecha_launch: '',
}

const FASE_GRADIENT = {
  discovery:  'from-violet-500 to-purple-600',
  design:     'from-blue-500 to-indigo-600',
  testing:    'from-amber-500 to-orange-600',
  launch:     'from-emerald-500 to-teal-600',
  evolution:  'from-pink-500 to-rose-600',
}

// ── Formulario ────────────────────────────────────────────────────────────────
function ProyectoForm({ initial, onClose }) {
  const qc = useQueryClient()
  const [form, setForm] = useState(initial ? {
    nombre:                initial.nombre ?? '',
    cliente:               initial.cliente ?? '',
    descripcion:           initial.descripcion ?? '',
    fase:                  initial.fase ?? 'discovery',
    health:                initial.health ?? 'on_track',
    porcentaje_completado: initial.porcentaje_completado ?? 0,
    stakeholder:           initial.stakeholder ?? '',
    next_milestone:        initial.next_milestone ?? '',
    fecha_inicio:          initial.fecha_inicio ?? '',
    fecha_launch:          initial.fecha_launch ?? '',
  } : { ...EMPTY })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const done = () => {
    qc.invalidateQueries({ queryKey: ['proyectos'] })
    qc.invalidateQueries({ queryKey: ['dashboard'] })
    onClose()
  }

  const create = useMutation({ mutationFn: proyectosApi.create, onSuccess: done })
  const update = useMutation({ mutationFn: d => proyectosApi.update(initial.id, d), onSuccess: done })
  const busy = create.isPending || update.isPending
  const err  = create.error || update.error

  const submit = e => {
    e.preventDefault()
    const data = {
      ...form,
      porcentaje_completado: Number(form.porcentaje_completado),
      fecha_inicio: form.fecha_inicio || null,
      fecha_launch: form.fecha_launch || null,
    }
    if (initial) update.mutate(data)
    else create.mutate({ ...data, id: slugify(form.nombre) })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Nombre *</label>
          <input required className="input" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
        </div>
        <div>
          <label className="form-label">Cliente *</label>
          <input required className="input" value={form.cliente} onChange={e => set('cliente', e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Fase</label>
          <select className="input" value={form.fase} onChange={e => set('fase', e.target.value)}>
            {FASES_PROYECTO.map(f => <option key={f} value={f}>{FASES_LABEL[f]}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Estado</label>
          <select className="input" value={form.health} onChange={e => set('health', e.target.value)}>
            {Object.entries(HEALTH_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="form-label">Progreso: {form.porcentaje_completado}%</label>
        <input type="range" min="0" max="100" step="5"
          className="w-full accent-brand-500 h-2 rounded-full"
          value={form.porcentaje_completado} onChange={e => set('porcentaje_completado', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Fecha inicio</label>
          <input type="date" className="input" value={form.fecha_inicio}
            onChange={e => set('fecha_inicio', e.target.value)} />
        </div>
        <div>
          <label className="form-label">Fecha lanzamiento</label>
          <input type="date" className="input" value={form.fecha_launch}
            onChange={e => set('fecha_launch', e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Stakeholder</label>
          <input className="input" value={form.stakeholder} onChange={e => set('stakeholder', e.target.value)}
            placeholder="ej: María González" />
        </div>
        <div>
          <label className="form-label">Próximo hito</label>
          <input className="input" value={form.next_milestone} onChange={e => set('next_milestone', e.target.value)}
            placeholder="ej: Entrega wireframes" />
        </div>
      </div>
      <div>
        <label className="form-label">Descripción</label>
        <textarea rows={2} className="input resize-none" value={form.descripcion}
          onChange={e => set('descripcion', e.target.value)} />
      </div>
      {err && <p className="text-xs text-red-500">Error: {err.message}</p>}
      <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
        <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? 'Guardando...' : (initial ? 'Guardar cambios' : 'Crear proyecto')}
        </button>
      </div>
    </form>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
function ProyectoCard({ proyecto, asignados, onEdit }) {
  const qc = useQueryClient()
  const [confirming, setConfirming] = useState(false)

  const del = useMutation({
    mutationFn: () => proyectosApi.delete(proyecto.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proyectos'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const activos = asignados.filter(a => a.estado === 'active')

  return (
    <div className="card hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-bold text-gray-900 text-sm">{proyecto.nombre}</p>
          <p className="text-xs text-gray-400">{proyecto.cliente}</p>
        </div>
        <span className={clsx('badge', HEALTH_COLOR[proyecto.health])}>
          {HEALTH_LABEL[proyecto.health]}
        </span>
      </div>

      {(proyecto.fecha_inicio || proyecto.fecha_launch) && (
        <p className="text-xs text-gray-400 mb-2 font-medium">
          📅 {proyecto.fecha_inicio ?? '—'} → {proyecto.fecha_launch ?? '—'}
        </p>
      )}

      {proyecto.stakeholder && (
        <p className="text-xs text-gray-500 mb-2">👤 {proyecto.stakeholder}</p>
      )}

      <div className="mt-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-medium">
          <span>Progreso</span>
          <span className="font-bold text-gray-600">{proyecto.porcentaje_completado}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(112,72,232,0.08)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${proyecto.porcentaje_completado}%`,
              background: 'linear-gradient(90deg, #7048e8, #a688fc)',
            }}
          />
        </div>
      </div>

      {activos.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-1.5 font-medium">👥 Equipo activo ({activos.length})</p>
          <div className="flex flex-wrap gap-1">
            {activos.slice(0, 4).map(a => (
              <span key={a.id} className={clsx('badge', NIVEL_COLOR[a.nivel_seniority] ?? 'bg-gray-100 text-gray-600')}>
                {a.persona_nombre}
              </span>
            ))}
            {activos.length > 4 && (
              <span className="text-xs text-gray-400">+{activos.length - 4}</span>
            )}
          </div>
        </div>
      )}

      {proyecto.next_milestone && (
        <p className="mt-2.5 text-xs text-brand-600 font-semibold">→ {proyecto.next_milestone}</p>
      )}

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100/50">
        {confirming ? (
          <div className="flex gap-2 items-center">
            <span className="text-xs text-red-600">¿Eliminar?</span>
            <button onClick={() => del.mutate()} className="text-xs text-red-600 font-semibold hover:underline">Sí</button>
            <button onClick={() => setConfirming(false)} className="text-xs text-gray-500 hover:underline">No</button>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)} className="text-xs text-red-400 hover:text-red-600">✕</button>
        )}
        <button onClick={onEdit} className="text-xs text-brand-600 hover:text-brand-800 font-semibold">✏️ Editar</button>
      </div>
    </div>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function Proyectos() {
  const [creating, setCreating] = useState(false)
  const [editing, setEditing]   = useState(null)

  const { data: proyectos = [], isLoading } = useQuery({
    queryKey: ['proyectos'],
    queryFn: () => proyectosApi.list(),
  })
  const { data: asignaciones = [] } = useQuery({
    queryKey: ['asignaciones'],
    queryFn: () => asignacionesApi.list(),
  })
  const { data: personas = [] } = useQuery({
    queryKey: ['personas'],
    queryFn: () => personasApi.list(),
  })

  // enrich asignaciones with persona data
  const personaMap = Object.fromEntries(personas.map(p => [p.id, p]))
  const enrichedAsignaciones = asignaciones.map(a => ({
    ...a,
    persona_nombre: personaMap[a.persona_id]?.nombre ?? a.persona_id,
    nivel_seniority: personaMap[a.persona_id]?.nivel_seniority,
  }))

  const byFase = FASES_PROYECTO.reduce((acc, fase) => {
    acc[fase] = proyectos.filter(p => p.fase === fase)
    return acc
  }, {})

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Proyectos activos</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">{proyectos.length} proyectos</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary">+ Nuevo proyecto</button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400 py-8 text-center">Cargando...</p>
      ) : (
        <div className="grid grid-cols-5 gap-3 min-w-max">
          {FASES_PROYECTO.map(fase => (
            <div key={fase} className="w-72">
              {/* Gradient phase header */}
              <div className={clsx(
                'mb-4 rounded-xl px-4 py-2.5 flex items-center justify-between',
                'bg-gradient-to-r text-white',
                FASE_GRADIENT[fase],
              )}
                style={{ boxShadow: '0 3px 12px rgba(0,0,0,0.12)' }}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  {FASES_LABEL[fase]}
                </h3>
                <span className="text-xs font-bold bg-white/20 rounded-full w-5 h-5 flex items-center justify-center">
                  {byFase[fase].length}
                </span>
              </div>
              <div className="space-y-4">
                {byFase[fase].map(p => (
                  <ProyectoCard
                    key={p.id}
                    proyecto={p}
                    asignados={enrichedAsignaciones.filter(a => a.proyecto_id === p.id)}
                    onEdit={() => setEditing(p)}
                  />
                ))}
                {byFase[fase].length === 0 && (
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl h-24 flex items-center justify-center">
                    <span className="text-xs text-gray-400">Sin proyectos</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <Panel title="Nuevo proyecto" onClose={() => setCreating(false)}>
          <ProyectoForm onClose={() => setCreating(false)} />
        </Panel>
      )}
      {editing && (
        <Panel title={`Editar — ${editing.nombre}`} onClose={() => setEditing(null)}>
          <ProyectoForm initial={editing} onClose={() => setEditing(null)} />
        </Panel>
      )}
    </div>
  )
}
