import axios from "axios";


const api = axios.create({
  //  baseURL: API_BASE_URL,
  
  baseURL:"https://api.qgen.edu.lk"
  //baseURL: "http://localhost:5000"
  
});

export default api;