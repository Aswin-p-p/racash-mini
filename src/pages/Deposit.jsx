import { useState } from 'react'
import { depositCUSD } from '../utils/wallet'
import api from '../api/axios'

export default function Deposit() {
  const [amount, setAmount] = useState('')
  const submit = async () => {
    const hash = await depositCUSD(amount)
    await api.post('/deposit/webhook/', { ref: hash, status: 'SUCCESS' })
    alert('Deposit Successful')
  }
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Deposit</h1>
      <input value={amount} onChange={e=>setAmount(e.target.value)}
        className="border p-2 w-full mb-4" placeholder="Amount USD"/>
      <button onClick={submit} className="bg-green-600 text-white px-4 py-2 rounded">
        Deposit with MiniPay
      </button>
    </div>
  )
}
