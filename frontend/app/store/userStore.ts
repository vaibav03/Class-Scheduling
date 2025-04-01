import { create } from "zustand";

const userStore = (set:any,get:any) => ({
  email : null,
  accessToken : null,
  refreshToken : null,
  role : null,
  login : (email : any,accessToken:any,refreshToken:any, role :any) => set({email,accessToken,refreshToken,role}),
  logout : () => set({email : null,accessToken : null,refreshToken : null,role:null}),
  refreshTokenSuccess : (accessToken:any) => set((state:any) => {return {...state,accessToken}}),
})

const userStoreState = create(userStore)
export default userStoreState;