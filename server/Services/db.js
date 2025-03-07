import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("MongoDb Connected Successfully....")
}).catch((error)=>{
    console.log("Error While Connecting MongoDb : ",error);
})