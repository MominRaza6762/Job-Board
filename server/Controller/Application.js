import Application from "../Models/Application.js";

export const applyForJob = async (req, res) => {
    try {

        const { userId, jobId } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded", success: false });
        }

        const fileUrl = req.file.path;
        const publicId = req.file.filename; 


        const newApplication = new Application({
            job: jobId,
            user: userId,
            fileUrl: fileUrl,
            publicId: publicId 
        });

        await newApplication.save();

        res.status(201).json({ message: "Application submitted successfully", success: true });

    } catch (error) {
        console.error(" Error:", error);
        res.status(500).json({
            message: "Internal Server Error: " + error.message,
            success: false
        });
    }
};

export const checkApplication = async(req , res)=>{
    try
    {
        const {userId , jobId} = req.query;

        if (!userId || !jobId) {
            return res.status(400).json({
                message: "Missing required parameters: userId and jobId",
                success: false
            });
        }

        const application = await Application.findOne({job:jobId , user:userId});
        if(application)
        {
            return res.status(200).json({ message: "User had already applied for this job.", applied:true , success: true });
        }
        return res.status(200).json({ message: "User had not applied for this job.", applied:false , success: true });
     
    }
    catch (error) {
        console.error(" Error:", error);
        res.status(500).json({
            message: "Internal Server Error: " + error.message,
            success: false
        });
    }
}

export const getUserApplications = async(req , res)=>{
    try
    {
        const {userId , pageNo} = req.query;

        const totalApplications = await Application.countDocuments({user:userId});

        const limit = 6;
        const skip = (pageNo -1)*limit;



        const applications =await Application.find({user:userId}).sort({ createdAt: -1 }).select("job").populate("job","title salary category company description").skip(skip).limit(limit);

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

export const getApplicants =async (req , res)=>{
    try
    {
        const {jobId , pageNo} = req.query;

        const totalApplicants = await Application.countDocuments({job:jobId});

        const limit = 6;
        const skip = (pageNo -1)*limit;



        const applicants = await Application.find({job:jobId}).sort({ createdAt: -1 }).select("user fileUrl").populate("user","name email").skip(skip).limit(limit);

        const allApplicantsRetrieved = skip + applicants.length >= totalApplicants;


        res.status(200).json({
            message: "Applicants on given jobId " ,
            success: true,
            totalApplicants,
            allApplicantsRetrieved,
            applicants
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