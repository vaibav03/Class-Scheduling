import axios from "axios";
import userStoreState from "./store/userStore";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
});


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error)=>{
    if(error.response.status === 401 && error.response.message==="Access Token expired"){
      const res  = axiosInstance.get("/refresh") 
    }
  }
)