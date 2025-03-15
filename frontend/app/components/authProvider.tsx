import axios from "axios"
export function AuthProvider(){
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
  })

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status === 401) {
        try{
          const res  = await api.post("/auth/refresh")
          
        }catch(e){
          console.log(e)
          window.location.href = "/"
        }
      }
      return Promise.reject(error)
    }
  )
}