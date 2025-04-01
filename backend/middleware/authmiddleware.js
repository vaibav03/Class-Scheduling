import jwt from "jsonwebtoken"
export function verifyToken(req,res,next){
  console.log("verify token")
  const authHeader = req.headers['authorization'];
  console.log(authHeader)
  const token   = authHeader && authHeader.split(' ')[1];
  console.log("token " , token)
  if(!token) return res.status(401).json({error : 'Invalid Access Token'});

  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,email) =>{
    if(err){ 
      console.log(err)
      return res.status(403).json({error : 'Forbidden'});
    }
    req.email = email;
    next();
  })
}