// utils/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://myleetcode.onrender.com',
  withCredentials: true          // sends/receives cookies
});

export default axiosClient;
