const jwt = require('jsonwebtoken');
const User = require("../db/userSchema");

const SECRET_KEY="HEYTHISISASECRETKEYFORJWTTOKEN123456788HJHKJNBJHBJB9"

const Authenticate = async (req, res,next)=>{
    try{
        // console.log("cookie =",req.cookies)
        const token = req.cookies.jwtoken;
        const  verifyToken = jwt.verify(token,SECRET_KEY);
      const rootUser = await User.findOne ({_id:verifyToken._id,"tokens:token":token})
   if(!rootUser)
   throw new Error ("user not found");

   req.token= token;
   req.rootUser =rootUser;
   req.userID= rootUser._id;
   next();
   
    }catch(err){
        res.status(401).send("unauthorized");
        console.log(err);
    }
}

module.exports=Authenticate;