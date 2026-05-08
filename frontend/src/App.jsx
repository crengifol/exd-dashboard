import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Personas from './pages/Personas'
import Asignaciones from './pages/Asignaciones'
import Proyectos from './pages/Proyectos'
import Oportunidades from './pages/Oportunidades'
import SkillMatrix from './pages/SkillMatrix'
import Piramide from './pages/Piramide'
import Carrera from './pages/Carrera'

const NAV = [
  { to: '/',             label: 'Dashboard',    icon: '📊' },
  { to: '/asignaciones', label: 'Asignaciones', icon: '🗓️' },
  { to: '/personas',     label: 'Equipo',       icon: '👥' },
  { to: '/piramide',     label: 'Pirámide',     icon: '🔺' },
  { to: '/carrera',      label: 'Carrera',      icon: '📈' },
  { to: '/skill-matrix', label: 'Skill Matrix', icon: '🗺️' },
  { to: '/proyectos',    label: 'Proyectos',    icon: '🔄' },
  { to: '/oportunidades',label: 'Pipeline',     icon: '🚀' },
]

function Sidebar() {
  return (
    <aside
      className="w-56 shrink-0 bg-white flex flex-col h-screen sticky top-0"
      style={{ boxShadow: '1px 0 0 rgba(0,0,0,0.06), 4px 0 24px rgba(0,0,0,0.03)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7048e8 0%, #a688fc 100%)',
              boxShadow: '0 2px 10px rgba(112,72,232,0.35)',
            }}
          >
            <span className="text-white text-xs font-bold tracking-tight">E</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest leading-none mb-0.5">
              ExD
            </p>
            <h1 className="text-sm font-bold text-gray-900 leading-none truncate">
              Control Center
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-4 h-px bg-gray-100" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              isActive
                ? [
                    'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold',
                    'bg-brand-500 text-white transition-all duration-150',
                  ].join(' ')
                : [
                    'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium',
                    'text-gray-500 hover:bg-surface hover:text-gray-900 transition-all duration-150',
                  ].join(' ')
            }
            style={({ isActive }) =>
              isActive ? { boxShadow: '0 2px 8px rgba(112,72,232,0.22)' } : {}
            }
          >
            <span className="text-base leading-none">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mx-4 h-px bg-gray-100" />

      {/* Footer */}
      <div className="px-5 py-4">
        <p className="text-[11px] text-gray-400 font-medium">NTT DATA · ExD</p>
        <p className="text-[10px] text-gray-300 mt-0.5">2026</p>
      </div>
    </aside>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="flex min-h-screen bg-surface">
        <Sidebar />
        <main className="flex-1 overflow-auto min-w-0">
          <Routes>
            <Route path="/"              element={<Dashboard />} />
            <Route path="/asignaciones"  element={<Asignaciones />} />
            <Route path="/personas"      element={<Personas />} />
            <Route path="/skill-matrix"  element={<SkillMatrix />} />
            <Route path="/proyectos"     element={<Proyectos />} />
            <Route path="/oportunidades" element={<Oportunidades />} />
            <Route path="/piramide"      element={<Piramide />} />
            <Route path="/carrera"       element={<Carrera />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
