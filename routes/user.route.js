const express=require('express')
const userRouter=express.Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const { UserModel } = require('../models/user.model')

userRouter.post('/register', async (req,res)=>{
    const {name,email,gender,password,age,city,is_married}=req.body
    try{
        bcrypt.hash(password, 5, async(err, secure_pass)=>{
            if(err){
                console.log(err);
                res.status(400).send({"msg":"Something went wrong!"})
            }else{
                const user= new UserModel({name,email,gender,password:secure_pass,age,city,is_married})
                await user.save()
                res.status(200).send({"msg":"Registration Done!"})
            }
        })
    }catch(err){
       res.status(400).send({"msg":"Error in registering"})
    }
})

userRouter.post('/login', async (req,res)=>{
    const {email,password}=req.body
    try{
     const user= await UserModel.find({email})
     console.log(user);
     const hashed_pass=user[0].password
     if(user.length>0){
        bcrypt.compare(password, hashed_pass, (err, result)=>{
            if(result){
                const token= jwt.sign({userID:user[0]._id},'odinson')
                res.status(200).send({"msg":"Login Successfull","token":token})
            }else{
                res.status(400).send({"msg":"wrong Credentials"})
            }
        })
     }else{
        res.status(400).send({"msg":"wrong Credentials"})
     }
    }catch(err){
        res.status(400).send({"msg":"Something went wrong"})
    }
})

module.exports={userRouter}