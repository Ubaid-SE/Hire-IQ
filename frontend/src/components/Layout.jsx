import { useState } from 'react'
import Sidebar from './Sidebar'
import dashboardBg from '../assets/pic.png'

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-950 text-white flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="relative flex-1 min-w-0">
        {/* Background image */}
        <div
          className="fixed inset-0 md:left-64 bg-cover bg-center opacity-100 pointer-events-none"
          style={{ backgroundImage: `url(${dashboardBg})` }}
        ></div>
        {/* Fade overlay so content stays fully readable */}
        <div className="fixed inset-0 md:left-64 bg-gradient-to-b from-surface-950/40 via-surface-950/70 to-surface-950/90 pointer-events-none"></div>

        {/* Mobile top bar — hamburger + brand name */}
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-surface-900/95 backdrop-blur-sm border-b border-surface-700 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-surface-800 transition"
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="text-white font-bold tracking-tight">Hire IQ</span>
        </div>

        <main className="relative z-10">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout