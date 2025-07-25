import axios from "axios";


const api = axios.create({
  //  baseURL: API_BASE_URL,
  
  // baseURL:"https://backend-v2-f059.onrender.com"
  baseURL:"http://ec2-13-212-91-167.ap-southeast-1.compute.amazonaws.com:5000"
});

export default api;