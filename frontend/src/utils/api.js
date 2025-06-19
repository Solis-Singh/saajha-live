import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/updateprofile', userData),
};

// Products API calls
export const productsAPI = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getUserProducts: () => api.get('/products/user/listings'),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Rentals API calls
export const rentalsAPI = {
  createRental: (rentalData) => api.post('/rentals', rentalData),
  getUserRentals: () => api.get('/rentals/my-rentals'),
  getUserListingsRentals: () => api.get('/rentals/my-listings-rentals'),
  getRentalById: (id) => api.get(`/rentals/${id}`),
  updateRentalStatus: (id, status) => api.put(`/rentals/${id}/status`, { status }),
  getRentalsByProductId: (productId) => api.get(`/rentals/product/${productId}`),
  cancelRental: (id) => api.put(`/rentals/${id}/cancel`),
};

// Payments API calls
export const paymentsAPI = {
  createPaymentIntent: (paymentData) => api.post('/payments/create-payment-intent', paymentData),
  updatePaymentStatus: (rentalId, paymentData) => api.post(`/payments/${rentalId}/update-status`, paymentData),
  getPaymentByRentalId: (rentalId) => api.get(`/payments/rental/${rentalId}`),
  refundPayment: (rentalId) => api.post(`/payments/${rentalId}/refund`),
};

// Uploads API calls
export const uploadsAPI = {
  uploadImage: (formData) => {
    return api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteImage: (publicId) => api.delete(`/uploads/${publicId}`),
};

export default api;
