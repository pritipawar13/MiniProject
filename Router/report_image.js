const express=require('express');
const router=express.Router();
const mongoose=require('mongoose')
const jwt_decode = require('jwt-decode');
const Reportimage=require('../model/report.model')
const uploadModel=require('../model/upload.model');
const User = require('../model/user.model');
const {adminauth,superadminauth}=require('../Middleware/validate_role')

router.post('/report/image/:imageid',function(req,res){
  var imageid=req.params.imageid
    var reportuser=req.body.reportuser;
    var reason=req.body.reason;
    var isreport=req.body.report;s

   if(isreport==false){
        return res.status(200).json({
            status:200,
            message:"Image is statisfy all condition of authority..."
        })
    }
    const reportimage=new Reportimage({
        imageid:imageid,
        isreport:isreport,
         reportuser:reportuser,
         reason:reason
      })
  
    reportimage.save(function(err,data){
        if(err) throw err;
        return res.status(200).json({
            status:200,
           message:"Reported image",
           data:data
        })
    })
})

// to see reported perticular images information with user information

router.get('/perticular/image/report/:imageid',function(req,res){
    Reportimage.find({imageid:req.params.imageid})
    .populate({ path: 'posts', select: 'image describtion createdAt username filepath' })
    .exec(function(err,result){
      res.send(result)
    })
   })

// to see all reported images only by admins.

router.get('/all-reported/images',adminauth,function(req,res){
  Reportimage.find({}).exec((err,data)=>{
    res.status(200).json({
      status:200,
      sucess:true,
      data:data
    })
  })
})

// onle delete the image of reported image by admin 
 
router.delete('/delete/reported/images/by/admin/:imageid',adminauth,function(req,res){
 uploadModel.findByIdAndDelete({_id:req.params.imageid}).exec((err,data)=>{
   return res.status(200).json({
      status:200,
      message:"Sucessfully deleted images"
    })

  })
})

// only superadmin can saw all information about user ,admin,superadmin

router.get('/all/info/about/admin-user-superadmin/:role',superadminauth,function(req,res){
    User.find({role:req.params.role}).exec((err,data)=>{
     return res.status(200).json({
        status:200,
        message:`Detalis Information about ${req.params.role}`,
        data:data
      })
    })
    
  })

// only superadmin creates the new admins

router.post('/create/new/admin',superadminauth,function(req,res){
  var found=User.find({email:req.body.email})
  if(!found){
    const newadmin=new User({
      firstname:req.body.firstname,
      lastname:req.body.lastname,
      email:req.body.email,
      password:req.body.password,
      role:req.body.role
    })
    newadmin.save()
    res.status(201).json({
      message:`${req.body.email} has sucessfully created as Admin of the system`
    })
}
else{
  res.status(301).json({
    message:`${req.body.email} has already found as a admin`
  })

}
  
})




router.get('/count/:imageid',function(req,res){
  var imageid=req.params.imageid
  Reportimgae.count({imageid:imageid},function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.json("Number of documents in the collection: " + result);
    }
  });
});




router.get('/all/report',function(req,res){
    Reportimgae.find({}).exec((err,data)=>{
        return res.status(200).json({
            status:200,
            message:"All report Images",
            result:data
        })
    })
})

module.exports=router
