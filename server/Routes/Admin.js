import express from "express";
import { getJobSeekers , getEmployers , getAllApplications , deleteApplications } from "../Controller/Admin.js";
import { ristrictTo } from "../Middlewares/Auth.js";

const router = express.Router();

router.get("/job-seekers",ristrictTo(["admin"]),getJobSeekers);

router.get("/employer",ristrictTo(["admin"]),getEmployers);

router.get("/get_all_applications",ristrictTo(["admin"]),getAllApplications);

router.delete("/del_application",ristrictTo(["admin"]),deleteApplications);

export default router;