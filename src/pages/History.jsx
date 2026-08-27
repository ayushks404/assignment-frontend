import { useState, useEffect } from 'react'
import api from '../api/client'
import Card from '../components/Card'

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/intake/history')
        if (Array.isArray(res.data)) {
          setHistory(res.data)
        }
      } catch (err) {
        console.error('Failed to load history:', err.message)
        setError('Could not retrieve your hydration history.')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  // Format YYYY-MM-DD safely into human-friendly dates
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
        Loading history logs...
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white mb-1">Hydration History</h2>
        <p className="text-cyan-200/50 text-xs">Track your water consumption trends over time</p>
      </div>

      {error && (
        <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center">
          {error}
        </div>
      )}

      {!error && history.length === 0 ? (
        <Card className="text-center p-8 border border-white/10 animate-fade-in">
          <p className="text-sm text-cyan-200/60 font-medium">No logs recorded yet.</p>
          <p className="text-xs text-cyan-200/40 mt-1">Start tracking on the dashboard to build your log history!</p>
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
                  <span className="font-bold text-white text-base">
                    {formatHistoryDate(day.date)}
                  </span>
                  <div className="flex items-baseline gap-2 text-right">
                    <span className="text-sm font-bold text-white">{day.totalMl} ml</span>
                    <span className="text-xs text-cyan-200/50">/ {day.goalMl} ml</span>
                  </div>
                </div>

                {/* Progress bar container */}
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
  )
}
