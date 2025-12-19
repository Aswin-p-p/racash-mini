import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Skip ngrok warning page
  },
});

// Request interceptor - attach token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/users/register/', data),
  login: (data) => api.post('/users/login/', data),
  logout: (refreshToken) => api.post('/users/logout/', { refresh_token: refreshToken }),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.patch('/users/profile/', data),
  changePassword: (data) => api.post('/users/change-password/', data),
  walletAuth: (walletAddress) => api.post('/users/wallet-auth/', { wallet_address: walletAddress }),
};

// KYC API
export const kycAPI = {
  submit: (formData) => api.post('/kyc/submit/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getStatus: () => api.get('/kyc/status/'),
  adminList: (params) => api.get('/kyc/admin/list/', { params }),
  adminUpdate: (id, data) => api.patch(`/kyc/admin/update/${id}/`, data),
};

// Transaction API
export const transactionAPI = {
  getPayoutPartners: () => api.get('/payout-partners/'),
  getDepositMethods: () => api.get('/deposit-methods/'),
  initiateDeposit: (data) => api.post('/deposit/initiate/', data),
  initiateWithdrawal: (data) => api.post('/withdraw/initiate/', data),
  getTransactions: (params) => api.get('/transactions/', { params }),
  getTransactionDetail: (id) => api.get(`/transactions/${id}/`),
};

export default api;
