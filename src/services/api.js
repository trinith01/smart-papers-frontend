import axios from "axios";


const api = axios.create({
  //  baseURL: API_BASE_URL,
  
  // baseURL:"https://backend-v2-f059.onrender.com"
  baseURL:"https://api.qgen.edu.lk",
});

export default api;