const JWT=require('jsonwebtoken');
const createError=require('http-errors');

module.exports={
    signAccessToken:(userId)=>{
        return new Promise((resolve,reject)=>{
            const payload={
                //name:"Priti Pawar"                
            }
            const secret="some super secrate"
            const options={
                expiresIn:"1h",
               // issuer:"",
                audience:userId
            }
            JWT.sign(payload,secret,options,(err,token)=>{
                if(err) reject(err)
                resolve(token)
            })
        })
    }
}