const express=require('express');
const router=express.Router()
const multer=require('multer')
const jwt_decode = require('jwt-decode');
const path=require("path");
const fs=require('fs')
const maxfilesize=1024 *1024;
const uploadModel=require('../model/upload.model');
const User=require('../model/user.model')
const verifyToken=require('../Middleware/authenticateToken');
//const uploadimage = require('../model/upload.model');
const mongoose=require('mongoose');
const { getMaxListeners } = require('../model/user.model');
const imageData=uploadModel.find({})

router.use(express.static(__dirname+"./public"))
router.use(express.static(__dirname+"./public/images"))

// This function is used for decode the access token 
function decodeToken(token){
  return jwt_decode(token);
}

// storage engine
const storage=multer.diskStorage({
	destination:'./public/images/',
	filename: (req,file,cb)=>{
		return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
	  
     
  }
})

const upload=multer({ 
	storage:storage,
	limits:{ fileSize:maxfilesize},
	
	  fileFilter: function (req, file, cb){
    
        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      } 
    
}).single('image');

router.post('/upload',verifyToken,upload,function (req, res) {
   var authHeader=req.headers['authorization'].split(' ')[1]
   var decodedToken=decodeToken(authHeader)
   console.log(decodedToken)

   var username=decodedToken.email
   var role=decodedToken.role
   var imageFile=req.file.filename;
   var description=req.body. description;  
   var filePath=req.file.path
   const imageDetails= new uploadModel({
   image:imageFile,
   description:description,
   filePath:filePath,
   username:username,
   });
   imageDetails.save(function(err,doc){
   if(err) throw err;
      res.status(200).json({
        message:`${username} uploaded ${imageFile} Successfully Uploaded`
      })
    });
});

 // To get all uploaded images by perticular user .

 router.get('/seeprofileimages',verifyToken,function(req,res){
    var authHeader=req.headers['authorization'].split(' ')[1]
    var decodedToken=decodeToken(authHeader)
    console.log(decodedToken)
    var email=decodedToken.email;
      uploadModel.find({username:{$eq:email}}).exec((err,images)=>{
        if(err){
          throw err;
        }
      else{
         return res.json({status:'ok',images})
        //res.render('upload',{record:images})
       }        
    })
 })  

 // to see all records

 router.get('/allimages',function(req,res){
   uploadModel.find().exec((err,user)=>{
     if(err){
       throw err;
     }else{
       res.status(200).json({
         message:"All Uploded Images",
         images:user
       })
       //res.render('upload',{record:user})
     }
   })
 })

 // To see the all images in decreasing order
/*  router.get('/latestimages',function(req,res){
    var authHeader=req.headers['authorization'].split(' ')[1]
    var decodedToken=decodeToken(authHeader)
    //console.log(decodedToken)
    var models=[User,uploadModel]
    var username=decodedToken.email;
    uploadModel.find({username:username}).sort({createdAt:-1}).then((images)=>{
      console.log(images)
      return res.json({images})
    })
  })*/

// findout information about user and their uploaded images by using aggregate
  router.get('/latestimages/:id',function(req,res){
    var email=req.params.id
   
    User.aggregate([{ $match:{"email":email}},
      {$project :{"__v":0,"password":0}},
     {  $lookup: {
              from: "uploadimages",
              localField: "email",
              foreignField: "username",
              as: "images"
          }
  }]).then(result=>{
  res.json(result)
  })
 /*
  User.aggregate([{ $match:{"email":email}},
  { $project:{"password":0,"__v":0}},
    { $lookup:{
      from:"uploadimages",
      let:{email_user:'$email',},
      pipeline:[
        {$match:{$expr:{ $eq:['$username','$$email_user']}} },
          { $project: { __v: 0} }, // which field we dont want  the value of that is 0 . if we want then it places as 1
          { $sort:{createdAt:-1}}
        ],         
      as:"images"
    }
  }]).then(result=>{
  res.json(result)
  })*/
})


// findout information about user and their uploaded images by using populate.

 router.get('/images/:id',function(req,res){
    uploadModel.findOne({_id:req.params.id })
    .populate('user').exec((err,data)=>{
      res.status(200).json({
        message:"okk",
        result:data
      })
    })
    })

// Edit Description of post by using Id.
router.put('/edit/describtion/:id',async (req,res)=>{
  var id=req.params.id
  var newDesc=req.body.description;

  await uploadModel.findByIdAndUpdate({_id:id},{$set:{description:newDesc}})
  res.status(200).json({
    message:`${req.body.username} Sucessfully Edit the Description about post `
  })

})

// edit existing image with new image of perticular

router.put('/edit/image/:id',upload,async(req,res)=>{
  var id=req.params.id
  var newimage=req.file.filename
  await uploadModel.findByIdAndUpdate({_id:id},{$set:{image:newimage}})
  res.status(200).json({
    message:"Successfully uploaded new images "
  })

})

// delete
  

// Apply Pagination with images
  router.get('/imagespagination',pagenateResult(uploadModel),function(req,res){
     res.json(res.pagenateResult)
    
  })
    

  function pagenateResult(model){
    return async (req,res,next)=>{
        const page=parseInt(req.query.page);
    const limit=parseInt(req.query.limit);
    const startindex=(page-1)*limit;
    const endindex=page*limit;

    const results={};
    results.next={
        page:page+1,
        limit:limit
    }
    results.previous={
        page:page-1,
        limit:limit
    }
    try{
    results.results=await model.find().sort({createdAt:-1}).limit(limit).skip(startindex).exec()
    res.pagenateResult=results;
    next()
   }catch(err){
       res.send(err)
   }
   }
}  
 


function errHandler(err,req,res,next){
	if(err instanceof multer.MulterError){
		res.json({
			sucesss:0,
			message: err.message
		})
	}
}

router.use(errHandler)


module.exports=router