import bcrypt from "bcrypt";
import Application from "../Models/Application.js";
import User from "../Models/User.js";
import { setJwtUser } from "../Services/jwt.js";
import { v2 as cloudinary } from "cloudinary";

export const signInUser = async(req , res)=>{
    try
    {
        const {email , password} = req.body.formData;
        const user = await User.findOne({email:email})
        if(!user)
        {
            return res.status(400).json({message:"Email or Password is wrong" ,
                success:false})
        }
        const isValid = await bcrypt.compare(password,user.password);

        if(!isValid)
        {
            return res.status(400).json({message:"Email or Password is wrong" ,
                success:false})
        }
        
            const token = setJwtUser(user);
            const role = user.role;
            res.status(200).json({message:"User Log In Successfully" ,token:token,role,
                success:true})
        
     
    }
    catch(error)
    {
        res.status(500).json({message:"Internel Sever Error:" + error.message,
            success:false
        });
    }    
}

export const signUpUser = async(req , res )=>{
    try
    {
        const {name , email , role ,checkBox, password} = req.body;
        const existEmail = await User.findOne({email:email});
        if(existEmail)
        {
            return res.status(400).json({message:"You are Already Registerd , You need To Sign In",
                success:false
            });
        }

        const hashedPassword =await bcrypt.hash(password,10);
        const newUser = new User({
            name:name,
            email:email,
            role:role,
            agreed_to_terms:checkBox,
            password:hashedPassword
        })

        await newUser.save();

        res.status(201).json({message:"Successfully Signed Up",
            success:true
        });
     
    }
    catch(error)
    {
        res.status(500).json({message:"Internel Sever Error:" + error.message,
            success:false
        });
    }
}

export const getUser =(req , res)=>{
    res.status(200).json({message:"Successfully get user",
        success:true , user:req.user
    });
}


export const updateUser = async(req , res)=>{
    try
    {
        const {userId ,name  ,email} = req.body.data;


        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                success: false
            });
        }
        const updateFields = {};
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update",
                success: false
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        
        const token = setJwtUser(updatedUser);

        res.status(200).json({
            message: "User updated successfully",
            success: true,
            token: token
        });
     
    }
    catch (error) {
        console.error(" Error:", error);
        res.status(500).json({
            message: "Internal Server Error: " + error.message,
            success: false
        });
    }
}

export const deleteUser = async(req , res)=>{
    try
    {
        const {userId} = req.body;
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                success: false
            });
        }

        const applications = await Application.find({user:userId});
            if (applications.length > 0) {
                await Promise.all(
                    applications.map((application)=>{
                        return   cloudinary.uploader.destroy(application.publicId, { resource_type: "raw" })
                    })
                )

                await Application.deleteMany({ user: userId }); 
            }
         
        const user = await User.findByIdAndDelete(userId);
        if(!user)
        {
            return res.status(404).json({
                message: "User not Found with this User Id " ,
                success: false
            })
        }

        res.status(200).json({
            message: "User deleted successfully " ,
            success: true
        })
     
    }
    catch (error) {
        console.error(" Error:", error);
        res.status(500).json({
            message: "Internal Server Error: " + error.message,
            success: false
        });
    }
}

export const changeUserPassword = async(req , res)=>{
    try
    { 
        const {userId , oldPassword , newPassword} = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" , success: false});
          }
          const isMatch = await bcrypt.compare(oldPassword, user.password);
          if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" , success: false });
          }
        
          user.password = await bcrypt.hash(newPassword,10);
          await user.save();
          res.status(200).json({ message: "Password updated successfully", success: true });
     
    }
    catch (error) {
        console.error(" Error:", error);
        res.status(500).json({
            message: "Internal Server Error: " + error.message,
            success: false
        });
    }

}