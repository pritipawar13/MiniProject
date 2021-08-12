const express=require('express');
const router=express.Router()
const multer=require('multer')
const path=require("path");
const fs=require('fs')
const mongoose=require('mongoose')
const jwt_decode = require('jwt-decode');
//const {student_validation}=require('../helper/student_validation');
const userProfile=require('../model/userprofile.model')
const uploadModel=require('../model/upload.model');
const maxfilesize=1024*1024;

router.use(express.static(__dirname+"./public"))

const storage=multer.diskStorage({
	destination:'./public/profile/',
	filename: (req,file,cb)=>{
		return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)   
  }
})

const upload=multer({ 
	storage:storage,
	limits:{ fileSize:maxfilesize}    
}).single('profile')

router.post('/Profile',upload,function(req,res){
    const imagename=req.file.filename
    const profile=new userProfile({
             Firstname:req.query.Firstname,
            Lastname:req.query.Lastname,
            Email:req.query.Email,
            PhoneNumber:req.query.PhoneNumber,
            Address:req.query.Address,
            ProfilePhoto:imagename,
    })
    profile.save(function(err,data){
        if(err) throw err
    })
    res.status(200).json({
        message:`${email} Information Added SucessFully ..`
    })
})

router.get('/allrecord',function(req,res){
    var email=req.query.Email
    userProfile.find({Email:{$eq:email}}).exec((err,data)=>{
        if(err) throw err;
        else{
            res.status(200).json({
                message:`Details of ${email}`,
                record:data
            })
        }
    })
})

// Findout details information about user profile and there uploaded images by passing token

router.get('/images/and/info/user',function(req,res){
    var authHeader=req.headers['authorization'].split(' ')[1]
    var decodedToken=jwt_decode(authHeader);
    var email=decodedToken.email;
    userProfile.aggregate([{$match:{Email:email}},
    {
        $lookup:{
            from:"uploadimages",
            localField:"Email",
            foreignField:"username",
            as:"Images"
        }
    }]).exec((err,data)=>{
        if(err) throw err;
        else{
            res.status(200).json({
                message:`Details of ${email}`,
                Details:data
            })
        }
    })

})

// findout detail information about user profile and uploaded images by passing perticular email id i.e username 

router.get('/perticular/user/profile/:username',function(req,res){
    var userid=req.params.username;
    userProfile.aggregate([{$match:{Email:userid}},
        {
            $lookup:{
                from:"uploadimages",
                localField:"Email" ,
                foreignField: "username",
                as:"Images"
            }

        }
    ]).exec((err,result)=>{
        res.status(200).json({
            message:"All Deatils of user",
            images:result
        })
    })
})


module.exports=router