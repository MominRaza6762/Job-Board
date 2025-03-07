import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Config/Cloudinary.js";
import {applyForJob , getUserApplications , checkApplication , getApplicants} from "../Controller/Application.js";
import { ristrictTo } from "../Middlewares/Auth.js";

const router =express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const allowedFormats = ["pdf", "doc", "docx"];
        const fileExtension = file.originalname.split(".").pop().toLowerCase();
    
        if (!allowedFormats.includes(fileExtension)) {
            throw new Error("Invalid file format. Only PDF, DOC, and DOCX are allowed.");
        }
    
        return {
            folder: "job-applications-documents",
            resource_type: "raw", 
            format: fileExtension 
        };
    }
});


const upload = multer({storage:storage,
    limits: { fileSize: 1 * 1024 * 1024 } });

    router.post("/upload", ristrictTo(['job-seeker']), upload.single("document"), applyForJob);

    router.get("/check",ristrictTo(['job-seeker']),checkApplication);

    router.get("/get_user_applications",ristrictTo(['job-seeker']),getUserApplications)

    router.get("/get_applicants",ristrictTo(['employer', "admin"]),getApplicants)

    



export default router;