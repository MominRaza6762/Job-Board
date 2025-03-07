import { Helmet } from "react-helmet-async";
import { Link, replace, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../MyComponents/Navbar";
import { useBackEndApi } from "../Contexts/BackEndApi";
import { useEffect, useState } from "react";
import Footer from "../MyComponents/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import "../assets/JobPage.css";
import { useUserData } from "../Contexts/UserData";
import Apply from "../MyComponents/Apply";
import EditJob from "../MyComponents/EditJob";

export default function JobPage() {
  const [applied , setApplied] = useState(false)
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyPage, setShowApplyPage] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const { id } = useParams();
  const backEndApi = useBackEndApi();
  const {userData} = useUserData();

  const getJob = async () => {
    const toastId = toast.loading("Fetching job details...");
    try {
      const response = await axios.get(`${backEndApi}/jobs/${id}`);
      if (response.status === 200) {
        setJobData(response.data.job);
        toast.dismiss(toastId); 
      } else if (response.status === 204) {
        console.log("No job found with this id");
        toast.dismiss(toastId);
        toast.info("No job found.");
      }
    } catch (error) {
      console.error("Error while getting job", error.message);
      toast.dismiss(toastId);
      toast.error("Failed to fetch job details.");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async()=>{
    try
    { var toastId = toast.loading("Deleting job...")
      await axios.delete(`${backEndApi}/jobs/delete_your_job`, {
        data: { jobId: jobData._id }, 
        headers: { "Authorization": localStorage.getItem("token") }
      });
      localStorage.setItem("toastMessage", "Your job sussessfully deleted...");
      localStorage.setItem("toastType", "success");
      setTimeout(() => {
        navigate("/posted_job", replace)
      }, 1000);

    }
    catch(error)
    {
      toast.dismiss(toastId);
      toast.error("Error while deleting your job")
        console.error("Error while deleting your",error.message);
    }
  }

  

  const checkApplication = async()=>{
    try
    {
      const response = await axios.get(`${backEndApi}/application/check`,{
        params:{
          userId:userData.userId ,
           jobId:id},
        headers:{
          "Authorization":localStorage.getItem("token")
        }
      })     
      if(response.data.applied)
      {
        setApplied(true);
      }
    }
    catch(error)
    {
        console.error("Error While checking application",error.message);
    }
  }

 


  useEffect(() => {
    if(!showEditPage)
    {
      getJob();
    }
    if(userData.role==="job-seeker")
    {
      checkApplication();
    }
  }, [showEditPage]);

  
  return (
    <>
      <ToastContainer /> 
      <div className="jobPage">
        <Navbar />
        {showEditPage?(<EditJob job ={jobData} onClose={()=>setShowEditPage(false)}/>):<>
        {showApplyPage?(
          <Apply job ={jobData} onClose={()=>setShowApplyPage(false)}/>
        ):(<>
        {loading ? (
          <div className="jobDetails">Loading...</div>
        ) : jobData ? (
          <div className="jobDetails">
            <Helmet>
              <title>{`${jobData.title} Job Details - Find detailed information about job openings and apply now!`}</title>
              <meta
                name="description"
                content={`Find detailed information about ${jobData.title} job openings and apply now!`}
              />
            </Helmet>
            <h1>{jobData.title}</h1>
            <span>{jobData.category}</span>
           
           {userData.role==="employer"?<>
           {jobData.postedBy === userData.userId?<div className="employerButtons"><div className="applyButton delete-btn" onClick={handleDelete}>Delete</div> <div className="applyButton edit-btn" onClick={()=>setShowEditPage(true)}>Edit</div><Link to={`/applicants_list/${jobData._id}`} className="applyButton">View Applicants</Link></div>:null}
           </>:
           <div onClick={userData.auth?
            applied?null:()=>setShowApplyPage(true)
            :()=>{
            localStorage.setItem("toastMessage", "Sign in to apply...");
            localStorage.setItem("toastType", "info");
             navigate("/signin")
           }} className={`applyButton ${applied?"applied":null}`}>{applied?"Applied":"Apply"}</div>} 

            <div className="salary">{jobData.salary} PKR</div>
            <div className="company">
              <img src="/svg/company.svg" alt="company" />
              <span>{jobData.company}</span>
            </div>
            <h3>Job Description</h3>
            <pre>{jobData.description}</pre>
          </div>
        ) : (
          <div className="jobDetails">No job found.</div>
        )}        
        </>)}
        </>}
        

        

        <Footer />
      </div>
    </>
  );
}
