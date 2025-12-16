import React, { useEffect, useState } from 'react'
import api from '../api'

const AdminKYC = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('PENDING')
  const [updatingId, setUpdatingId] = useState(null)
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filterStatus) params.status = filterStatus
      const res = await api.get('/kyc/admin/list/', { params })
      setItems(res.data || [])
    } catch (e) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [filterStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (id, status) => {
    setUpdatingId(id)
    setMessage('')
    try {
      const res = await api.patch(`/kyc/admin/update/${id}/`, { status })
      setMessage(res.data.message || 'Status updated.')
      await load()
    } catch (e) {
      setMessage('Failed to update status.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Admin: KYC submissions
          </h1>
          <p className="text-sm text-slate-500">
            Review and approve or reject user KYC submissions.
          </p>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700">
            Filter by status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mt-1 rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50"
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {message && (
        <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-700">
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="min-w-full overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left font-medium">User</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Submitted</th>
                <th className="px-3 py-2 text-left font-medium">Documents</th>
                <th className="px-3 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-slate-500"
                  >
                    Loading KYC submissions...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-slate-500"
                  >
                    No KYC submissions found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-800 text-xs">
                        {item.username || item.user}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ID: {item.user_id}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {item.submitted_at
                        ? new Date(item.submitted_at).toLocaleString()
                        : '-'}
                    </td>
                    <td className="px-3 py-2 space-y-1">
                      {item.id_document && (
                        <a
                          href={item.id_document}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-[11px] text-primary-700 underline"
                        >
                          View ID
                        </a>
                      )}
                      {item.selfie && (
                        <a
                          href={item.selfie}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-[11px] text-primary-700 underline"
                        >
                          View selfie
                        </a>
                      )}
                    </td>
                    <td className="px-3 py-2 space-x-1">
                      <button
                        onClick={() => updateStatus(item.id, 'APPROVED')}
                        disabled={updatingId === item.id}
                        className="rounded-xl bg-emerald-500 px-3 py-1 text-[10px] font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, 'REJECTED')}
                        disabled={updatingId === item.id}
                        className="rounded-xl bg-red-500 px-3 py-1 text-[10px] font-medium text-white hover:bg-red-600 disabled:opacity-60"
                      >
                        Reject
                      </button>
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

export default AdminKYC
