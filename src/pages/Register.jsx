import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'
import Card from '../components/Card'
import Button from '../components/Button'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(false)

    if (!name || !email || !password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      setLoading(true)
      const res = await api.post('/auth/register', { name, email, password })
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token)
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user))
        }
        navigate('/dashboard')
      } else {
        setError('Registration succeeded, but no token was returned.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-2xl border border-white/20">
      <h2 className="text-3xl font-extrabold text-white text-center mb-1">Create Account</h2>
      <p className="text-cyan-200/50 text-xs text-center mb-6">Join WaterTracker and stay hydrated</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-cyan-200/70 mb-1.5 uppercase tracking-wider">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-cyan-200/70 mb-1.5 uppercase tracking-wider">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-cyan-200/70 mb-1.5 uppercase tracking-wider">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
            required
          />
        </div>

        <Button type="submit" variant="primary" className="mt-2 w-full cursor-pointer" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </Button>

        {error && (
          <div className="mt-2 text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg animate-pulse">
            {error}
          </div>
        )}
      </form>

      <div className="mt-6 text-center text-xs text-cyan-100/50">
        Already have an account?{' '}
        <Link to="/login" className="text-cyan-400 hover:underline font-semibold">
          Sign In
        </Link>
      </div>
    </Card>
  )
}
