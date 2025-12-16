import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    country: 'KENYA'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data
        const firstKey = Object.keys(data)[0]
        setError(`${firstKey}: ${data[firstKey]}`)
      } else {
        setError('Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Create your R-Cash account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Register to start using the R-Cash MiniApp.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4"
        >
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Phone number
              </label>
              <input
                type="text"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                required
                placeholder="+254712345678"
                className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Country
              </label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50"
              >
                <option value="KENYA">Kenya</option>
                <option value="ETHIOPIA">Ethiopia</option>
                <option value="SOMALIA">Somalia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-700 hover:text-primary-800"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
