const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose')
const JWT=require('jsonwebtoken');

const User=require('../model/user.model')
const createError=require('http-errors')
const { authschema }=require('../helper/schema_validation.js')

module.exports=async function(req,res,next){
    try{
        const result=await authschema.validateAsync(req.body)
        console.log(result)

        const doesexits=await User.findOne({ email:result.email})
        if(doesexits) {
            console.log('exits')
            next()
        }else{
            return res.send(`${result.email} not valid/ You have to firstly register`)
        }
    }
    catch(error){
        throw error
    }
        

}


 
