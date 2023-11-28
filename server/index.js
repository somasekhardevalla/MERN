const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const jwt=require('jsonwebtoken')
const middleware=require('./middleware')
const UserModel=require('./models/User')
const app=express();
app.use(express.json());
app.use(cors());

 
mongoose.connect("mongodb+srv://username:password@database.qc3pson.mongodb.net/nodejs").then(()=>{
    console.log("db connected")
});


app.get("/getusers",async(req,res)=>{
  const data= await UserModel.find({});
  res.json(data);
  
})
app.get("/",(req,res)=>{
    res.json({"name":"somu","age":20})
   
})



app.post("/adduser",async(req,res)=>{
    const user=req.body;
    const name=user.name;
    const exist=await UserModel.findOne({name})
    
        if(exist)
        {
            return res.status(400).send("User already existed");
        }
        else{
    const newUser=new UserModel(user);
    await newUser.save();
    // console.log(user)

    res.json(user)
        }
})

app.get('/dashboard',middleware,async(req,res)=>{
    try {
        let exist=await UserModel.findById(req.user.id) 
        if(!exist)
        {
          res.status(400).send("Token is invalid");
        }
        else{
           console.log(req.user.id);
            res.json(exist);
        }
        
    } catch (error) {
        console.log(error); 
        res.status(400).send("dashboard catch error")
    }
})

app.post('/login',async(req,res)=>{
    try{
         const {name,age}=req.body
         const exist=await UserModel.findOne({name});
         if(exist)
         { 
               if(age==exist.age)
               {
                // return res.status(200).send("user find");
                let payload={
                    user:{
                        id:exist.id
                    }
                }
                jwt.sign(payload,"secret",{expiresIn:60000},(err,token)=>{
                   try {
                    if(err)
                    {
                        throw err
                    }
                    else{
                        return res.status(200).send({auth:true,token:token})
                    }
                    
                   } catch (error) {
                    console.log(err);
                    return res.status(400).send("Authentication failed")
                   }
                })
               }
               else{
                return res.status(401).send('wrong age')
               }
         }
         else{
            return res.status(400).send("No user found");
         }
    }
    catch(err)
    {
console.log(err);
return res.status(500).send("Internal error");
    }
})

app.get("/:universalURL", (req, res) => { 
    res.send("404 URL NOT FOUND");

}); 


app.listen(3001,()=>{
    console.log("server is runningg");
})