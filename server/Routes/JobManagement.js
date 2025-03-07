import express from "express";
import { getAllJobs ,getJobById , searchJob , getCategories, editYourJob , getCategory , postJob ,getYourJobs ,deleteYourJob} from "../Controller/JobManagement.js";
import { ristrictTo } from "../Middlewares/Auth.js";

const router = express.Router();

router.put("/edit_job/:jobId",ristrictTo(["employer","admin"]),editYourJob)

router.get("/search",searchJob);

router.get("/categories",getCategories);

router.get("/category",getCategory);

router.get("/get_your_jobs",ristrictTo(["employer"]),getYourJobs);

router.delete("/delete_your_job",ristrictTo(["employer","admin"]),deleteYourJob);

router.post("/post",ristrictTo(["employer"]),postJob);

router.get("/",getAllJobs);

router.get("/:id",getJobById);



export default router;