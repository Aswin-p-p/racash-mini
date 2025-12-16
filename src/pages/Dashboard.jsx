import { useEffect, useState } from 'react'
import api from '../api/axios'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    api.get('/users/profile/').then(res => setProfile(res.data))
  }, [])

  if (!profile) return null

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      <p>User: {profile.username}</p>
      <p>Balance: {profile.wallets[0]?.balance} USD</p>
      <Link to="/deposit" className="text-blue-600 underline">Deposit</Link>
    </div>
  )
}
