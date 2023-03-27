const express=require('express')
const { connection } = require('./db')
const { Auth } = require('./middleware/auth.middleware')
const { postRouter } = require('./routes/post.route')
const { userRouter } = require('./routes/user.route')
const cors=require('cors')
require('dotenv').config()

const app=express()

app.use(cors())
app.use(express.json())

app.get('/', (req,res)=>{
    res.status(200).send("Welcome To Homepage")
})

app.use('/users', userRouter)
app.use(Auth)
app.use('/posts', postRouter)


app.listen(process.env.port, async()=>{
      try{
        await connection
        console.log('Connected to DB');
      }catch(err){
        console.log(err);
        console.log("Something went wrong");
      }
       console.log(`Server is running on port ${process.env.port}`);
})