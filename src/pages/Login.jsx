import { connectAndLogin } from '../utils/wallet'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Login() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)

  const login = async () => {
    try {
      setLoading(true)

      // 1️⃣ Wallet auth + profile fetch MUST finish
      await connectAndLogin()

      // 2️⃣ Navigate only AFTER everything is ready
      nav('/dashboard')

    } catch (err) {
      console.error('Login failed:', err)
      alert('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={login}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded disabled:opacity-50"
      >
        {loading ? 'Connecting...' : 'Connect Wallet to Start'}
      </button>
    </div>
  )
}
