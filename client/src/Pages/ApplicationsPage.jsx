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

export default function ApplicationsPage() {
  const navigate =  useNavigate();
  const {userData} = useUserData();
  const backEndApi = useBackEndApi();

  const [applications, setApplications] = useState([]);
  const [allApplicationsRetrieved , setAllApplicationsRetrieved] = useState(false);
  const [notFoundFlag ,setNotFoundFlag] = useState(false);

  const pageNo = useRef(0);

  const getApplication = async()=>{
    try
    {
      pageNo.current++;
      var toastId = toast.loading("Loading applications...")
      const response = await axios.get(`${backEndApi}/application/get_user_applications`, { params: { pageNo: pageNo.current, userId: userData.userId },
      headers:{"Authorization":localStorage.getItem("token")} });

      if(response.data.applications.length>0)
      {
        setApplications([...applications, ...response.data.applications])
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
        console.error("Error While Loading applications...",error);
        setTimeout(()=>{
          navigate("/server_error", replace)

        },1000)
    }
    finally{
      toast.dismiss(toastId)
    }
  }
  


  useEffect(()=>{
    getApplication()
  },[])



  return (
    <div className="applications-container">
      <Helmet>
        <title>Your Applications List </title>
      </Helmet>
      <Navbar />
      <ToastContainer/>
      <div className="tableContent">
      <h1 className="applications-title">Your Applications</h1>
      {notFoundFlag?<div>No applications found</div>:<div className="applications-content">
        <div className="applications-header">
          <span className="header-item">Title</span>
          <span className="header-item">Category</span>
          <span className="header-item">Company</span>
          <span className="header-item">Salary</span>
          <span className="header-item">Description</span>
        </div>
        <div className="applications-list">
          {applications.map((application) => (
            <JobRow  key={application._id} job={application.job} />
          ))}
        </div>
      </div>}
      

      {notFoundFlag?null:<button onClick={allApplicationsRetrieved?null:()=>getApplication()} className={`load-more-btn ${allApplicationsRetrieved?"no-more":null}`}>{allApplicationsRetrieved?"No more":"Load More"}</button>}
      </div>
      <Footer />
    </div>
  );
}
