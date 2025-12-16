import { connectAndLogin } from '../utils/wallet'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const nav = useNavigate()
  const login = async () => {
    await connectAndLogin()
    nav('/dashboard')
  }
  return (
    <div className="h-screen flex items-center justify-center">
      <button onClick={login} className="bg-blue-600 text-white px-6 py-3 rounded">
        Connect Wallet to Start
      </button>
    </div>
  )
}
