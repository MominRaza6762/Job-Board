import "../assets/ApplicationPage.css";
import { useEffect, useRef, useState } from "react";
import { useBackEndApi } from "../Contexts/BackEndApi";
import axios from "axios";
import { ToastContainer , toast } from "react-toastify";
import { replace, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AdminJob from "./AdminJob";

export default function ApplicationsList() {
  const navigate =  useNavigate();
  const backEndApi = useBackEndApi();
  const [showJob , setShowJob] = useState({show:false})

  const [applications, setApplications] = useState([]);
  const [allApplicationsRetrieved , setAllApplicationsRetrieved] = useState(false);
  const [notFoundFlag ,setNotFoundFlag] = useState(false);

  const pageNo = useRef(0);

  const getApplications = async()=>{
    try
    {
      pageNo.current++;
      var toastId = toast.loading("Loading applications...")
      const response = await axios.get(`${backEndApi}/admin/get_all_applications`, { params: { pageNo: pageNo.current },
      headers:{"Authorization":localStorage.getItem("token")} });

      if(response.data.applications.length>0)
      {
        if(pageNo.current === 1)
        {
            setApplications(response.data.applications)
        }
        else
        {

            setApplications([...applications, ...response.data.applications])
        }
      }

      if(response.data.totalApplications===0 && response.data.
        allApplicationsRetrieved)
        {
          setNotFoundFlag(true);
        }
        if(response.data.allApplicationsRetrieved)
        {
          setAllApplicationsRetrieved(true);
        }

    }
    catch(error)
    {
        console.error("Error While getting applications...",error);
        setTimeout(()=>{
          navigate("/server_error", replace)

        },1000)
    }
    finally{
      toast.dismiss(toastId)
    }
  }

  const handleDelete = async(applicationId)=>{
    try
    { var toastId = toast.loading("Deleting Application...")
      await axios.delete(`${backEndApi}/admin/del_application`, {
        data: { applicationId: applicationId }, 
        headers: { "Authorization": localStorage.getItem("token") }
      });
      toast.dismiss(toastId);
      toast.success("Application deleted successfully...");
      pageNo.current = 0;

           setTimeout(() => {
            getApplications();
      }, 1000);

    }
    catch(error)
    {
      toast.dismiss(toastId);
      toast.error("Error while deleting Application")
        console.error("Error while deleting Application",error.message);
    }
  }


  useEffect(()=>{
    getApplications();
  },[])




  return (<>
      <ToastContainer/>
      {showJob.show?<AdminJob showJob={showJob} setShowJob={setShowJob}/>:<>
      <div className="applications-container">
      <Helmet>
        <title>Applications List  </title>
      </Helmet>
      <div className="tableContent">
      <h1 className="applications-title">Applications List</h1>
      {notFoundFlag?<div>No applicants found on this job</div>:<div className="applications-content">
        <div className="applications-header">
          <span className="header-item">Name</span>
          <span className="header-item">Email</span>
          <span className="header-item">Job</span>
          <span className="header-item">Resume</span>
          <span className="header-item">Delete Application</span>
        </div>
        <div className="applications-list">
        {applications.map((application)=>{
                return  <div key={application._id}  className="job-row" >
                <span className="job-item">{application.user?.name}</span>
                <span className="job-item">{application.user?.email}</span>
                <span onClick={()=>setShowJob({show:true, jobId:application.job._id})} className="job-item"
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(0.9)"}
                    >{application.job?.title}</span>
                <a target="_blank" rel="noopener noreferrer" href={application?.fileUrl} className="job-item"><img src="/svg/resume.svg" alt="resume" /></a>
                <span  className="job-item"><img
                onClick={()=>handleDelete(application._id)}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(0.9)"} src="/svg/deleteapplication.svg" alt="deleteApplication" /> </span>
              </div>
            })}
        </div>
      </div>}
      

      {notFoundFlag?null:<button onClick={allApplicationsRetrieved?null:()=>getApplications()} className={`load-more-btn ${allApplicationsRetrieved?"no-more":null}`}>{allApplicationsRetrieved?"No more":"Load More"}</button>}
      </div>
      
    </div>
      </>}
    
    </>);
}
