import User from "../Models/User.js";
import Application from "../Models/Application.js";
import { v2 as cloudinary } from "cloudinary";

export const getJobSeekers = async(req , res)=>{
     try
        {
            const { pageNo} = req.query;
    
            const totalJobSeekers = await User.countDocuments({role:"job-seeker"});
    
            const limit = 6;
            const skip = (pageNo -1)*limit;
    
            const jobSeekers =await User.find({role:"job-seeker"}).sort({ createdAt: -1 }).skip(skip).limit(limit);
    
            const allJobSeekersRetrieved = skip + jobSeekers.length >= totalJobSeekers;
    
    
            res.status(200).json({
                message: "Job Seekers " ,
                success: true,
                totalJobSeekers,
                allJobSeekersRetrieved,
                jobSeekers
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

export const getEmployers = async(req , res)=>{
    try
    {
        const { pageNo} = req.query;

        const totalEmployers = await User.countDocuments({role:"employer"});

        const limit = 6;
        const skip = (pageNo -1)*limit;

        const epmloyers =await User.find({role:"employer"}).sort({ createdAt: -1 }).skip(skip).limit(limit);

        const allEmployersRetrieved = skip + epmloyers.length >= totalEmployers;


        res.status(200).json({
            message: "Job Seekers " ,
            success: true,
            totalEmployers,
            allEmployersRetrieved,
            epmloyers
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

export const getAllApplications = async(req ,res)=>{
    try
    {
        const { pageNo} = req.query;

        const totalApplications = await Application.countDocuments();

        const limit = 6;
        const skip = (pageNo -1)*limit;



        const applications = await Application.find().sort({ createdAt: -1 }).select("user job fileUrl").populate("user job","name email title").skip(skip).limit(limit);

        const allApplicationsRetrieved = skip + applications.length >= totalApplications;


        res.status(200).json({
            message: "Applications with given User " ,
            success: true,
            totalApplications,
            allApplicationsRetrieved,
            applications
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

export const deleteApplications = async(req , res)=>{
    try
            {
                const {applicationId} = req.body;
                if (!applicationId) {
                    return res.status(400).json({
                        message: "Application Id is required",
                        success: false
                    });
                }
                const application = await Application.findById(applicationId);
                if (application) {
                    await cloudinary.uploader.destroy(application.publicId, { resource_type: "raw" });
                }
                
                await Application.findByIdAndDelete(applicationId); 
                res.status(200).json({
                    message: "Application deleted successfully " ,
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
