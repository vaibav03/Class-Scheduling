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
  const { email, password } = req.body;
  const newUser = await user.findOne({ email });
  if (!newUser) return res.status(400).json({ message: 'User not found' });
  const passwordmatch = await bcrypt.compare(password, newUser.password);
  if (!passwordmatch) return res.status(400).json({ message: 'Invalid password' });
  const accessToken = jwt.sign({email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  console.log(accessToken)
  const refreshToken = jwt.sign({email}, process.env.REFRESH_TOKEN_SECRET);
  res.cookie('refreshToken', refreshToken, { httpOnly: true, expiresIn: 2 * 24 * 60 * 60 * 1000 });
  res.json({ accessToken: accessToken, role: newUser.role });
}

export async function refresh() {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const email = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!email) return res.status(403).json({ message: 'Forbidden' })
    const newUser = await user.findOne({ email });
    if (!newUser) return res.status(400).json({ message: "User not found" });

    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: accessToken });
  } catch (e) {
    return res.status(403).json({ message: 'Forbidden' });
  }
}