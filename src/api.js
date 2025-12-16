import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: false
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        logout()
        return Promise.reject(error)
      }

      try {
        const res = await axios.post(`${API_BASE_URL}/api/v1/users/token/refresh/`, {
          refresh: refreshToken
        })
        const newAccess = res.data.access
        localStorage.setItem('access_token', newAccess)
        api.defaults.headers.Authorization = `Bearer ${newAccess}`
        originalRequest.headers.Authorization = `Bearer ${newAccess}`
        return api(originalRequest)
      } catch (err) {
        logout()
      }
    }

    return Promise.reject(error)
  }
)

export const setTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem('access_token', access)
  if (refresh) localStorage.setItem('refresh_token', refresh)
}

export const logout = async () => {
  const refreshToken = localStorage.getItem('refresh_token')
  const accessToken = localStorage.getItem('access_token')

  try {
    if (accessToken && refreshToken) {
      await api.post('/users/logout/', { refresh_token: refreshToken }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
    }
  } catch (e) {
    // ignore
  } finally {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    window.location.href = '/login'
  }
}

export default api
