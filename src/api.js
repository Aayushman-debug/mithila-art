import axios from 'axios';
import axiosRetry from 'axios-retry';

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
  timeout: 60000, // 60 seconds – covers absolute worst-case Render wake times
});

// Configure automatic retries for cold-start 502/503 and timeouts
axiosRetry(api, {
  retries: 2,
  retryDelay: (retryCount) => {
    return retryCount * 2000; // Time between retries: 2s, 4s
  },
  retryCondition: (error) => {
    // Retry on network errors, timeouts, or 5xx server errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
           error.code === 'ECONNABORTED' || 
           (error.response && error.response.status >= 500);
  },
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

// ─── Product cache (2-minute TTL) ─────────────────────────────────────────
// Prevents redundant fetches when users navigate Gallery → Profile → Gallery etc.
const _productCache = {
  data: null,
  timestamp: 0,
  TTL_MS: 2 * 60 * 1000, // 2 minutes
  isValid() {
    return this.data !== null && (Date.now() - this.timestamp) < this.TTL_MS;
  },
  set(data) {
    this.data = data;
    this.timestamp = Date.now();
  },
  clear() {
    this.data = null;
    this.timestamp = 0;
  },
};

// Product API calls
export const productAPI = {
  getProducts: async () => {
    if (_productCache.isValid()) {
      // Return cached response wrapped to match axios response shape
      return { data: _productCache.data };
    }
    const response = await api.get('/api/products');
    if (response.data?.success) {
      _productCache.set(response.data);
    }
    return response;
  },
  getProductById: (productId) => api.get(`/api/products/${productId}`),
  createProduct: (data) => {
    _productCache.clear(); // Invalidate cache on write
    return api.post('/api/products', data);
  },
  updateProduct: (productId, data) => {
    _productCache.clear(); // Invalidate cache on write
    return api.put(`/api/products/${productId}`, data);
  },
  deleteProduct: (productId) => {
    _productCache.clear(); // Invalidate cache on write
    return api.delete(`/api/products/${productId}`);
  },
};

/**
 * Fire-and-forget product prefetch — call this on app mount so the backend
 * is already awake and the cache is warm before the user navigates to Gallery/Shop.
 */
export function prefetchProducts() {
  productAPI.getProducts().catch(() => {
    // Silently ignore prefetch errors — it's a best-effort warm-up
  });
}

// Collection API calls
export const collectionAPI = {
  getCollections: () => api.get('/api/collections'),
  getCollectionById: (id) => api.get(`/api/collections/${id}`),
  createCollection: (data) => api.post('/api/collections', data),
  updateCollection: (id, data) => api.put(`/api/collections/${id}`, data),
  deleteCollection: (id) => api.delete(`/api/collections/${id}`),
};

// Upload API calls
export const uploadAPI = {
  uploadImage: (formData) => api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteImage: (publicId) => api.post('/api/upload/delete', { public_id: publicId }),
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

