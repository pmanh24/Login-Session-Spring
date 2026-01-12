import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/auth", 
  withCredentials: true,            
  headers: {
    "Content-Type": "application/x-www-form-urlencoded", 
  },
});

export default axiosInstance;
