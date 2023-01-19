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
app.use(cors({origin: "https://hptech.onrender.com"}))

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
