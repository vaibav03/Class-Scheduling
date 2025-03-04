import mongoose from "mongoose"

 export const otpSchema = new mongoose.Schema({
  email : {type:String, required:true},
  otp : {type:String, required:true}
})

export const otpStore = new mongoose.model("otpStore",otpSchema)