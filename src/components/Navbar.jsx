import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  // Hide on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

  const isActive = (path) => {
    return location.pathname === path
      ? "text-cyan-400 border-b-2 border-cyan-400 font-bold"
      : "text-white/80 hover:text-cyan-300 font-medium"
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/10 backdrop-blur-md border-b border-white/15 px-6 py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Left: App Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 select-none group">
          <svg className="w-8 h-8 text-cyan-400 filter drop-shadow-[0_0_4px_rgba(34,211,238,0.3)] transition-transform group-hover:scale-105" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          <span className="text-xl font-bold tracking-wider text-white">
            WaterTracker
          </span>
        </Link>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-cyan-400 focus:outline-none cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Right: Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className={`py-1 transition-colors ${isActive('/dashboard')}`}>
            Dashboard
          </Link>
          <Link to="/history" className={`py-1 transition-colors ${isActive('/history')}`}>
            History
          </Link>
          
          {user?.role === 'admin' && (
            <Link to="/admin/users" className={`py-1 transition-colors ${isActive('/admin/users')}`}>
              Users
            </Link>
          )}

          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              <span className="text-sm font-semibold text-white/90">
                {user.name}
              </span>
              {user.role === 'admin' && (
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  Admin
                </span>
              )}
              <button
                onClick={onLogout}
                className="text-xs bg-red-500/25 hover:bg-red-500/40 text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Links Drawer */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-4">
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className={`py-1 transition-colors ${isActive('/dashboard')}`}
          >
            Dashboard
          </Link>
          <Link
            to="/history"
            onClick={() => setIsOpen(false)}
            className={`py-1 transition-colors ${isActive('/history')}`}
          >
            History
          </Link>
          
          {user?.role === 'admin' && (
            <Link
              to="/admin/users"
              onClick={() => setIsOpen(false)}
              className={`py-1 transition-colors ${isActive('/admin/users')}`}
            >
              Users
            </Link>
          )}

          {user && (
            <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white/90">
                  {user.name}
                </span>
                {user.role === 'admin' && (
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  onLogout()
                }}
                className="text-center text-xs bg-red-500/25 hover:bg-red-500/40 text-red-300 border border-red-500/30 px-3 py-2 rounded-lg transition-colors font-medium cursor-pointer w-full"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
