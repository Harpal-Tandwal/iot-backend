const express= require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const authenticate = require("../middleware/authenticate")
require('../db/conn');
const User = require ("../db/userSchema");
const Esp = require('../db/esp32');
const { application } = require('express');
router.post('/register', async (req,res)=>{
    //object desctrcturing
    console.log(req.body);
    const {name ,email ,phone, work,password, cpassword}= req.body
    //checking all the fields are present or not
  
    if(!name || !email || !phone || !work || !password || !cpassword ){
      
         return res.status(422).json({err:"please fill all the filed correctly"});
    } 
    
    // if(typeof phone != "number")
    //  { console.log("i run")
    //  phone = parseInt(phone);
     console.log(typeof phone);
    //   return res.status(422).json({err:"enter phone number correctly"});
    //   }
 
    try{
       const userExists = await User.findOne({email:email})
        if (userExists)
               {
                 return res.status(422).json({err: "email already exists"});
               }
     const user = new User({name , email, phone , work, password , cpassword})
      
      const userRegister = user.save()
      if (userRegister){
        res.status(200).json({message:"user registered"});
      }
      else{
        res.status(500).json({err:"failed to register"})

      }
    }
    catch(err){
        console.log(err);
    }
     

    // console.log(req.body.name);
    // res.status(200).send(req.body);
})

// login route

router.post("/signin", async(req,res)=>{
    // console.log(req.body);
    // res.json({msg:"req.body"})

    try{
        const {email,password} =req.body;

        if(!email || !password)
        { return res.status(400).json({err:"invalid credentials"})}
       
        const userLogin = await User.findOne({email:email})

        if(!userLogin)
        {  res.status(400).json({err:"your are not registered"});
        return;
        }

        const isMatch = await bcrypt.compare(password,userLogin.password);
        const token = await userLogin.generateAuthToken();
        console.log(token);
            //  storing the token in cookeis

            res.cookie("jwtoken", token,{
              // domain :"https://hptech-v16r.onrender.com",
              // path:"/",
             expires: new Date(Date.now()+ 1766400000), // expire after 30 days
             sameSite: 'none', 
             secure: true// its to allow addition on http (by default addition of token is done on https)
            })
        if(!isMatch)
        {  res.status(400).json({msg:"invalid password"});
        }else{
            res.status(200).json({msg:"your are logged in"});
        }
      }
     catch(err){
        console.log(err);

    }
})

router.get("/aboutme",authenticate,(req,res)=>{
  console.log("hii from about")
  res.send(req.rootUser);


})

router.post("/createproject", async (req,res)=>{
  try{
    console.log(req.body);
    const {email, projectName} = req.body;
    
    if(!email && !projectName)
    { return res.status(400).json({err:"unique key  or project name is invalid"})}

    const projectExists = await Esp.findOne({email,projectName})
   if(projectExists)
   {
    return res.status(422).json({err: "project already exists"});
   }
   
   const esp = new Esp({email,projectName,info:[{"data":"nothing to show"}] })
       

   const created = esp.save()
   if (created){
     res.status(200).json({message:"new project created succesfully"});
   }
   else{
     res.status(500).json({err:"failed to create project"})

   }

  }
  catch(err){
    console.log(err)
  }
console.log(req.body)


})


// ****************************save esp32 data***********


router.post("/espsave", async (req,res)=>{
  try{
    // console.log(req.body);
    const {key,data} = req.body;
    console.log("data posted...",data)
    
    if(!key)
    { return res.status(400).json({err:"invalid unique key"})}

// const field = Esp.info.concat({data})
  
  const updated =  Esp.findOneAndUpdate({_id:key}, { info:data},(err,data)=>{
    if(err){
      console.log("error:.... ",err);
    }else{
      console.log(" updated data...",data);
    }
  })
   if (updated)
   {
     res.status(200).json({message:"data updated succesfully"});
    }
   else{
     res.status(500).json({err:"failed to update data"})
     }

  
   
   return res.status(422).json({err: " this project not exists"});
   
   

  }
  catch(err){
    console.log(err)
  }
// console.log(req.body)


})
//******************************** */

router.get("/showprojects", async(req,res)=>{

  const token = req.cookies.jwtoken;
        const  verifyToken = jwt.verify(token,process.env.SECRET_KEY);
        const rootUser = await User.findOne ({_id:verifyToken._id,"tokens:token":token})
        const {email}=rootUser
        console.log(email)
        const data = await Esp.find({email})
        console.log(data);
        if(verifyToken){
        //  Esp.find({email}, function(err, data){
          console.log(">>>> " + data );
          res.status(200).json(data)
        // })
      }else{
          res.status(400).json({ERR:" ERROR OCCURED"}) ;
        }
        
      });
      
///*******************TO UPDATE A PARTICULAR FIELD OF PROJCT DATA */
  router.post("/updateone",(req,res)=>{
    console.log(req.body)
    
    const{key,field,presentValue,newValue}= req.body;
    const info_fieldname =  'info'+'.'+field;
    const updating_fieldname =  'info\.$\.'+field
    
   const updated =  Esp.findOneAndUpdate({_id:key,[info_fieldname] :presentValue}, { $set:{[updating_fieldname]:newValue}},(err,data)=>{
    if(err){
      console.log("error:.... ",err);
    }else{
      console.log(" updated data...",data);
    }
  })
   if (updated)
   {
     res.status(200).json({message:"data updated succesfully"});
    }
   else{
     res.status(500).json({err:"failed to update data"})
     }
  })


router.post("/project_status", async(req,res)=>{
  try{const{key}=req.body;
  console.log(key)
   const s=  await Esp.find({_id:key})
   console.log(s);
   res.status(200).json(s);
  }catch(err){
    
    console.log(err);

  }


})


module.exports = router;
