import { useEffect, useState } from 'react'
import api from '../api/axios'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/users/profile/')
        setProfile(res.data)
      } catch (err) {
        console.error('Profile load error:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  // 🔹 NEVER return null → causes white screen
  if (loading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>
  }

  if (!profile) {
    return <div className="p-6">No profile data</div>
  }

  const wallet = profile.wallets?.[0]

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <p>User: {profile.username}</p>

      <p>
        Balance:{' '}
        {wallet ? `${wallet.balance} USD` : 'Wallet initializing...'}
      </p>

      <Link to="/deposit" className="text-blue-600 underline">
        Deposit
      </Link>
    </div>
  )
}
