import { connectAndLogin } from '../utils/wallet'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Login() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)

  const login = async () => {
    try {
      setLoading(true)
      await connectAndLogin()

      // 🔥 LOGIN SUCCESS → GO DASHBOARD
      nav('/dashboard')
    } catch (err) {
      console.error(err)
      alert('Wallet connection failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={login}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        {loading ? 'Connecting...' : 'Connect Wallet to Start'}
      </button>
    </div>
  )
}
