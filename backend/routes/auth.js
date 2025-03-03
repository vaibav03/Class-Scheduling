import dotenv from "dotenv"

dotenv.config();

export function generateotp(){

}
export function verifyotp(){

}

export function login(){
  const {email,password} = req.body;
  const accessToken = jwt.sign(email,process.env.ACCESS_TOKEN_SECRET);
  res.json({accessToken:accessToken});
}

export function verifyToken(req,res,next){
  const authHeader = req.headers['authorization'];
  const token   = authHeader & authHeader.split(' ')[1];
  if(!token) return res.status(401).json({message : 'Unauthorized'});

  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user) =>{
    if(err) return res.status(403).json({message : 'Forbidden'});

    req.user = user;
    next();
  })
}

export function refresh(){
  const refreshToken = req.body.refreshToken;
  if(!refreshToken) return res.status(401).json({message : 'Unauthorized'});
 
}