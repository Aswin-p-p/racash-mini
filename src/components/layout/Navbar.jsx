import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logout } from '../../api'

const Navbar = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')

    
  }

  const linkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium ${
      isActive
        ? 'bg-primary-100 text-primary-800'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-primary-500 flex items-center justify-center text-white font-bold shadow-sm">
              R
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-slate-900">R-Cash</span>
              <span className="text-[11px] uppercase tracking-wide text-slate-400">
                MiniApp
              </span>
            </div>
          </Link>

          {user && (
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2">
                <NavLink to="/" className={linkClasses} end>
                  Dashboard
                </NavLink>
                <NavLink to="/kyc" className={linkClasses}>
                  KYC
                </NavLink>
                <NavLink to="/deposit" className={linkClasses}>
                  Deposit
                </NavLink>
                <NavLink to="/withdraw" className={linkClasses}>
                  Withdraw
                </NavLink>
                <NavLink to="/transactions" className={linkClasses}>
                  Transactions
                </NavLink>
                {(user.is_staff || user.is_superuser) && (
                  <NavLink to="/admin/kyc" className={linkClasses}>
                    Admin
                  </NavLink>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-slate-900">
                    {user.username}
                  </div>
                  <div className="text-xs text-slate-500">
                    {user.is_kyc_verified ? 'KYC Verified' : 'KYC Pending'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {!user && (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
