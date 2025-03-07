import Job from "../Models/Job.js";
import Application from "../Models/Application.js";
import { v2 as cloudinary } from "cloudinary";

export const getJobById = async(req ,res)=>{
    try
    {
        
        const job = await Job.findById(req.params.id);
        if(!job)
            {
                return res.status(204).json({message:"No Job Found with this id ",success:true})
            }
        res.status(200).json({message:"Successfully Get Job",success:true,job:job})     
    }
    catch(error)
    {
        res.status(500).json({message:"Internal Sever Error:" + error.message,
            success:false
        });
    }
}


export const getCategories = async(req , res)=>{
    try
    {
        const allCategories = await Job.distinct("category");
        if(allCategories.length === 0)
            {
                return res.status(200).json({message:"No Category Found",success:true})
            }

            res.status(200).json({message:"Categories Found",success:true, allCategories:allCategories})
    }
    catch(error)
    {
        res.status(500).json({message:"Internal Sever Error:" + error.message,
            success:false
        });
    }
}

export const getCategory = async (req , res)=>{
    try
    {
        const { category , page } = req.query;
        const limit = 6;
        const skip =(page - 1)* limit;

        const totalCountOfThisCategory = await Job.countDocuments({category:category});

        const categoryList = await Job.find({category:category}).sort({ createdAt: -1 }).skip(skip).limit(limit);

        const allCategoryRetrieved = skip + categoryList.length >= totalCountOfThisCategory;
        

            res.status(200).json({message:"Category List Found",success:true, categoryList:categoryList,totalCountOfThisCategory:totalCountOfThisCategory,allCategoryRetrieved:allCategoryRetrieved})
     
    }
    catch(error)
    {
        res.status(500).json({message:"Internal Sever Error:" + error.message,
            success:false
        });
    }
}

export const getAllJobs = async(req , res)=>{
    try
    {
        const page = req.query.page ;
        const limit = 6;
        const skip =(page - 1)* limit;

        const totalJobs = await Job.countDocuments();

        const jobList = await Job.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        const allJobRetrieved = skip + jobList.length >= totalJobs;


        res.status(200).json({message:"Successfully Get Jobs",success:true,jobList:jobList , totalJobs:totalJobs , allJobRetrieved:allJobRetrieved})      
    }
    catch(error)
    {
        res.status(500).json({message:"Internal Sever Error:" + error.message,
            success:false
        });
    }
}

export const searchJob = async(req , res)=>{
    try
    {   
        const { keywords ,page } = req.query;
        

        const words =keywords.split(" ").filter((keyword)=>keyword!=="");
        
        const searchQuery = {
            $or : words.flatMap((word)=>{
                return [
                    {title :{$regex:word , $options:"i"}},
                    {company :{$regex:word , $options:"i"}},
                    {description :{$regex:word , $options:"i"}}
            ]}
        )
        };

        const totalResults = await Job.countDocuments(searchQuery);
        
        const limit = 6;
        const skip =(page - 1)* limit;



        const searchResult = await Job.find(searchQuery).sort({ createdAt: -1 }).skip(skip).limit(limit);
        
        const allResultRetrieved = skip + searchResult.length >= totalResults;

        res.status(200).json({message:"Search Result Found",success:true, searchResult:searchResult,allResultRetrieved:allResultRetrieved,totalResults:totalResults});

    }
    catch(error)
    {
        res.status(500).json({message:"Internal Sever Error:" + error.message,
            success:false
        });
    }
}

export const postJob = async(req , res)=>{
    try
    {
        const {title ,description,salary,category,company,postedBy} = req.body;
        const numberSalary = Number(salary); 
        
        const newJob = new Job({
            title:title,
            description:description,
            salary:numberSalary,
            category:category,
            company:company,
            postedBy:postedBy
        })
        await newJob.save();
        res.status(201).json({message:"Job Posted Successfully",
            success:true
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

export const getYourJobs = async(req , res)=>{
    
   
    try
    {
        const {userId , pageNo} = req.query;

        const totalPostedJobs = await Job.countDocuments({postedBy:userId});

        const limit = 6;
        const skip = (pageNo -1)*limit;



        const postedJobs =await Job.find({postedBy:userId}).sort({ createdAt: -1 }).skip(skip).limit(limit);

        const allPostedJobsRetrieved = skip + postedJobs.length >= totalPostedJobs;


        res.status(200).json({
            message: "Posted Jobs " ,
            success: true,
            totalPostedJobs,
            allPostedJobsRetrieved,
            postedJobs
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

export const deleteYourJob = async(req , res)=>{
    try
        {
            const {jobId} = req.body;
            if (!jobId) {
                return res.status(400).json({
                    message: "Job Id is required",
                    success: false
                });
            }
            const applications = await Application.find({job:jobId});
            if (applications.length > 0) {
                await Promise.all(
                    applications.map((application)=>{
                        return   cloudinary.uploader.destroy(application.publicId, { resource_type: "raw" })
                    })
                )
                await Application.deleteMany({ job: jobId }); 
            }
    
            const job = await Job.findByIdAndDelete(jobId);
            if(!job)
            {
                return res.status(404).json({
                    message: "Job not Found with this job Id " ,
                    success: false
                })
            }
    
            res.status(200).json({
                message: "Job deleted successfully " ,
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

export const editYourJob = async(req , res)=>{
    try
    {
        const {jobId} = req.params;
        const dataToUpdate = req.body;


        if (!jobId) {
            return res.status(400).json({
                message: "job Id is required",
                success: false
            });
        }
       

        const updatedJob = await Job.findByIdAndUpdate(jobId, dataToUpdate, { new: true });

        if (!updatedJob) {
            return res.status(404).json({
                message: "job not found",
                success: false
            });
        }

        

        res.status(200).json({
            message: "User updated successfully",
            success: true,
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