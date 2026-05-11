import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/", // Ganti URL nya nanti
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

const formDataApi = axios.create({
  baseURL: "http://localhost:8000/", // Ganti URL nya nanti
  headers: {
    "Content-Type": "multipart/form-data",
    "Accept": "application/json",
  },
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => { 
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

formDataApi.interceptors.request.use(
  (config) => { 
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api
export { formDataApi };
