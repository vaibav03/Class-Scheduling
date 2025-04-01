import dotenv from "dotenv"
import jwt from "jsonwebtoken";
import { user } from "../models/users.js";
import randomstring from "randomstring";
import bcrypt from "bcrypt"
dotenv.config();


export function generateAccessToken(email) {
  return jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

export function generateRefreshToken(email) {
  return jwt.sign(email, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2d' });
}

export async function login(req, res) {
  console.log("logging in");

  try {
  const { email, password , role } = req.body;
  const newUser = await user.findOne({ email , role });
  if (!newUser) return res.status(400).json({ message: 'User not found' });
  const passwordmatch = await bcrypt.compare(password, newUser.password);
  if (!passwordmatch) return res.status(400).json({ message: 'Invalid password' });
  const accessToken = jwt.sign({email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({email}, process.env.REFRESH_TOKEN_SECRET);
  res.cookie('refreshToken', refreshToken, { httpOnly: true, expiresIn: 2 * 24 * 60 * 60 * 1000 });
  res.cookie('accessToken',accessToken,{httpOnly:true, expiresIn: 1 * 60 * 60 * 1000})
  res.json({ role: newUser.role });
}catch(e) {
  console.log(e)
  res.status(500).json({error : "Internal server error"})
}
}

export async function refresh() {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh Token not found' });

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,email)=>{
      if (err) {
        console.log(err)
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const doesUserExist = user.findOne({email});
      if(!doesUserExist) res.status(400).json({ message: "User not found" });

      const accessToken = jwt.sign({email},process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
      return res.status(200).json({accessToken})
    });


    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.cookie("accessToken", accessToken, { httpOnly: true, expiresIn: 1 * 60 * 60 * 1000 });
    res.json({ message : " Refreshed" });
  } catch (e) {
    return res.status(403).json({ message: 'Cannot refresh access token' });
  }
}