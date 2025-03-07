import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{type:mongoose.Schema.Types.ObjectId , ref:"Job", required:true},
    user:{type:mongoose.Schema.Types.ObjectId , ref:"User", required:true},
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
},{timestamps:true});

export default mongoose.model("Application", applicationSchema);