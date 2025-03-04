import dotenv from "dotenv"
import jwt from "jsonwebtoken";
import { userSchema } from "../models/users";
import randomstring from "randomstring";
dotenv.config();


export function generateAccessToken(email){
  return jwt.sign(email,process.env.ACCESS_TOKEN_SECRET,{expiresIn : '1h'});
}

export function generateRefreshToken(email){
  return jwt.sign(email,process.env.REFRESH_TOKEN_SECRET,{expiresIn : '2d'});
}

export function login(){
  const {email,password} = req.body;
  const user = userSchema.findOne({email});
  if(!user) return res.status(400).json({message : 'User not found'});
  if(user.password !== password) return res.status(401).json({message : 'Invalid password'});

  const accessToken = jwt.sign(email,process.env.ACCESS_TOKEN_SECRET);
  const refreshToken = jwt.sign(email,process.env.REFRESH_TOKEN_SECRET);
  res.cookie('refreshToken',refreshToken,{httpOnly : true , expiresIn : 2*24*60*60*1000});
  res.json({accessToken:accessToken});
}

export async function signup(){
  const {email,password} = req.body;
  
  
}


export function refresh(){
  const refreshToken = req.cookies['refreshToken'];
  if(!refreshToken) return res.status(401).json({message : 'Unauthorized'});
  try{
    const user = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
    if(!user) return res.status(403).json({message : 'Forbidden'})
    const accessToken = jwt.sign({email : user.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn : '15s'});
    res.json({accessToken : accessToken});
  }catch(e){
    return res.status(403).json({message : 'Forbidden'});
  }
}