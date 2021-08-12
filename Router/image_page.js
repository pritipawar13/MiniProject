// Paginantion : To show the limited number os pages in the database

const express=require('express');
const router=require('express').Router()
const mongoose=require('../helper/db');
const imageModel=require('../model/upload.model')

const port=process.env.PORT ||2005;
router.get('/images',pagenateResult(imageModel),function(req,res){
    res.json(res.pagenateResult)
})

function pagenateResult(imagemodel){
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
        results.results=await imagemodel.find().limit(limit).skip(startindex).exec()
        res.pagenateResult=results;
        next()
   }catch(err){
       res.send(err)
    }
 }
}

module.exports=router
