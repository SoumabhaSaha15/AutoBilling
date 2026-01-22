import axios from "axios";
import Cookies from "js-cookie";

const customFormSerializer = (data: object): FormData => {
  const formData = new FormData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appendRecursive = (key: string, value: any) => {
    if (value instanceof FileList) [...value].forEach((file) => formData.append(key, file));  // 1. Handle FileList (Preserved from your fix)

    else if (value instanceof File || value instanceof Blob) formData.append(key, value); // 2. Handle Files/Blobs (Base case)

    else if (Array.isArray(value)) value.forEach((item, index) => appendRecursive(`${key}[${index}]`, item)); // 3. Handle Arrays (RECURSIVE)

    else if (value !== null && typeof value === 'object' && !(value instanceof Date)) Object.entries(value).forEach(([subKey, subValue]) => appendRecursive(`${key}[${subKey}]`, subValue)); // 4. Handle Objects (RECURSIVE) - Instead of JSON.stringify

    else if (value !== undefined && value !== null) formData.append(key, value);  // 5. Handle Primitives
  };
  Object.entries(data).forEach(([key, value]) => appendRecursive(key, value));
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
  if (contentType === 'multipart/form-data')
    if (config.data && !(config.data instanceof FormData)) config.data = customFormSerializer(config.data);
  // If we have data that isn't already FormData (like a plain object with FileList)
  return config;
}, error => Promise.reject(error));

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
