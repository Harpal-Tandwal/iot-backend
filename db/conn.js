const  mongoose  = require('mongoose');
// const DB = process.env.DATABASE;
DB="mongodb+srv://mohit:mohit*123*123@cluster0.svjjbsa.mongodb.net/?retryWrites=true&w=majority"


mongoose.connect(DB,{ 
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(
    ()=>{console.log("connection succcesful");
    }
).catch((err)=>{
    console.log("failed to connect to database")  ;      
    });