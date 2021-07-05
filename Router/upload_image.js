const express=require('express');
const router=express.Router()
const multer=require('multer')
const path=require("path");
const maxfilesize=1024 *1024;
const saveimage=require('./upload_save')

// storage engine
const storage=multer.diskStorage({
	destination:'./Public/uploads/image',
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

router.use(express.static(__dirname+'./Public'))
router.post("/",function (req, res,next) {
    upload(req,res,function(err) {
        if(err) {
            res.send(err)
        }        
        res.send(`Name of image : ${req.file.originalname} 
		type of file : ${req.file.fieldname}
		Success, Image uploaded!`)
         //res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`)
        console.log(req.file);
        
            })     
    })

function errHandler(err,req,res,next){
	if(err instanceof multer.MulterError){
		res.json({
			sucesss:0,
			message: err.message
		})
	}
}

router.use(errHandler)


module.exports=router;