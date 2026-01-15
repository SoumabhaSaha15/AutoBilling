import axios from "axios";
import Cookies from "js-cookie";

const customFormSerializer = (data: any): FormData => {
  const formData = new FormData();
  // console.log(data)
  const appendToFormData = (key: string, value: any) => {
    if (value instanceof FileList)
      [...value].forEach((file) => formData.append(key, file));  // 1. Handle FileList (The main fix)
    else if (Array.isArray(value))
      value.forEach((item) => formData.append(key, item));  // 2. Handle Arrays (e.g., existing File[] or strings)
    else if (value instanceof File || value instanceof Blob)
      formData.append(key, value); // 3. Handle single File/Blob
    else if (value !== null && typeof value === 'object') {
      // 4. Handle nested objects (optional, depends on backend)
      // Stringifying is usually safer for Multer/Express
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null)
      formData.append(key, value.toString()); // 5. Handle primitives (string, number, boolean)
  };

  Object.entries(data).forEach(([key, value]) => appendToFormData(key, value));
  // console.log(Object.fromEntries(formData));
  return formData;
};

const base = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// --- Interceptor 1: CSRF Token ---
base.interceptors.request.use(async config => {
  if (config.method !== 'get' && config.method !== 'head' && config.method !== 'options') {
    try {
      const csrfToken = Cookies.get('csrftoken');
      if (!csrfToken) console.warn('CSRF token missing for state change.');
      else config.headers['X-CSRF-Token'] = csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  }
  return config;
}, error => Promise.reject(error));

base.interceptors.request.use((config) => {
  const contentType = config.headers?.['Content-Type'];
  if (contentType === 'multipart/form-data') // If we have data that isn't already FormData (like a plain object with FileList)
    if (config.data && !(config.data instanceof FormData)) config.data = customFormSerializer(config.data);
  return config;
});

// --- Interceptor 3: Response Handling ---
base.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401 || status === 403) console.warn('Session expired. Redirecting to login.');
    return Promise.reject(error);
  }
);
export default base;
