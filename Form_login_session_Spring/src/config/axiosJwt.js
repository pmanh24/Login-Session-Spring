import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/auth", // sửa theo backend mày
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn JWT vào header mỗi request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Bắt lỗi 401 (token hết hạn / sai)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
