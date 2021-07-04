const express=require('express');
const router=express.Router()
const fs=require('fs');
const bodyparser=require('body-parser');
const path=require('path')

const port=process.env.PORT ||2000;

const dirPath='./Public/uploads/image'

router.delete('/deleteimage/:imagename',function(req,res){
    if(!req.params.imagename){
        console.log(" Error in the file . Image not found !!");
        message:" Error in deletion of image!!";
        return res.status(500).json('error in delete');
    }
    else{
        console.log("File received !!");
        console.log(`image name : ${req.params.imagename}`)
        
            fs.unlink(dirPath+'/'+req.params.imagename,function(err){
                if(err) throw err;
                console.log(`successfully deleted ${req.params.imagename}`);
            return res.status(200).send('Successfully! Image has been Deleted');
            })
            

    }

})

module.exports=router;
