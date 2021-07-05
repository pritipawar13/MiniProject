const express=require('express');
const router=require('express').Router()
const bodyParser=require('body-parser');
const app=express();
const mongoose=require('mongoose')

const User=require('../model/user.model')
const createError=require('http-errors')
const { authschema }=require('../helper/schema_validation.js')
//const { signAccessToken }=require('../helper/jwt_helper')

router.post('/register',async(req,res,next)=>{    
    try{
        //const { name,email,password}=req.body
        //if(!email || !password) throw createError.BadRequest()

        const result=await authschema.validateAsync(req.body)
       // console.log(result)

        const doesexits=await User.findOne({ email:result.email})
        if(doesexits) 
            throw createError.Conflict(`${result.email} is already Registered`)

        const user=new User(result)
        const saveuser=await user.save()
       //const accesstoken=await signAccessToken(saveuser.id)

       res.send(saveuser)
       //res.send(accesstoken)
    }
    catch(error){
        if(error.isJoi ==true) error.status=422
        next(error)
    }  
})

router.post('/login',async (req,res,next)=>{
    try{
        const result=await authschema.validateAsync(req.body)
        const user=await User.findOne({ email :result.email})
        if(!user) throw createError.NotFound('user not regesitered')

        const ismatch=await user.isvalidpassword(result.password)
        if(!ismatch){
            throw createError.Unauthorized('username/password not valid')
        }

        res.send(result)
    }catch(error){
        if(error.isJoi==true) return next(createError.BadRequest("Invalid Username/Password"))
        next(error)
    }

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

module.exports=router;
