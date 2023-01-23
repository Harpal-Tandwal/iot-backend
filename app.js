const dotenv= require('dotenv'); //package for env file which store my credentials
const express = require('express');
const app = express();
app.use(express.json());
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const path = require("path");
dotenv.config({path:'./config.env'}); // accessing dotenv file 
const cors = require("cors")

const PORT = process.env.PORT ||5000; // accessing  credentials from env file

require('./db/conn'); // requiring database connection info
app.enable('trust proxy');
app.use(
  cors({
      origin: req.headers.origin,
      credentials: true,
      exposedHeaders: ["set-cookie"],
     }),
);

// app.use(function (req, res, next) {
//      res.header("Access-Control-Allow-Credentials", "true");
//      res.header('Access-Control-Expose-Headers', "Set-Cookie");
     
//      res.header("Access-Control-Allow-Origin", req.headers.origin);
//      res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
// //      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With,X-HTTP-Method-Override, Content-Type, withCredentials,Set-Cookie,Access-Control-Request-Method, Access-Control-Request-Headers");

//    next();
// })

const auth = require ('./router/auth');
app.use(auth);

app.get("/", (req, res) => {
    console.log(req.body);
    res.send("your are using hptech iot services")
    
  //  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    // res.sendFile("C:\Users\Dell\Desktop\project\mernProjectThapa\HpTech-iot-platform\client\public\index.html");
    
})

// if ( process.env.NODE_ENV == "production"){

//     app.use(express.static("client/build"));
//     // ...
//     const path = require("path");

//     app.get("*", (req, res) => {
    
//             res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
            
//         })
    
//     }



app.listen(PORT,()=>{

    console.log(`server is on ON port ${PORT}`);
})
