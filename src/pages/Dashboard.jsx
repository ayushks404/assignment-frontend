import { useState, useEffect } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import Button from '../components/Button'

export default function Dashboard() {
  const { user } = useAuth()
  
  const [totalMl, setTotalMl] = useState(0)
  const [goalMl, setGoalMl] = useState(2000)
  const [percent, setPercent] = useState(0)
  const [remainingMl, setRemainingMl] = useState(2000)
  
  const [customAmount, setCustomAmount] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)

  // Today's raw logs state (persisted via localStorage)
  const [todayLogs, setTodayLogs] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [logToDelete, setLogToDelete] = useState(null)

  // Fetch today's intake summary
  const fetchTodayData = async () => {
    try {
      const res = await api.get('/intake/today')
      if (res.data) {
        setTotalMl(res.data.totalMl || 0)
        setGoalMl(res.data.goalMl || 2000)
        setRemainingMl(res.data.remainingMl ?? 2000)
        setPercent(res.data.percent || 0)
      }
    } catch (err) {
      console.error('Failed to fetch today\'s intake:', err.message)
      setError('Could not retrieve today\'s summary.')
    } finally {
      setLoading(false)
    }
  }

  // Load today's logs from localStorage on mount
  useEffect(() => {
    fetchTodayData()
    
    if (user?.id) {
      const saved = localStorage.getItem(`today_logs_${user.id}`)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          const startOfToday = new Date()
          startOfToday.setHours(0, 0, 0, 0)
          
          // Filter out logs from previous days
          const logsToday = parsed.filter(
            (log) => new Date(log.loggedAt || log.createdAt) >= startOfToday
          )
          setTodayLogs(logsToday)
          localStorage.setItem(`today_logs_${user.id}`, JSON.stringify(logsToday))
        } catch (e) {
          setTodayLogs([])
        }
      }
    }
  }, [user])

  // Handle logging amount
  const handleLogIntake = async (amount) => {
    setError('')
    const parsedAmount = parseInt(amount, 10)

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a positive amount.')
      return
    }

    try {
      setSubmitLoading(true)
      const res = await api.post('/intake', { amountMl: parsedAmount })
      
      // Save returning log object (contains database ID and timestamp)
      if (res.data && user?.id) {
        const updated = [...todayLogs, res.data]
        setTodayLogs(updated)
        localStorage.setItem(`today_logs_${user.id}`, JSON.stringify(updated))
      }
      
      setCustomAmount('')
      await fetchTodayData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log water intake.')
    } finally {
      setSubmitLoading(false)
    }
  }

  // Trigger confirmation modal for entry deletion
  const handleDeleteTrigger = (log) => {
    setLogToDelete(log)
    setShowDeleteModal(true)
  }

  // Handle delete call to backend
  const handleDeleteConfirm = async () => {
    if (!logToDelete || !user?.id) return

    try {
      setSubmitLoading(true)
      await api.delete(`/intake/${logToDelete._id}`)
      
      const updated = todayLogs.filter((log) => log._id !== logToDelete._id)
      setTodayLogs(updated)
      localStorage.setItem(`today_logs_${user.id}`, JSON.stringify(updated))
      
      setShowDeleteModal(false)
      setLogToDelete(null)
      await fetchTodayData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete intake entry.')
      setShowDeleteModal(false)
      setLogToDelete(null)
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-cyan-200 text-sm font-semibold tracking-wider animate-pulse text-center">
        Loading dashboard data...
      </div>
    )
  }

  const fillHeight = Math.min(Math.max(percent, 0), 100)

  return (
    <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center justify-center">
      
      {/* Left: Circular Wave Progress Visualizer */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-64 h-64 rounded-full border-4 border-cyan-400/30 overflow-hidden flex flex-col items-center justify-center bg-slate-900/60 shadow-[inset_0_4px_12px_rgba(0,0,0,0.4)] z-10 select-none">
          
          <div
            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-blue-600/90 to-cyan-400/90 transition-all duration-700 ease-out z-0"
            style={{ height: `${fillHeight}%` }}
          />

          {fillHeight > 0 && fillHeight < 100 && (
            <div
              className="absolute inset-x-0 w-[200%] h-8 bg-cyan-300/40 opacity-70 z-0 animate-[wave_6s_linear_infinite]"
              style={{ bottom: `calc(${fillHeight}% - 12px)` }}
            />
          )}

          <div className="z-10 flex flex-col items-center justify-center text-center p-4">
            <span className="text-xs uppercase tracking-widest text-cyan-200/70 font-semibold mb-1">Hydrated</span>
            <span className="text-4xl font-extrabold text-white leading-none mb-1">
              {percent}%
            </span>
            <span className="text-sm font-semibold text-white/90">
              {totalMl} / {goalMl} ml
            </span>
            <span className="text-[10px] text-cyan-100/60 mt-2 font-medium">
              {remainingMl > 0 ? `${remainingMl} ml remaining` : 'Daily Goal Achieved!'}
            </span>
          </div>
        </div>
        
        <p className="text-xs text-cyan-200/50 italic">Drink water regularly to keep the circle filled!</p>
      </div>

      {/* Right: Controls Card + Daily logs */}
      <div className="w-full max-w-md flex flex-col gap-4">
        <Card className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white mb-1">Log Water Intake</h2>
            <p className="text-cyan-200/50 text-xs">Add quick amounts or input custom logs</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-cyan-200/70">Quick Add</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleLogIntake(250)}
                disabled={submitLoading}
                className="bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-white rounded-xl py-3 font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-55"
              >
                +250 ml
              </button>
              <button
                onClick={() => handleLogIntake(500)}
                disabled={submitLoading}
                className="bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-white rounded-xl py-3 font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-55"
              >
                +500 ml
              </button>
              <button
                onClick={() => handleLogIntake(1000)}
                disabled={submitLoading}
                className="bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-white rounded-xl py-3 font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-55"
              >
                +1000 ml
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 my-1" />

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleLogIntake(customAmount)
            }}
            className="flex flex-col gap-3"
          >
            <label className="text-xs font-bold uppercase tracking-wider text-cyan-200/70">Custom Amount (ml)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="e.g. 350"
                disabled={submitLoading}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                required
              />
              <Button
                type="submit"
                variant="primary"
                disabled={submitLoading}
                className="cursor-pointer"
              >
                Log
              </Button>
            </div>

            {error && (
              <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg text-center animate-pulse">
                {error}
              </div>
            )}
          </form>
        </Card>

        {/* Today's Log List Card Panel */}
        {todayLogs.length > 0 && (
          <Card className="flex flex-col gap-4 border border-white/10">
            <label className="text-xs font-bold uppercase tracking-wider text-cyan-200/70">Today's Logs</label>
            
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
              {todayLogs.map((log, index) => (
                <div
                  key={log._id || index}
                  className="flex items-center justify-between bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl text-sm animate-fade-in"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    <span className="font-bold text-white">{log.amountMl} ml</span>
                    <span className="text-[10px] text-cyan-200/40 font-medium">
                      {new Date(log.loggedAt || log.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteTrigger(log)}
                    disabled={submitLoading}
                    className="text-red-400 hover:text-red-300 transition-colors p-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer disabled:opacity-50"
                    title="Delete log entry"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && logToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-sm border border-red-500/20 shadow-2xl relative flex flex-col gap-6">
            
            <div className="flex items-center gap-3">
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Delete Entry</h3>
            </div>

            <p className="text-sm text-cyan-200/70 leading-relaxed">
              Are you sure you want to delete this <strong className="text-white">{logToDelete.amountMl} ml</strong> intake log?
            </p>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setLogToDelete(null)
                }}
                disabled={submitLoading}
                className="text-xs bg-white/5 hover:bg-white/10 text-white/70 border border-white/15 px-4 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={submitLoading}
                className="text-xs bg-red-500/25 hover:bg-red-500/40 text-red-300 border border-red-500/30 px-4 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                {submitLoading ? 'Deleting...' : 'Delete Log'}
              </button>
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}
