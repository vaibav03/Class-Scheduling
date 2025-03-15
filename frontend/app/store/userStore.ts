import { create } from "zustand";

const userStore = (set:any,get:any) => ({
  email : null,
  accessToken : null,
  refreshToken : null,

  login : (email : any,accessToken:any,refreshToken:any) => set({email,accessToken,refreshToken}),
  logout : () => set({email : null,accessToken : null,refreshToken : null}),
  refreshTokenSuccess : (accessToken:any) => set((state:any) => {return {...state,accessToken}}),
})

const userStoreState = create(userStore)
export default userStoreState;