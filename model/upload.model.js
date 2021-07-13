const mongoose=require('mongoose')
const Schema= mongoose.Schema;
const connection=require('../helper/db');

const Uploadschema=new mongoose.Schema({
    description: String,
    username:String,
    image: String,
    filePath:String,
    createdAt: {
    type: Date,
    default: new Date()
}

})

const uploadimage=mongoose.model('uploadimage',Uploadschema)
module.exports=uploadimage
