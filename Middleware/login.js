const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose')

const User=require('../model/user.model')
const createError=require('http-errors')
const { authschema }=require('../helper/schema_validation.js')

  module.exports=  async function(req,res,next){
        try{
            const result= await authschema.validateAsync(req.body)
            const user=  await User.findOne({ email :result.email})
            if(!user) // throw createError.NotFound('user not regesitered')
                res.send('user not regesitered')
    
            const ismatch= await user.isvalidpassword(result.password)
            if(!ismatch){
                res.send('password not valid')
                //throw createError.Unauthorized('username/password not valid')
            }
           
        //res.send(` ${result.email} is Successfully Login`)
        next()
        }catch(error){
            //throw error;
           if(error.isJoi==true) 
           return next(createError.BadRequest("Invalid Username/Password"))
            //next(error)
        }
    }
    