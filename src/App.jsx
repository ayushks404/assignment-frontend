import { useEffect } from 'react'
import api from './api/client'

function App() {
  useEffect(() => {
    console.log('Fetching backend health status...')
    api.get('/health')
      .then((res) => {
        console.log('Health response received:', res.status, res.data)
      })
      .catch((err) => {
        console.error('Health request failed (expected if backend offline):', err.message)
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 text-center max-w-md">
        <h1 className="text-3xl font-bold text-blue-400 mb-2">Water Tracker</h1>
        <p className="text-slate-300 mb-6">
          API client (Axios) integrated. Check the browser console for `/health` response.
        </p>
        <div className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
          Step 1 Verification
        </div>
      </div>
    </div>
  )
}

export default App
