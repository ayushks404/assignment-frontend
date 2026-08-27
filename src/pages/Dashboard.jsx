import { useState, useEffect } from 'react'
import api from '../api/client'
import Card from '../components/Card'
import Button from '../components/Button'

export default function Dashboard() {
  const [totalMl, setTotalMl] = useState(0)
  const [goalMl, setGoalMl] = useState(2000)
  const [percent, setPercent] = useState(0)
  const [remainingMl, setRemainingMl] = useState(2000)
  
  const [customAmount, setCustomAmount] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)

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

  useEffect(() => {
    fetchTodayData()
  }, [])

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
      await api.post('/intake', { amountMl: parsedAmount })
      setCustomAmount('')
      await fetchTodayData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log water intake.')
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

  // Bound fill height between 0% and 100%
  const fillHeight = Math.min(Math.max(percent, 0), 100)

  return (
    <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center justify-center">
      
      {/* Left: Circular Wave Progress Visualizer */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-64 h-64 rounded-full border-4 border-cyan-400/30 overflow-hidden flex flex-col items-center justify-center bg-slate-900/60 shadow-[inset_0_4px_12px_rgba(0,0,0,0.4)] z-10 select-none">
          
          {/* Wave fill background */}
          <div
            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-blue-600/90 to-cyan-400/90 transition-all duration-700 ease-out z-0"
            style={{ height: `${fillHeight}%` }}
          />

          {/* Simple rotating overlay wave if partially filled */}
          {fillHeight > 0 && fillHeight < 100 && (
            <div
              className="absolute inset-x-0 w-[200%] h-8 bg-cyan-300/40 opacity-70 z-0 animate-[wave_6s_linear_infinite]"
              style={{ bottom: `calc(${fillHeight}% - 12px)` }}
            />
          )}

          {/* Content overlay */}
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

      {/* Right: Controls Card */}
      <Card className="w-full max-w-md flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-1">Log Water Intake</h2>
          <p className="text-cyan-200/50 text-xs">Add quick amounts or input custom logs</p>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-cyan-200/70">Quick Add</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleLogIntake(250)}
              disabled={submitLoading}
              className="bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-white rounded-xl py-3 font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              +250 ml
            </button>
            <button
              onClick={() => handleLogIntake(500)}
              disabled={submitLoading}
              className="bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-white rounded-xl py-3 font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              +500 ml
            </button>
            <button
              onClick={() => handleLogIntake(1000)}
              disabled={submitLoading}
              className="bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-white rounded-xl py-3 font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              +1000 ml
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-1" />

        {/* Custom Add form */}
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

    </div>
  )
}
