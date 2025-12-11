import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true;

      try {      
        const response = await axios.post(
          `${API_URL}/auth/refresh`, 
          {}, 
          { withCredentials: true }
        );

        const newMessage = response.data;
        localStorage.setItem('access_token', newMessage.access_token);

        originalRequest.headers.Authorization = `Bearer ${newMessage.access_token}`;
        
        return $api.request(originalRequest);

      } catch (e) {
        console.error('unsuccessful token refresh, logout', e);
        localStorage.removeItem('access_token');
        throw e;
      }
    }
    throw error;
  }
);