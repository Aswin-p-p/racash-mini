import React, { useEffect, useState } from 'react'
import api from '../api'

const KYC = () => {
  const [status, setStatus] = useState(null)
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [files, setFiles] = useState({ id_document: null, selfie: null })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const fetchStatus = async () => {
    setLoadingStatus(true)
    try {
      const res = await api.get('/kyc/status/')
      setStatus(res.data)
    } catch (e) {
      setStatus(null)
    } finally {
      setLoadingStatus(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const handleFileChange = (e) => {
    const { name, files: selected } = e.target
    setFiles((prev) => ({ ...prev, [name]: selected[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!files.id_document || !files.selfie) {
      setMessage('Please upload both ID document and selfie.')
      return
    }
    setMessage('')
    setSubmitting(true)
    const formData = new FormData()
    formData.append('id_document', files.id_document)
    formData.append('selfie', files.selfie)

    try {
      const res = await api.post('/kyc/submit/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage(res.data.message || 'KYC submitted successfully.')
      fetchStatus()
    } catch (err) {
      setMessage('Failed to submit KYC.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStatusBadge = () => {
    const s = status?.status
    if (!s || s === 'NOT_SUBMITTED') {
      return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200">
          NOT SUBMITTED
        </span>
      )
    }
    const map = {
      PENDING:
        'inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-200',
      APPROVED:
        'inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200',
      REJECTED:
        'inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 border border-red-200'
    }
    return (
      <span className={map[s] || map.PENDING}>
        {s}
      </span>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">KYC Verification</h1>
          <p className="text-sm text-slate-500">
            Submit your ID document and a selfie to verify your identity.
          </p>
        </div>
        <div>{!loadingStatus && renderStatusBadge()}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Upload documents
          </h2>
          <p className="text-xs text-slate-500">
            Make sure your ID document is clearly visible and your selfie is
            well lit.
          </p>

          {message && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700">
                ID document
              </label>
              <input
                type="file"
                name="id_document"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="mt-1 block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Selfie
              </label>
              <input
                type="file"
                name="selfie"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-primary-500 px-4 py-2 text-xs font-medium text-white hover:bg-primary-600 disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit KYC'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 text-xs text-slate-500">
          <h2 className="text-sm font-semibold text-slate-800">
            Current status
          </h2>
          {loadingStatus ? (
            <p>Loading status...</p>
          ) : status?.status && status.status !== 'NOT_SUBMITTED' ? (
            <div className="space-y-1">
              <p>Status: {status.status}</p>
              {status.submitted_at && (
                <p>
                  Submitted:{' '}
                  {new Date(status.submitted_at).toLocaleString()}
                </p>
              )}
              {status.updated_at && (
                <p>
                  Last update:{' '}
                  {new Date(status.updated_at).toLocaleString()}
                </p>
              )}
            </div>
          ) : (
            <p>You have not submitted your KYC yet.</p>
          )}

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <p className="font-medium text-slate-700">Why KYC?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Required for withdrawals.</li>
              <li>Helps keep your account secure.</li>
              <li>Complies with financial regulations.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KYC
