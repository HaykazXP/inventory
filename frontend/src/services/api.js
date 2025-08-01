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

// Selling Point endpoints
export const getSellingPoints = () => apiClient.get('/selling-points');

// Inventory endpoints
export const addProductToSellingPoint = (data) => apiClient.post('/inventory/replenish', data);
export const getStockReplenishments = () => apiClient.get('/inventory/history');
export const getInventoryLogs = () => apiClient.get('/inventory/logs');

// Sales endpoints
export const addSalesRecord = (data) => apiClient.post('/sales', data);
export const getSalesRecords = () => apiClient.get('/sales');
export const getDailySales = (date) => apiClient.get(`/sales/daily/${date}`);
export const getWeeklySales = (startDate, endDate) => apiClient.get(`/sales/weekly/${startDate}/${endDate}`);

export default apiClient;
