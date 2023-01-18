const jwt = require ('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const userSchema = new Schema ({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }, 
     phone:{
        type:Number,
        required:true
    },
    work:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[
        {token:{
            type:String,
            required:true
        }}
    ]

    // ************* testing for mixed schema *********** result :- succesfull********
    // data:{ 
    //     type:Object
    // }
})

//hashing of password
userSchema.pre('save', async function(next){
    // console.log("hashing is called")
if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password,12);
    this.cpassword = await bcrypt.hash(this.cpassword,12);

}
next();
});

// genarate token
userSchema.methods.generateAuthToken = async function (){
    try{
let token =  jwt.sign({_id:this._id}, process.env.SECRET_KEY);
this.tokens   =this.tokens.concat({token:token})
await this.save();
return token;
}
    catch(err){
        console.log(err);

    }
}




const User = mongoose.model("user", userSchema);
module.exports= User;
