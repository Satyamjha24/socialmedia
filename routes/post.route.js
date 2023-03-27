const express=require('express')
const jwt=require('jsonwebtoken')
const { PostModel } = require('../models/post.model')
const postRouter=express.Router()

postRouter.get('/', async (req,res)=>{
    let min=req.query.min 
    let max=req.query.max
    const token=req.headers.authorization
    const decoded=jwt.verify(token,'odinson')
    try{
        if(decoded){
            if(min && max){
                const post=await PostModel.find({$and:[{no_of_comments:{$gt:min}},{no_of_comments:{$lt:max}}]})
                res.status(200).send(post)
            }else{
                const post=await PostModel.find({'userID':decoded.userID})
                res.status(200).send(post)
            }
           
        }
    }catch(err){
        res.status(400).send({"msg":err.message})
    }
})

postRouter.post('/add', async (req,res)=>{
    try{
        let post=new PostModel(req.body)
        await post.save()
        res.status(200).send({"msg":"New post added"})
    }catch(err){
        res.status(400).send({"msg":err.message})
    }
})

postRouter.patch('/update/:id', async (req,res)=>{
    const payload=req.body
    const id=req.params.id
    const post=await PostModel.findOne({"_id":id})
    const idInPost=post.userID
    const id_requesting=req.body.userID
    try{
      if(id_requesting!==idInPost){
        res.status(400).send({"msg":"You are not authorized"})
      }else{
        await PostModel.findByIdAndUpdate({'_id':id}, payload)
        res.status(200).send({'msg':'Updated the post'})
      }
    }catch(err){
        console.log(err);
        res.status(400).send({'msg':'Something went wrong'})
    }
})

postRouter.delete('/delete/:id', async (req,res)=>{
    const id=req.params.id
    const post=await PostModel.findOne({"_id":id})
    const idInPost=post.userID
    const id_requesting=req.body.userID
    try{
      if(id_requesting!==idInPost){
        res.status(400).send({"msg":"You are not authorized"})
      }else{
        await PostModel.findByIdAndDelete({'_id':id})
        res.status(200).send({'msg':'Deleted the post'})
      }
    }catch(err){
        console.log(err);
        res.status(400).send({'msg':'Something went wrong'})
    }
})

module.exports={postRouter}