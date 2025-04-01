import jwt from "jsonwebtoken"
export function verifyToken(req,res,next){
  console.log("verify token")
  const token  = req.cookies.accessToken
  console.log("access token", token)
  console.log("refresh", req.cookies.refreshToken)
  if(!token) return res.status(401).json({message:"Access Token expired"})

  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,email) =>{
    if(err){ 
      console.log(err)
      return res.status(403).json({error : 'Access Token invalid'});
    }
    next();
  })
}