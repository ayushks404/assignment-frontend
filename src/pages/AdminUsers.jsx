import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import Card from '../components/Card'
import Button from '../components/Button'

export default function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users')
        if (Array.isArray(res.data)) {
          setUsers(res.data)
        }
      } catch (err) {
        console.error('Failed to load users:', err.message)
        setError('Could not retrieve user directory.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="text-cyan-200 text-sm font-semibold tracking-wider animate-pulse text-center">
        Loading user directory...
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white mb-1">User Directory</h2>
        <p className="text-cyan-200/50 text-xs">Manage registered accounts and monitor daily water consumption goals</p>
      </div>

      {error && (
        <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center animate-fade-in">
          {error}
        </div>
      )}

      {!error && users.length === 0 ? (
        <Card className="text-center p-8 border border-white/10">
          <p className="text-sm text-cyan-200/60 font-medium">No registered accounts found.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((u) => (
            <Card
              key={u._id}
              className="flex flex-col justify-between border border-white/10 hover:border-cyan-500/20 transition-all duration-300 gap-4"
            >
              {/* User Core Info */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-base">{u.name}</span>
                    {u.role === 'admin' && (
                      <span className="bg-cyan-500/20 text-cyan-300 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border border-cyan-500/30">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-cyan-200/50 break-all">{u.email}</span>
                </div>

                <div className="text-right flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-cyan-200/40 font-semibold mb-0.5">Goal</span>
                  <span className="text-sm font-bold text-white">{u.dailyGoalMl} ml</span>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(`/admin/users/${u._id}`)}
                  variant="primary"
                  className="w-full text-xs py-2 cursor-pointer"
                >
                  View Intake History
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
