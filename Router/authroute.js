require('dotenv').config()
const express=require('express');
const router=require('express').Router()
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const jwt_decode = require('jwt-decode')
const User=require('../model/user.model')
const createError=require('http-errors')
const { authschema }=require('../helper/schema_validation.js');
const path=require('path');
const check_register=require('../Middleware/check_register');
const verifyToken=require('../Middleware/authenticateToken');

router.post('/register',async(req,res,next)=>{    
    try{
        const result=await authschema.validateAsync(req.body)
        const doesexits=await User.findOne({ email:result.email})
        if(doesexits) 
            throw createError.Conflict(`${result.email} is already Registered`)
        const user=new User({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            password:req.body.password,
            role:req.body.role

        })
        const saveuser=await user.save()
      res.status(200).json({
          message:" SuccessFully New User Added",
      })    
    }
    catch(error){
        if(error.isJoi ==true) error.status=422
        next(error)
    }  
})

let  refreshTokens=[]

function generateAccessToken(user){
    accessToken= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{ expiresIn:'1h'});
    return accessToken;
}

function generateRefreshToken(user){
    refreshToken= jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    return refreshToken
}

router.post('/login',async function (req,res){
    try{
        const result=  await authschema.validateAsync(req.body)
        const user=  await  User.findOne({ email :result.email})
        if(!user)
            return res.status(400).send('user not regesitered')
        if(user.role!=req.body.role){
            res.status(400).json({
                status:400,
                sucess:false,
                message:"Make sure your credinational is Right ??"
            })
        }
        const ismatch= await  user.isvalidpassword(result.password)
        if(!ismatch){
            return res.status(400).send('password not valid')
        }
        const userauth={id:result._id,email:result.email,firstname:result.firstname,lastname:result.lastname,role:result.role,password:result.password};
        const accessToken=generateAccessToken(userauth)
        console.log(accessToken)
        res.json({accessToken:accessToken})
    }catch(error){
      throw error;
    }
})

router.delete('/logout',function(req,res){
    JWTtoken=req.body.token;
    console.log(JWTtoken)
    if(!JWTtoken) return res.send("Firstly done Login ")
    refreshTokens=refreshTokens.filter(token=>token !=req.body.token)
    console.log(refreshTokens)
    res.send("sucessfully logout")
})



router.get('/find-all',function(req,res){

    User.find({}).then(function(result){
        res.send(result);
        console.log(result)
    }).catch(function(err){
        res.send(err);
        console.log(err)
    })
})

router.get('/findDetails',verifyToken,function(req,res){
    var authHeader=req.headers['authorization'].split(' ')[1]
    var token=jwt_decode(authHeader)
    User.find({email:token.email}).then(rec => {
        res.status(200).json(rec)
      })
    })

module.exports=router;
