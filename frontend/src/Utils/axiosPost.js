import axios from 'axios';

const axiosPost = axios.create({
  baseURL: 'https://myleetcode.onrender.com/feed',
  withCredentials: true
});

export default axiosPost;
