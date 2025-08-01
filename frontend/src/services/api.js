import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
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
          // Try to refresh the token (use axios directly to avoid interceptor loops)
          const refreshResponse = await axios.post('http://localhost:3001/api/auth/refresh', {
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
export const login = (credentials) => axios.post('http://localhost:3001/api/auth/login', credentials);
export const refreshTokenRequest = (refreshToken) => axios.post('http://localhost:3001/api/auth/refresh', { refreshToken });

// Logout function
export const logout = () => {
  // Clear all authentication tokens
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiry');
  
  // Clear any weekly inventory drafts as well
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('weekly-inventory-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Redirect to login page
  window.location.href = '/login';
};

// Product endpoints
export const getProducts = () => apiClient.get('/products');
export const createProduct = (data) => apiClient.post('/products', data);
export const updateProduct = (id, data) => apiClient.put(`/products/${id}`, data);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);

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

// Weekly Inventory endpoints
export const getWeeklyInventoryData = (sellingPointId) => apiClient.get(`/weekly-inventory/data/${sellingPointId}`);
export const submitWeeklyInventoryCheck = (data) => apiClient.post('/weekly-inventory/check', data);
export const getWeeklyInventoryChecks = () => apiClient.get('/weekly-inventory/checks');

// Non-Cash endpoints
export const getNonCashSummary = () => apiClient.get('/non-cash/summary');
export const getNonCashRecords = () => apiClient.get('/non-cash/records');
export const createNonCashWithdrawal = (data) => apiClient.post('/non-cash/withdraw', data);
export const getNonCashWithdrawals = () => apiClient.get('/non-cash/withdrawals');

// Cash endpoints
export const getCashSummary = () => apiClient.get('/cash/summary');
export const getCashRecords = () => apiClient.get('/cash/records');
export const createCashWithdrawal = (sellingPointId, data) => apiClient.post(`/cash/withdraw/${sellingPointId}`, data);
export const getCashWithdrawals = () => apiClient.get('/cash/withdrawals');
export const getSellingPointCashData = (sellingPointId) => apiClient.get(`/cash/selling-point/${sellingPointId}`);

export default apiClient;
