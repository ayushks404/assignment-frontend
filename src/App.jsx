import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import WaveBackground from './components/WaveBackground'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import AdminUsers from './pages/AdminUsers'
import AdminUserHistory from './pages/AdminUserHistory'

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen w-full bg-gradient-to-br from-ocean-dark via-ocean-mid to-blue-900 text-white flex flex-col p-6 overflow-hidden">
        
        {/* Temporary Navigation Shell (Step 3 Test Only) */}
        <nav className="mb-8 z-10 bg-white/5 p-4 rounded-xl border border-white/10 flex flex-wrap gap-4 justify-center text-sm font-semibold select-none">
          <Link to="/register" className="hover:text-cyan-300 transition-colors">Register</Link>
          <Link to="/login" className="hover:text-cyan-300 transition-colors">Login</Link>
          <Link to="/dashboard" className="hover:text-cyan-300 transition-colors">Dashboard</Link>
          <Link to="/history" className="hover:text-cyan-300 transition-colors">History</Link>
          <Link to="/admin/users" className="hover:text-cyan-300 transition-colors">Admin Users</Link>
          <Link to="/admin/users/123" className="hover:text-cyan-300 transition-colors">Admin User 123</Link>
        </nav>

        {/* Routed Components Outlet */}
        <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-6xl mx-auto">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id" element={<AdminUserHistory />} />
            <Route path="*" element={
              <div className="text-center bg-white/5 border border-white/10 p-8 rounded-2xl max-w-sm">
                <h2 className="text-xl font-bold mb-2">Welcome to Water Tracker</h2>
                <p className="text-cyan-200/50 text-sm">Please select a route from the navigation bar above to verify the routing shell.</p>
              </div>
            } />
          </Routes>
        </div>

        {/* Animated wave backdrop */}
        <WaveBackground />
      </div>
    </BrowserRouter>
  )
}

export default App
