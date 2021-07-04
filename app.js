const express=require('express');
const createError=require('http-errors')
const bodyParser=require('body-parser');
const db=require('./helper/db');
const uploadimage=require('./Router/upload_image');
const deleteimage=require('./Router/delete_image')
const saveimage=require('./Router/upload_save.js');
const allfiles=require('./Router/all_file')
const path=require('path')

const app=express();
const authroute=require('./Router/authroute');


app.use(express.urlencoded({
    extended:true
}));
app.use(express.json())

// Calling Routes 
app.use(authroute);
app.use('/uploadimage',uploadimage);
app.use(deleteimage)
app.use(saveimage);
app.use(allfiles)


const port=process.env.PORT||2000;

//app.set('view engine','ejs');

// for handling error 
app.use(async(req,res,next)=>{
   /* const error=new Error("Not Found");
    error.status=404
    next (error)*/
    next(createError.NotFound("This route does not exits"))

})

app.use((err,req,res,next)=>{
    res.status(err.status ||400)
    res.send({
        error:{
            status:err.status ||400,
            message: err.message
        }
    })
})




app.listen(port,function(){
    console.log(`Server is Running on ${port}`);
})