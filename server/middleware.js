const jwt=require('jsonwebtoken');

module.exports=function(req,res,next){
    try {
        let token=req.header('x-token');
        if(!token)
        {
            res.status(400).send("Token not found");
        }
        else{
            let decode=jwt.verify(token,'secret');
            req.user=decode.user;
            next();
        }
    } catch (error) {
        console.log("middleware"+error);
    }
}