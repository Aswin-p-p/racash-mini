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
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>
  }

  const wallet =
    profile.wallets && profile.wallets.length > 0
      ? profile.wallets[0]
      : null

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <p>User: {profile.username}</p>

      <p className="mt-2">
        Balance:{' '}
        {wallet
          ? `${wallet.balance} USD`
          : 'Wallet will be created on first deposit'}
      </p>

      <Link
        to="/deposit"
        className="inline-block mt-4 text-blue-600 underline"
      >
        Deposit
      </Link>
    </div>
  )
}
