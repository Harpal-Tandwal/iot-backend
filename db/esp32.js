const mongoose = require("mongoose");

const esp32Schema= mongoose.Schema({
  email:{
    type :String,
    // required:true
  },
  projectName:{
    type:String,
    // required:true
  },
    info:{
      type:Object
    }
    
})
const Esp32= mongoose.model("esp32",esp32Schema);
module.exports = Esp32;