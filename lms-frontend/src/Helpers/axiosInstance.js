import axios from "axios";

BASE_URL = process.env.BASE_URL

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true

export default axiosInstance;