import axios from "axios";
const base = axios.create({
  baseURL: '/api',
  withCredentials: true,
  validateStatus: (_) => true
});

base.interceptors.request.use(async config => {
  if (config.method !== 'get' && config.method !== 'head' && config.method !== 'options') {
    try {
      const response = await base.get('get-csrf-token');
      if (response.status === 200) {
        const csrfToken = response.data;
        if (!csrfToken) console.warn('CSRF token missing for state change.');
        else config.headers['X-CSRF-Token'] = csrfToken;
      } else console.error('Failed to fetch CSRF token:', response.status);
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  }
  return config;
}, error => Promise.reject(error));

base.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401 || status === 403) console.warn('Session expired. Redirecting to login.');
    return Promise.reject(error);
  }
);
export default base;
