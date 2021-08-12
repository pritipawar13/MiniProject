const mongoose=require('mongoose');
const connection=require('../helper/db')
const Schema=mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const reportimage=new mongoose.Schema({
   
   isreport:Boolean,
   reportuser:String,
   reason:String,
   imageid:mongoose.Schema.Types.ObjectId
  /*posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'uploadimage'
}],*/
}, {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }
})
reportimage.virtual('posts', {
    ref: 'uploadimage',
    localField: 'imageid',
    foreignField: '_id',
    justOne:true
  });


const report=mongoose.model('Reportimage',reportimage);
module.exports=report;