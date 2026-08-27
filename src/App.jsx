import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import WaveBackground from './components/WaveBackground'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import AdminUsers from './pages/AdminUsers'
import AdminUserHistory from './pages/AdminUserHistory'

function App() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-ocean-dark via-ocean-mid to-blue-900 text-white flex flex-col overflow-hidden">
      
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center z-10 p-6 w-full max-w-6xl mx-auto">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/:id" element={
            <ProtectedRoute adminOnly>
              <AdminUserHistory />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>

      <WaveBackground />
    </div>
  )
}

export default App
