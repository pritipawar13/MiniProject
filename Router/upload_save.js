const express=require('express');
const router=express.Router()
const app=express()
const multer=require('multer')
const path=require("path");
const uploadmodel=require('../model/upload.model')
const uploadimage=require('./upload_image')
const port=2000;

const imageData=uploadmodel.find({})

router.post("/saveimage",function (req, res,next) {
    uploadimage.upload(req,res,function(err) {
       var imagefile= req.file.originalname
       var imagefield= req.file.fieldname
       var imagepath= req.file.path
       var imagemimtype= req.file.mimetype
       var filesize=req.file.size
  
        if(err) {
            res.send(err)
        }
         var imageDetails=new uploadmodel({
                imagename:imagefile,
                fieldname:imagefield,
                path:imagepath,
                mimetype:imagemimtype,
                size:filesize
            })
            imageDetails.save(function(err,result){
                if(err) throw err;             
               res.send(`Name of image : ${req.file.originalname} 
			type of file : ${req.file.fieldname}
			Success, Image uploaded!`)
            console.log(req.file);
        
            })
			
        
    })
})


module.exports=router;