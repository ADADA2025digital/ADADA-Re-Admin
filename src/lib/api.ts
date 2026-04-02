import axios from 'axios';

const api = axios.create({
  baseURL: 'https://urbanviewre.com/adada-re-backend/api', // Pointing to local Laravel API
  headers: {
    'Accept': 'application/json',
    // NOTE: Do NOT set Content-Type here globally.
    // For FormData (multipart/form-data) requests, Axios must auto-set it
    // with the correct multipart boundary. A hardcoded JSON Content-Type
    // breaks file uploads.
  },
});

// Add a request interceptor to inject the token and fix Content-Type for FormData
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If the request body is FormData, delete any Content-Type header so
    // Axios (and the browser) can set "multipart/form-data; boundary=..." automatically.
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.debug('[API] FormData detected – Content-Type header removed so browser sets multipart boundary automatically.');
    } else {
      // For regular JSON requests, ensure proper Content-Type
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
