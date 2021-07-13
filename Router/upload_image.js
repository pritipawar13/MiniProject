const express=require('express');
const router=express.Router()
const multer=require('multer')
const path=require("path");
const fs=require('fs')
const maxfilesize=1024 *1024;
const uploadModel=require('../model/upload.model');
const imageData=uploadModel.find({})

router.use(express.static(__dirname+"./public"))


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
    
}).single('image')

;

router.post('/upload',upload,function (req, res,next) {
  var username=req.body.email;
   var imageFile=req.file.filename;
    var description=req.body. description;  
    var filePath=req.file.path;
   

 var imageDetails= new uploadModel({
   image:imageFile,
   description:description,
   filePath:filePath,
   username:username
 });
   imageDetails.save(function(err,doc){
   if(err) throw err;
      res.send(`${username} uploaded ${imageFile} Successfully Uploaded`)
    });
});

 // To get all uploaded images by perticular user .

 router.get('/seeprofileimages',function(req,res){
  var username=req.query.email;
      uploadModel.find({username:{$eq:username}}).exec((err,images)=>{
        if(err){
          throw err;
        }
      else{
        // return res.json({status:'ok',images})
        res.render('upload',{record:images})
       }        
    })
 })  

 // to see all records

 router.get('/allimages',function(req,res){
   uploadModel.find().exec((err,user)=>{
     if(err){
       throw err;
     }else{
       res.render('upload',{record:user})
     }
   })
 })

 // To see the all images in decreasing order

  router.get('/latestimages',function(req,res){
    uploadModel.find()
    .sort({createdAt:-1})
    .then((images)=>{
      return res.render('upload', { title: 'Upload File', record:images}) 
    })
  })
  
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