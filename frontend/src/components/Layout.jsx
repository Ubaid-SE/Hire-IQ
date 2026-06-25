import Sidebar from './Sidebar'
import dashboardBg from '../assets/login-bg.jpg'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-surface-950 text-white flex">
      <Sidebar />

      <div className="relative flex-1 min-w-0">
        {/* Subtle fixed background image */}
        <div
          className="fixed inset-0 md:left-64 bg-cover bg-center opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: `url(${dashboardBg})` }}
        ></div>
        {/* Fade overlay so content stays fully readable */}
        <div className="fixed inset-0 md:left-64 bg-gradient-to-b from-surface-950/60 via-surface-950/85 to-surface-950 pointer-events-none"></div>

        <main className="relative z-10">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
