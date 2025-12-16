import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Hi, {user.username}
          </h1>
          <p className="text-sm text-slate-500">
            Manage your wallets, KYC and transactions from one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/deposit"
            className="inline-flex items-center rounded-xl bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
          >
            Deposit
          </Link>
          <Link
            to="/withdraw"
            className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
          >
            Withdraw
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-800">
              Wallets & Balances
            </h2>
            <span className="text-[11px] uppercase tracking-wide text-slate-400">
              Multi-currency
            </span>
          </div>

          {user.wallets && user.wallets.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {user.wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-slate-500">
                        {wallet.currency} Wallet
                      </div>
                      <div className="mt-1 text-xl font-semibold text-slate-900">
                        {wallet.balance}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Updated:{' '}
                      {new Date(wallet.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No wallets yet. Your USD wallet will be created on registration.
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              KYC Status
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {user.is_kyc_verified
                ? 'Your KYC is approved. You can withdraw without limits.'
                : 'Complete your KYC to enable withdrawals and higher limits.'}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                user.is_kyc_verified
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {user.is_kyc_verified ? 'APPROVED' : 'NOT VERIFIED'}
            </span>
            <Link
              to="/kyc"
              className="text-xs font-medium text-primary-700 hover:text-primary-800"
            >
              Manage KYC
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 md:col-span-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Quick actions
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <Link
              to="/deposit"
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:border-primary-300 hover:bg-primary-50"
            >
              Make a deposit
            </Link>
            <Link
              to="/withdraw"
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:border-primary-300 hover:bg-primary-50"
            >
              Request withdrawal
            </Link>
            <Link
              to="/transactions"
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:border-primary-300 hover:bg-primary-50"
            >
              View transactions
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-xs text-slate-500 space-y-1">
          <h2 className="text-sm font-semibold text-slate-800 mb-1">
            Account details
          </h2>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone_number}</p>
          <p>Country: {user.country}</p>
          <p>
            Joined:{' '}
            {new Date(user.date_joined).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
