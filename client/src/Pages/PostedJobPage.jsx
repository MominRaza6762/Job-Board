import Navbar from "../MyComponents/Navbar";
import Footer from "../MyComponents/Footer";
import "../assets/ApplicationPage.css";
import { useEffect, useRef, useState } from "react";
import { useUserData } from "../Contexts/UserData";
import { useBackEndApi } from "../Contexts/BackEndApi";
import axios from "axios";
import { ToastContainer , toast } from "react-toastify";
import JobRow from "../MyComponents/JobRow";
import { replace, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function PostedJobPage() {
  const navigate =  useNavigate();
  const {userData} = useUserData();
  const backEndApi = useBackEndApi();

  const [postedJobs, setPostedJobs] = useState([]);
  const [allPostedJobsRetrieved , setAllPostedJobsRetrieved] = useState(false);
  const [notFoundFlag ,setNotFoundFlag] = useState(false);

  const pageNo = useRef(0);

  const getPostedJobs = async()=>{
    try
    {
      pageNo.current++;
      var toastId = toast.loading("Loading your posted jobs...")
      const response = await axios.get(`${backEndApi}/jobs/get_your_jobs`, { params: { pageNo: pageNo.current, userId: userData.userId },
      headers:{"Authorization":localStorage.getItem("token")} });

      if(response.data.postedJobs.length>0)
      {
        setPostedJobs([...postedJobs, ...response.data.postedJobs])
      }

      if(response.data.totalPostedJobs===0 && response.data.
        allPostedJobsRetrieved)
        {
          setNotFoundFlag(true);
        }
        if(response.data.allPostedJobsRetrieved)
        {
          setAllPostedJobsRetrieved(true);
        }

    }
    catch(error)
    {
        console.error("Error While loading Your Posted jobs..",error);
        setTimeout(()=>{
          navigate("/server_error", replace)

        },1000)
    }
    finally{
      toast.dismiss(toastId)
    }
  }
  


  useEffect(()=>{
    getPostedJobs()
  },[])



  return (
    <div className="applications-container">
      <Helmet>
        <title>Your Posted Jobs List </title>
      </Helmet>
      <Navbar />
      <ToastContainer/>
      <div className="tableContent">
      <h1 className="applications-title">Your Posted Jobs</h1>
      {notFoundFlag?<div>No applications found</div>:<div className="applications-content">
        <div className="applications-header">
          <span className="header-item">Title</span>
          <span className="header-item">Category</span>
          <span className="header-item">Company</span>
          <span className="header-item">Salary</span>
          <span className="header-item">Description</span>
        </div>
        <div className="applications-list">
          {postedJobs.map((job) => (
            <JobRow  key={job._id} job={job} />
          ))}
        </div>
      </div>}
      

      {notFoundFlag?null:<button onClick={allPostedJobsRetrieved?null:()=>getPostedJobs()} className={`load-more-btn ${allPostedJobsRetrieved?"no-more":null}`}>{allPostedJobsRetrieved?"No more":"Load More"}</button>}
      </div>
      <Footer />
    </div>
  );
}
