import nodemailer from 'nodemailer';
import dotenv from "dotenv"
dotenv.config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  }
});

export async function sendEmail(email, otp) {
  console.log(process.env.EMAIL)
  console.log(process.env.PASSWORD)
  transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'OTP for password reset',
    text: `
    Your OTP is ${otp}
  `
  }, ((err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log(info)
    }
  }))
}