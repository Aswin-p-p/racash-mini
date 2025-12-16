import React, { useEffect, useState } from 'react'
import api from '../api'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    currency: ''
  })

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.type) params.type = filters.type
      if (filters.status) params.status = filters.status
      if (filters.currency) params.currency = filters.currency
      const res = await api.get('/transactions/', { params })
      setTransactions(res.data || [])
    } catch (e) {
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const applyFilters = (e) => {
    e.preventDefault()
    loadTransactions()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Transaction history
          </h1>
          <p className="text-sm text-slate-500">
            View all your deposits and withdrawals. Use filters to narrow down.
          </p>
        </div>
      </div>

      <form
        onSubmit={applyFilters}
        className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap gap-3 items-end"
      >
        <div>
          <label className="block text-xs font-medium text-slate-700">
            Type
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50"
          >
            <option value="">All</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAWAL">Withdrawal</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50"
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700">
            Currency
          </label>
          <select
            name="currency"
            value={filters.currency}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50"
          >
            <option value="">All</option>
            <option value="USD">USD</option>
            <option value="KES">KES</option>
            <option value="ETB">ETB</option>
            <option value="SOS">SOS</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
        >
          Apply filters
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="min-w-full overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Type</th>
                <th className="px-3 py-2 text-left font-medium">Amount</th>
                <th className="px-3 py-2 text-left font-medium">Currency</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Method</th>
                <th className="px-3 py-2 text-left font-medium">Created</th>
                <th className="px-3 py-2 text-left font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-4 text-center text-slate-500"
                  >
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-4 text-center text-slate-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          tx.transaction_type === 'DEPOSIT'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td className="px-3 py-2">{tx.amount}</td>
                    <td className="px-3 py-2">{tx.currency}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          tx.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : tx.status === 'FAILED'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">{tx.payment_method}</td>
                    <td className="px-3 py-2">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      {new Date(tx.updated_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Transactions
