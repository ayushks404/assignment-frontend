import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/client'
import Card from '../components/Card'
import Button from '../components/Button'

export default function AdminUserHistory() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Goal editing states
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')

  // Custom delete daily logs modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [dayToDelete, setDayToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchUserData = async () => {
    try {
      const [usersRes, historyRes] = await Promise.all([
        api.get('/admin/users'),
        api.get(`/admin/users/${id}/history`)
      ])

      const foundUser = usersRes.data.find((u) => u._id === id)
      if (foundUser) {
        setUser(foundUser)
      } else {
        setError('User profile not found.')
      }

      if (Array.isArray(historyRes.data)) {
        setHistory(historyRes.data)
      }
    } catch (err) {
      console.error('Failed to load user details/history:', err.message)
      setError('Could not retrieve user directory profile and log logs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [id])

  // Save updated goal to backend
  const handleSaveGoal = async () => {
    setEditError('')
    const parsedGoal = parseInt(goalInput, 10)

    if (isNaN(parsedGoal) || parsedGoal <= 0) {
      setEditError('Goal must be a positive number.')
      return
    }

    try {
      setEditLoading(true)
      await api.patch(`/admin/users/${id}/goal`, { dailyGoalMl: parsedGoal })
      setIsEditingGoal(false)
      await fetchUserData()
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update daily goal.')
    } finally {
      setEditLoading(false)
    }
  }

  // Handle persistent deletion of a day's logs via backend
  const handleDeleteConfirm = async () => {
    if (!dayToDelete) return
    try {
      setDeleteLoading(true)
      await api.delete(`/admin/users/${id}/history/${dayToDelete.date}`)
      setHistory((prevHistory) => prevHistory.filter((day) => day.date !== dayToDelete.date))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete logs for this day.')
    } finally {
      setDeleteLoading(false)
      setShowDeleteModal(false)
      setDayToDelete(null)
    }
  }

  // Timezone-safe date utility (matches personal History view)
  const formatHistoryDate = (dateStr) => {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
  }

  if (loading) {
    return (
      <div className="text-cyan-200 text-sm font-semibold tracking-wider animate-pulse text-center">
        Loading user log details...
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-6">
      
      {/* Back redirection button link */}
      <div>
        <button
          onClick={() => navigate('/admin/users')}
          className="text-xs flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer select-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Users
        </button>
      </div>

      {error && (
        <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center">
          {error}
        </div>
      )}

      {user && (
        <div className="flex flex-col gap-6 animate-fade-in">
          
          {/* User detail summary card header */}
          <Card className="flex flex-col md:flex-row md:items-center justify-between border border-white/10 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-extrabold text-white">{user.name}</h2>
                {user.role === 'admin' && (
                  <span className="bg-cyan-500/20 text-cyan-300 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border border-cyan-500/30">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-cyan-200/50 break-all">{user.email}</p>
            </div>
            
            <div className="flex flex-col md:items-end justify-center min-h-[64px]">
              <span className="text-xs uppercase tracking-widest text-cyan-200/40 font-semibold mb-1">Daily Goal</span>
              
              {isEditingGoal ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    className="w-24 bg-white/5 border border-white/20 rounded-lg px-2.5 py-1 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 text-sm font-bold text-center"
                    placeholder="e.g. 2000"
                    min="1"
                    required
                  />
                  <button
                    onClick={handleSaveGoal}
                    disabled={editLoading}
                    className="text-xs bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30 px-2.5 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer"
                  >
                    {editLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditingGoal(false)}
                    className="text-xs bg-white/5 hover:bg-white/10 text-white/70 border border-white/15 px-2.5 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-white">{user.dailyGoalMl} ml</span>
                  <button
                    onClick={() => {
                      setGoalInput(user.dailyGoalMl.toString())
                      setIsEditingGoal(true)
                      setEditError('')
                    }}
                    className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 px-2 py-1 rounded transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              )}

              {editError && (
                <span className="text-[10px] text-red-400 mt-1.5 animate-pulse font-medium">{editError}</span>
              )}
            </div>
          </Card>

          {/* User History Records Section */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Intake History</h3>
            
            {history.length === 0 ? (
              <Card className="text-center p-8 border border-white/10">
                <p className="text-sm text-cyan-200/60 font-medium">No logs recorded yet for this user.</p>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {history.map((day, index) => {
                  const rawPercent = day.goalMl > 0 ? Math.round((day.totalMl / day.goalMl) * 100) : 0
                  const displayPercent = Math.min(rawPercent, 100)

                  return (
                    <Card
                      key={day.date || index}
                      className="flex flex-col gap-3 border border-white/10 hover:border-cyan-500/20 transition-colors duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white text-base">
                            {formatHistoryDate(day.date)}
                          </span>
                          <button
                            onClick={() => {
                              setDayToDelete(day)
                              setShowDeleteModal(true)
                            }}
                            className="text-[9px] uppercase font-bold tracking-widest text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-2 py-0.5 rounded transition-colors cursor-pointer select-none"
                          >
                            Delete
                          </button>
                        </div>
                        <div className="flex items-baseline gap-2 text-right">
                          <span className="text-sm font-bold text-white">{day.totalMl} ml</span>
                          <span className="text-xs text-cyan-200/50">/ {day.goalMl} ml</span>
                        </div>
                      </div>

                      <div className="w-full h-3 bg-white/5 border border-white/10 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500/80 to-cyan-400/80 transition-all duration-500 ease-out"
                          style={{ width: `${displayPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-cyan-200/50 font-semibold tracking-wider uppercase">
                        <span>Progress</span>
                        <span className={rawPercent >= 100 ? 'text-cyan-400 font-bold' : ''}>
                          {rawPercent}% {rawPercent >= 100 ? '✓ Goal Met' : ''}
                        </span>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && dayToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-sm border border-red-500/20 shadow-2xl relative flex flex-col gap-6">
            
            <div className="flex items-center gap-3">
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Delete Daily Logs</h3>
            </div>

            <p className="text-sm text-cyan-200/70 leading-relaxed">
              Are you sure you want to remove all water intake logs for <strong className="text-white">{formatHistoryDate(dayToDelete.date)}</strong>?
            </p>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDayToDelete(null)
                }}
                disabled={deleteLoading}
                className="text-xs bg-white/5 hover:bg-white/10 text-white/70 border border-white/15 px-4 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer disabled:opacity-55"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="text-xs bg-red-500/25 hover:bg-red-500/40 text-red-300 border border-red-500/30 px-4 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer disabled:opacity-55"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Logs'}
              </button>
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}
