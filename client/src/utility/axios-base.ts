import axios from "axios";
export default axios.create({
  baseURL: import.meta.env.VITE_CORS_URL,
  withCredentials: true,
  validateStatus: (_) => true
});
