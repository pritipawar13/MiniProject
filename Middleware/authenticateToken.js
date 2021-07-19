const jwt=require('jsonwebtoken')
const createError=require('http-errors')

function authenticateToken(req,res,next){
  const authHeader=req.headers['authorization']
  const token= authHeader && authHeader.split(' ')[1]
  if(token ==null) return res.status(401)

  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
      if(err) return res.send("NOt valid User")
      console.log("Verify Token")
      req.user=user;
      next()

  })
}

module.exports=authenticateToken