const express=require('express');
const bodyParser=require('body-parser');
const router=require('express').Router()
const mongoose=require('mongoose');
const bcrypt=require('bcrypt')
const User=require('../model/user.model')
const createError=require('http-errors')
const { authschema }=require('../helper/schema_validation.js');
const path=require('path');

router.get('/password',function(req,res){
    var email=req.body.email;
    User.find({email:{$in:email}}).exec((err,data)=>{
        if(err) return res.status(400).send("Email not found");
        else{
            res.json(data)
        }
    })
})

router.put('/forgot/password',function(req,res){
    var email=req.body.email;
    var newpassword=req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newpassword, salt);
    User.update({email:email},{$set:{password:hash}}).exec((err,data)=>{
        if(err) return res.status(400).json({
            messgae:"Cannot forgot old Password"
        });
        else{
           res.json({
               status:200,
               message:`${email} has been Successfully forgot the old Password`
           })
        }
    })
})

router.get('/confirm/password',async function(req,res){
    var email=req.body.email;
    var password=req.body.password;
    const salt =await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
   await bcrypt.compare(password,hash,function(err,data){
        if(err) return res.status(400).send("Password is invalid Password")
        else{
            //res.status(200).send("Confirm the password")
            res.json({
                status:200,
                message:`${email} has confirm the password`
            })
        }
    })
})





module.exports=router