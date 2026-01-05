import axios from 'axios';

const API_BASE = 'VITE_BACKEND_URL';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


/* AUTH */
export const login = (data) => api.post('/auth/jwt-login', data);
export const register = (data) => api.post('/auth/register', data);

/* PRODUCTS */
export const getProducts = (q, categoryId) =>
  api.get('/products', { params: { q, categoryId } });

export const getProductById = (id) => api.get(`/products/${id}`);
export const getCategories = () => api.get('/categories');
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

/* CART */
export const getCart = (userId) => api.get(`/cart/${userId}`);
export const addToCart = (userId, productId) =>
  api.post(`/cart/add/${userId}/${productId}`);
export const increaseQuantity = (userId, cartItemId) =>
  api.put(`/cart/increase/${userId}/${cartItemId}`);
export const decreaseQuantity = (userId, cartItemId) =>
  api.put(`/cart/decrease/${userId}/${cartItemId}`);
export const removeItem = (userId, cartItemId) =>
  api.delete(`/cart/remove/${userId}/${cartItemId}`);

/* ORDERS */
export const placeOrder = (data) => api.post(`/orders/place`, data);
export const getUserOrders = (userId) => api.get(`/orders/user/${userId}`);
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);
export const getAllOrders = () => api.get('/orders/admin');
export const updateOrderStatus = (orderId, status) =>
  api.put(`/orders/${orderId}/status`, null, { params: { status } });

/* ORDER HISTORY */
export const getOrderStatusHistory = (orderId) =>
  api.get(`/orders/${orderId}/history`);

/*Payment*/
export const createStripePayment = (orderId) =>
  api.post(`/payments/create/${orderId}`);

/*Address*/
export const getAddresses = (userId) =>
  api.get(`/addresses/${userId}`);

export const addAddress = (userId, data) =>
  api.post(`/addresses/${userId}`, data);

export const deleteAddress = (addressId) =>
  api.delete(`/addresses/${addressId}`);

