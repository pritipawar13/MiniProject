const mongoose=require('mongoose')
const Schema= mongoose.Schema;
const connection=require('../helper/db');

const Uploadschema=new mongoose.Schema({
    imagename:String,
    fieldname:String,
    path:String,
    mimetype:String,
    size:Number

})

const uploadimage=mongoose.model('uploadimage',Uploadschema)
module.exports=uploadimage
