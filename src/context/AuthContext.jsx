import React, { createContext, useContext, useEffect, useState } from 'react'
import api, { setTokens, logout as apiLogout } from '../api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile/')
      setUser(res.data)
    } catch (e) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const res = await api.post('/users/login/', { username, password })
    setTokens(res.data)
    await fetchProfile()
  }

  const register = async (payload) => {
    const res = await api.post('/users/register/', payload)
    if (res.data?.tokens) {
      setTokens(res.data.tokens)
      await fetchProfile()
    }
  }

  const logout = async () => {
    await apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
