import { useParams } from 'react-router-dom'

export default function AdminUserHistory() {
  const { id } = useParams()

  return (
    <div className="p-8 text-center text-white bg-white/5 border border-white/10 rounded-2xl max-w-md w-full shadow-lg backdrop-blur-md">
      <h2 className="text-2xl font-bold mb-2">Admin: User History</h2>
      <p className="text-cyan-200/60 text-sm mb-4">Placeholder for viewing a specific user's logs</p>
      <div className="inline-block bg-cyan-500/20 text-cyan-300 px-4 py-1.5 rounded-lg border border-cyan-500/30 font-mono text-xs">
        Viewing User ID: {id}
      </div>
    </div>
  )
}
