import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import WaveBackground from './components/WaveBackground'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import AdminUsers from './pages/AdminUsers'
import AdminUserHistory from './pages/AdminUserHistory'

function App() {
  const navigate = useNavigate()

  // Mock login states: 'admin', 'user', or null (guest)
  const [mockRole, setMockRole] = useState('user')
  const [mockUser, setMockUser] = useState({ name: 'Ayush', role: 'user' })

  const handleRoleChange = (role) => {
    setMockRole(role)
    if (role === 'guest') {
      setMockUser(null)
    } else {
      setMockUser({ name: role === 'admin' ? 'Admin Ayush' : 'User Ayush', role })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    handleRoleChange('guest')
    navigate('/login')
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-ocean-dark via-ocean-mid to-blue-900 text-white flex flex-col overflow-hidden">
      
      {/* Conditional Navbar mounted once above the route outlet */}
      <Navbar user={mockUser} onLogout={handleLogout} />

      {/* Routed Components Outlet */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 p-6 w-full max-w-6xl mx-auto">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:id" element={<AdminUserHistory />} />
          <Route path="*" element={
            <div className="text-center bg-white/5 border border-white/10 p-8 rounded-2xl max-w-sm">
              <h2 className="text-xl font-bold mb-2">Water Tracker</h2>
              <p className="text-cyan-200/50 text-sm">Select a route or change active mock user role to test layout dynamics.</p>
            </div>
          } />
        </Routes>
      </div>

      {/* Floating Mock Role Switcher Widget (For Dev Staging Only) */}
      <div className="fixed bottom-4 right-4 z-50 bg-slate-800/90 backdrop-blur border border-slate-700 p-3.5 rounded-xl shadow-lg flex flex-col gap-2 text-xs select-none">
        <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">Mock User Control</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleRoleChange('user')}
            className={`px-3 py-1 rounded font-medium cursor-pointer ${mockRole === 'user' ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            User Role
          </button>
          <button
            onClick={() => handleRoleChange('admin')}
            className={`px-3 py-1 rounded font-medium cursor-pointer ${mockRole === 'admin' ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            Admin Role
          </button>
          <button
            onClick={() => handleRoleChange('guest')}
            className={`px-3 py-1 rounded font-medium cursor-pointer ${mockRole === 'guest' ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            Guest (Null)
          </button>
        </div>
      </div>

      {/* Animated wave backdrop */}
      <WaveBackground />
    </div>
  )
}

export default App
