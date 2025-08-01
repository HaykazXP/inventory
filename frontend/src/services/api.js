import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Try to refresh the token
          const refreshResponse = await axios.post('/api/auth/refresh', {
            refreshToken: refreshToken
          });
          
          const { token, refreshToken: newRefreshToken } = refreshResponse.data;
          
          // Update stored tokens
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Update the authorization header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
          
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (credentials) => axios.post('/api/auth/login', credentials);
export const refreshToken = (refreshToken) => axios.post('/api/auth/refresh', { refreshToken });

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
