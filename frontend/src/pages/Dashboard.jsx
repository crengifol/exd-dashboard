import { useQuery } from '@tanstack/react-query'
import { dashboardApi, asignacionesApi } from '../services/api'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

function StatCard({ label, value, icon, highlight }) {
  return (
    <div className="card flex flex-col gap-3 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide leading-tight">
          {label}
        </p>
        <span className="text-base">{icon}</span>
      </div>
      <p
        className={`text-4xl font-extrabold tabular-nums leading-none tracking-tight ${
          highlight === 'danger'  ? 'text-red-600'     :
          highlight === 'success' ? 'text-emerald-600' :
          'text-gray-900'
        }`}
      >
        {value ?? <span className="text-gray-200">—</span>}
      </p>
    </div>
  )
}

export default function Dashboard() {
  const { data: summary } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardApi.summary,
  })

  const { data: liberaciones } = useQuery({
    queryKey: ['liberaciones', 14],
    queryFn: () => asignacionesApi.proximasLiberaciones(14),
  })

  return (
    <div className="p-8 space-y-8 max-w-6xl">

      {/* ── Hero gradient section ─────────────────────────── */}
      <div
        className="rounded-3xl p-8 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #7048e8 0%, #9065f0 50%, #c3b3ff 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />

        <div className="relative">
          <p className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-2">
            ExD Control Center
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight">Dashboard</h2>
          <p className="text-white/60 mt-1 font-medium text-sm">Vista operativa del equipo</p>
        </div>
      </div>

      {/* ── KPI cards ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard label="Personas" value={summary?.total_personas} icon="👥" />
        <StatCard label="Asignaciones activas" value={summary?.asignaciones_activas} icon="🗓️" />
        <StatCard
          label="Liberaciones en 14 días"
          value={summary?.liberaciones_proximas}
          icon="🔓"
          highlight={summary?.liberaciones_proximas > 0 ? 'success' : undefined}
        />
        <StatCard label="Proyectos activos" value={summary?.proyectos_activos} icon="🔄" />
        <StatCard label="Pipeline abierto" value={summary?.oportunidades_abiertas} icon="🚀" />
        <StatCard
          label="Proyectos en riesgo"
          value={summary?.proyectos_at_risk}
          icon="⚠️"
          highlight={summary?.proyectos_at_risk > 0 ? 'danger' : undefined}
        />
      </div>

      {/* ── Próximas liberaciones ─────────────────────────── */}
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2.5">
          <span
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', color: 'white' }}
          >
            🔓
          </span>
          <span className="text-base">Liberaciones próximas</span>
          <span className="text-xs font-semibold text-gray-400 ml-1">· 14 días</span>
        </h3>

        {!liberaciones?.length ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-400 font-medium">Sin liberaciones en las próximas 2 semanas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 pr-6 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Persona</th>
                  <th className="pb-3 pr-6 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Proyecto</th>
                  <th className="pb-3 pr-6 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Cliente</th>
                  <th className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Liberación</th>
                </tr>
              </thead>
              <tbody>
                {liberaciones.map((a) => (
                  <tr key={a.id} className="border-b border-gray-50 last:border-0 hover:bg-brand-50/30 transition-colors">
                    <td className="py-3.5 pr-6 font-semibold text-gray-800">{a.persona_id}</td>
                    <td className="py-3.5 pr-6 text-gray-500">{a.proyecto_id}</td>
                    <td className="py-3.5 pr-6 text-gray-500">{a.cliente}</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                                       bg-emerald-100 text-emerald-700 text-xs font-bold">
                        {format(new Date(a.fecha_liberacion), 'dd MMM', { locale: es })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
