import React, { useEffect, useState } from 'react'
import api from '../api'

const Withdraw = () => {
  const [partners, setPartners] = useState([])
  const [loadingPartners, setLoadingPartners] = useState(true)
  const [form, setForm] = useState({
    amount: '',
    currency: 'KES',
    partner_id: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [whatsappLink, setWhatsappLink] = useState('')

  const loadPartners = async () => {
    setLoadingPartners(true)
    try {
      const res = await api.get('/payout-partners/')
      setPartners(res.data || [])
    } catch (e) {
      // ignore
    } finally {
      setLoadingPartners(false)
    }
  }

  useEffect(() => {
    loadPartners()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setWhatsappLink('')
    try {
      const res = await api.post('/withdraw/initiate/', form)
      setMessage(res.data.message || 'Withdrawal initiated.')
      if (res.data.whatsapp_link) {
        setWhatsappLink(res.data.whatsapp_link)
      }
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data
        if (data.detail) {
          setMessage(data.detail)
        } else {
          const firstKey = Object.keys(data)[0]
          setMessage(`${firstKey}: ${data[firstKey]}`)
        }
      } else {
        setMessage('Failed to initiate withdrawal.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Withdraw funds
        </h1>
        <p className="text-sm text-slate-500">
          Request a payout to your preferred mobile money or bank partner.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4"
      >
        {message && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-700">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Currency
            </label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50"
            >
              <option value="KES">KES</option>
              <option value="USD">USD</option>
              <option value="ETB">ETB</option>
              <option value="SOS">SOS</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">
            Payout partner
          </label>
          <select
            name="partner_id"
            value={form.partner_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50"
          >
            <option value="">
              {loadingPartners
                ? 'Loading payout partners...'
                : 'Select payout partner'}
            </option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.country})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? 'Processing...' : 'Initiate withdrawal'}
        </button>

        {whatsappLink && (
          <p className="text-[11px] text-slate-500">
            To verify your withdrawal, open WhatsApp:{' '}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="text-primary-700 underline"
            >
              Verify via WhatsApp
            </a>
          </p>
        )}
      </form>
    </div>
  )
}

export default Withdraw
