import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/ai.png'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/jobs', label: 'Jobs', icon: '💼' },
  { to: '/jobs/new', label: 'New Job', icon: '➕' },
  { to: '/recommended', label: 'Recommended', icon: '⭐' },
]

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <>
      {/* Mobile backdrop — tap outside to close */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        ></div>
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          flex flex-col w-64 shrink-0 h-screen
          bg-surface-900 border-r border-surface-700 px-4 py-6
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-15 h-15 rounded-xl overflow-hidden border border-brand-500/30 shadow-lg shadow-brand-900/50 shrink-0">
            <img src={logo} alt="Hire IQ" className="w-full h-full object-cover" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Hire IQ</span>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="ml-auto md:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-surface-800 transition"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-300 border border-brand-600/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-surface-800 border border-transparent'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-surface-700 pt-4 mt-4">
          <div className="flex items-center gap-2.5 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-200 font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.company}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
          >
            ⏻ Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar