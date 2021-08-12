const express=require('express');
const router=express.Router()
const fs=require('fs');
const bodyparser=require('body-parser');
const path=require('path')
const uploadModel=require('../model/upload.model');
const imageData=uploadModel.find({})

const port=process.env.PORT ||2000;

const dirPath='./public/images'

// Delete image from the database. 

router.delete('/deleteimage/:id',function(req,res){
    var image=req.params.id
    if(!req.params.id){
        console.log(" Error in the file . Image not found !!");
        message:" Error in deletion of image!!";
        return res.status(500).json('error in delete');
    }
    else{
        console.log("File received !!");
        console.log(`image name : ${req.params.id}`)  
        uploadModel.findOneAndDelete({_id:req.params.id}).exec((err,images)=>{
            if(err){
              throw err;
            }
            console.log("image deleted from database;")
            return res.status(200).json({
                message:" Image SuccessFully Deleted"
            })
        })      
           /* fs.unlink(dirPath+'/'+req.query.imagename,function(err){
                if(err) throw err;
                console.log(`successfully deleted ${req.query.imagename}`);
                return res.status(200).json({
                    message:" Image SuccessFully Deleted"
                })
            })*/
    }

})

router.delete('/deleteimage/from/folder/:imagename',function(req,res){
    var imagename=req.params.imagename
    fs.unlink(dirPath+'/'+req.params.imagename,function(err){
                if(err) throw err;
                console.log(`successfully deleted ${req.params.imagename}`);
                return res.status(200).json({
                    message:" Image SuccessFully Deleted"
                })
            })
    

})

module.exports=router;
