import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import Button from '../components/Button'

export default function AdminUsers() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Custom modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

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

  useEffect(() => {
    fetchUsers()
  }, [])

  // Trigger custom confirmation modal
  const handleDeleteTrigger = (userId, userName) => {
    setUserToDelete({ id: userId, name: userName })
    setShowConfirmModal(true)
  }

  // Handle actual delete after user confirmation in modal
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    try {
      setDeleteLoading(true)
      setError('')
      await api.delete(`/admin/users/${userToDelete.id}`)
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userToDelete.id))
      setShowConfirmModal(false)
      setUserToDelete(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user account.')
      setShowConfirmModal(false)
      setUserToDelete(null)
    } finally {
      setDeleteLoading(false)
    }
  }

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
              className="flex flex-col justify-between border border-white/10 hover:border-cyan-500/20 transition-all duration-300 gap-4 animate-fade-in"
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
                  className="flex-1 text-xs py-2 cursor-pointer"
                  disabled={deleteLoading}
                >
                  View Intake History
                </Button>

                {/* Self delete protection check */}
                {u._id !== user?.id ? (
                  <button
                    onClick={() => handleDeleteTrigger(u._id, u.name)}
                    disabled={deleteLoading}
                    className="text-xs bg-red-500/25 hover:bg-red-500/40 text-red-300 border border-red-500/30 px-4 py-2 rounded-lg transition-colors font-semibold cursor-pointer disabled:opacity-50"
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    disabled
                    className="text-xs bg-white/5 text-white/30 border border-white/10 px-4 py-2 rounded-lg font-semibold cursor-not-allowed select-none"
                    title="You cannot delete your own admin account"
                  >
                    Self
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Custom Confirmation Modal Dialog */}
      {showConfirmModal && userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-sm border border-red-500/20 shadow-2xl relative flex flex-col gap-6">
            
            {/* Warning Icon Graphic */}
            <div className="flex items-center gap-3">
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Delete Account</h3>
            </div>

            <p className="text-sm text-cyan-200/70 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">{userToDelete.name}</strong>'s account? All water intake logs associated with this user will be permanently removed.
            </p>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => {
                  setShowConfirmModal(false)
                  setUserToDelete(null)
                }}
                disabled={deleteLoading}
                className="text-xs bg-white/5 hover:bg-white/10 text-white/70 border border-white/15 px-4 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="text-xs bg-red-500/25 hover:bg-red-500/40 text-red-300 border border-red-500/30 px-4 py-2.5 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}
