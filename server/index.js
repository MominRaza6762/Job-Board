import express from "express";
import cors from "cors";
import "./Services/db.js"
import dotenv from "dotenv";
import JobManagementRouter from "./Routes/JobManagement.js"
import UserRouter from "./Routes/User.js";
import ApplicationRouter from "./Routes/Application.js"
import AdminRouter from "./Routes/Admin.js";
import { checkAuth  } from "./Middlewares/Auth.js";
dotenv.config();

const PORT = process.env.PORT || 8000;

const app =express();
app.use(cors({
    origin: "https://job-board-client-delta.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))
app.use(express.json());


app.use(checkAuth);
app.use("/user",UserRouter);
app.use("/jobs",JobManagementRouter);
app.use("/application",ApplicationRouter);
app.use("/admin",AdminRouter);


app.get('/',(req,res)=>{res.send("Test Successfully")})
app.listen(PORT,()=>{
    console.log(`app is running at http://localhost:${PORT}`)
})
