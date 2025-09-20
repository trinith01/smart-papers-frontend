import axios from "axios";


const api = axios.create({
  //  baseURL: API_BASE_URL,
  
   //baseURL:"http://localhost:5000"
  baseURL:"https://api.qgen.edu.lk",
});

export default api;