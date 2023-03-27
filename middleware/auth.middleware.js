const jwt=require('jsonwebtoken')

const Auth=(req,res,next)=>{
    const token=req.headers.authorization
    if(token){
        const decoded=jwt.verify(token, 'odinson')
        if(decoded){
            const userID=decoded.userID
            req.body.userID=userID
            next()
        }else{
            res.status(400).send({"msg":"Please login first"})
        }
    }else{
        res.status(400).send({"msg":"Please login first"})
    }
}

module.exports={Auth}