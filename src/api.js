import axios from 'axios';

const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!envApiBaseUrl && import.meta.env.PROD) {
  throw new Error('VITE_API_BASE_URL is required in production. Set it in your environment before building.');
}

export const API_BASE_URL = envApiBaseUrl || (import.meta.env.DEV ? 'http://localhost:5000' : '');

export function buildApiPath(path) {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return `${API_BASE_URL}${path}`;
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 45 seconds – prevents infinite loading/timeout when Render backend is cold-starting
});

// Add token to request headers if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // --- Timeout: Render backend cold-starting ---
    if (error.code === 'ECONNABORTED') {
      error.message = 'The server is taking longer than expected. It may be waking up — please try again in a moment.';
      return Promise.reject(error);
    }

    // --- Network error: server unreachable, CORS, DNS failure ---
    if (error.code === 'ERR_NETWORK' || !error.response) {
      error.message = 'Unable to reach the server. Please check your internet connection and try again.';
      return Promise.reject(error);
    }

    // --- 401 Unauthorized: token expired or invalid ---
    if (error.response?.status === 401 && !error.config.url.includes('/api/auth/login')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('authUser');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
  forgotPassword: (email) => api.post('/api/auth/forgot', { email }),
  resetPassword: (token, password, confirmPassword) => api.post(`/api/auth/reset/${token}`, { password, confirmPassword }),
  resendVerification: (email) => api.post('/api/auth/resend-verification', { email }),
  googleLogin: (token) => api.post('/api/auth/google', { token }),
  facebookLogin: (token) => api.post('/api/auth/facebook', { token }),
};

// Commission API calls
export const commissionAPI = {
  submitCommission: (data) => api.post('/commissions', data),
  getCommission: (id) => api.get(`/commission/${id}`),
};

// User API calls
export const userAPI = {
  getCart: () => api.get('/api/user/cart'),
  saveCart: (cart) => api.post('/api/user/cart', { cart }),
  getWishlist: () => api.get('/api/user/wishlist'),
  toggleWishlist: (payload) => api.post('/api/user/wishlist/toggle', payload),
  getOrders: () => api.get('/api/user/orders'),
  getCommissions: () => api.get('/api/user/commissions'),
  getAddresses: () => api.get('/api/user/addresses'),
  addAddress: (address) => api.post('/api/user/addresses', address),
  removeAddress: (addressId) => api.delete(`/api/user/addresses/${addressId}`),
};

// Product API calls
export const productAPI = {
  getProducts: () => api.get('/api/products'),
  getProductById: (productId) => api.get(`/api/products/${productId}`),
  createProduct: (data) => api.post('/api/products', data),
  updateProduct: (productId, data) => api.put(`/api/products/${productId}`, data),
  deleteProduct: (productId) => api.delete(`/api/products/${productId}`),
};

// Payment API calls
export const paymentAPI = {
  createCommissionOrder: (data) => api.post('/create-order', data),
  verifyCommissionPayment: (data) => api.post('/verify-payment', data),
  markPaymentFailed: (data) => api.post('/payment-failed', data),
  createCartOrder: (data) => api.post('/create-cart-order', data),
  verifyCartPayment: (data) => api.post('/verify-cart-payment', data),
  createUpiOrder: (data) => api.post('/create-upi-order', data),
};

// Admin API calls
export const adminAPI = {
  getUsers: () => api.get('/api/admin/users'),
  getOrders: () => api.get('/api/admin/orders'),
  updateOrderStatus: (orderId, status) => api.put(`/api/admin/orders/${orderId}/status`, { status }),
  verifyPayment: (orderId) => api.put(`/api/admin/orders/${orderId}/verify-payment`),
  rejectPayment: (orderId) => api.put(`/api/admin/orders/${orderId}/reject-payment`),
  getCommissions: () => api.get('/api/admin/commissions'),
  getProducts: () => api.get('/api/admin/products'),
  updateProduct: (productId, data) => api.put(`/api/admin/products/${productId}`, data),
};

export default api;

