import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Product endpoints
export const getProducts = () => apiClient.get('/products');
export const createProduct = (product) => apiClient.post('/products', product);
export const updateProduct = (id, product) => apiClient.put(`/products/${id}`, product);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);

// Selling Point endpoints
export const getSellingPoints = () => apiClient.get('/selling-points');
export const createSellingPoint = (sellingPoint) => apiClient.post('/selling-points', sellingPoint);
export const updateSellingPoint = (id, sellingPoint) => apiClient.put(`/selling-points/${id}`, sellingPoint);
export const deleteSellingPoint = (id) => apiClient.delete(`/selling-points/${id}`);

// Inventory endpoints
export const getInventory = () => apiClient.get('/inventory');
export const addProductToSellingPoint = (data) => apiClient.post('/inventory/replenish', data);
export const updateInventoryCount = (id, count) => apiClient.put(`/inventory/${id}`, { count });
export const removeProductFromSellingPoint = (id) => apiClient.delete(`/inventory/${id}`);

export default apiClient;
