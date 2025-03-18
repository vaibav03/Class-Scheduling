import axios from "axios";
import userStoreState from "./store/userStore";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) =>{
    const {accessToken} = userStoreState.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config
  },
  (error) => Promise.reject(error)
)


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error)=>{
    if(error.response.status === 401 && error.response.message==="Invalid Access Token"){
      const accessToken = await axiosInstance.get("/refresh");
      userStoreState.getState().refreshTokenSuccess(accessToken.data.access_token);
    }
  }
)