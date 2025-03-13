import randomstring from "randomstring";
import { sendEmail } from "./nodemailer.js";
import { user } from "../models/users.js";
import { otpStore } from "../models/otpSchema.js";
import bcrypt from "bcrypt"

function generateOTP() {
  return randomstring.generate({
    length: 6,
    charset: 'numeric'
  });
}

export async function sendOTP(req, res) {
  try {
    console.log("Send OTP running")
    const { email } = req.body;
    const otp = generateOTP();
    await sendEmail(email, otp);
    const doesUserExist = await otpStore.findOne({email});
    if(doesUserExist) await doesUserExist.deleteOne();
    
    const newOTP = new otpStore({ email, otp });
    newOTP.save();
    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function verifyOTP(req, res) {
  try {
    console.log("Verify OTP running")
    const { email, otp, password, role } = req.body;
    const otpUser = await otpStore.findOne({ email, otp });
    if (!otpUser) return res.status(400).json({ message: 'Invalid OTP' });
    
    const hashedPassword =  bcrypt.hashSync(password, 10);
    const newUser = new user({ email, password : hashedPassword, role });
    newUser.save()

    return res.json({ message: 'OTP verified successfully' });
  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: 'Internal server error' });
  }
}