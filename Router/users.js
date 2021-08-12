const express=require('express');
const Users=require('../model/user.model')
const router=express.Router();
const {userauth}=require('../Utils/userauth')

// user regesiteration routes
router.post('/add/user',async function(req,res){
    userauth(req.body,res)

})

router.get('/all/roles/:role',function(req,res){
    var role=req.params.role;
    Users.find({role:role}).exec((err,data)=>{
        res.status(200).json({
            sucess:true,
            status:200,
            message:"All Details informations",
            Data:data
        })  
    })
    

})

module.exports=router