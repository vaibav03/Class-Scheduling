export function verifyToken(req,res,next){
  const authHeader = req.headers['authorization'];
  const token   = authHeader & authHeader.split(' ')[1];

  if(!token) return res.status(401).json({message : 'Invalid Access Token'});

  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,email) =>{
    if(err) return res.status(403).json({message : 'Forbidden'});
    req.email = email;
    next();
  })
}