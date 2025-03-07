import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    salary:{type:Number,required:true},
    category:{type:String,required:true},
    company:{type:String,required:true},
    postedBy:{type:mongoose.Schema.ObjectId, ref:"User", required:true}
},{timestamps:true})

export default mongoose.model("Job",jobSchema);