import { useState } from 'react'
import { depositCUSD } from '../utils/wallet'
import { useNavigate } from 'react-router-dom'

export default function Deposit() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const handleDeposit = async () => {
    if (!amount) return alert('Enter amount')

    try {
      setLoading(true)
      await depositCUSD(amount)
      alert('Deposit successful')
      nav('/dashboard')
    } catch (err) {
      alert('Deposit failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Deposit</h1>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handleDeposit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Processing...' : 'Deposit'}
      </button>
    </div>
  )
}
