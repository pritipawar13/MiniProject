const jwt = require('jsonwebtoken');
const User=require('../model/user.model')


var adminauth=function (req, res, next){
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(401).send('Access Denied: No Token Provided!');

    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
   if(decoded.role==='admin')
    {
        next();
    }
    else
        return res.status(401).send('Access Denied: You dont have correct privilege to perform this operation');
    
}

var superadminauth=function (req, res, next){
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(401).send('Access Denied: No Token Provided!');

    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
            req.decoded = decoded;
            next();
        }
    })
/* if(decoded.role==='superadmin')
    {
        next();
    }
    else
        return res.status(401).send('Access Denied: You dont have correct privilege to perform this operation');*/
    
}
module.exports={
    adminauth,
    superadminauth
}


