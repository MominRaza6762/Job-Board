import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    role:{type:String , default:"job-seeker", enum:['admin','employer','job-seeker']},
    agreed_to_terms:{type:Boolean, default:false},
    password:{type:String,required:true},
},{timestamps:true});

export default mongoose.model('User',userSchema);