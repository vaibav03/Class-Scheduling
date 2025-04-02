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


export async function sendEmailToGroup(members, groupName, classTimings) {
  transporter.sendMail({
    from: process.env.EMAIL,
    to: members.join(", "),
    subject: 'Class has been canceled',
    text: `
    Class has been cancelled on ${classTimings.day} from ${classTimings.startTime} to ${classTimings.endTime} for group ${groupName}
  `
  }, ((err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log(info)
    }
  }))
}