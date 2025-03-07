import Navbar from "../MyComponents/Navbar";
import Footer from "../MyComponents/Footer";
import "../assets/ApplicationPage.css";
import { useEffect, useRef, useState } from "react";
import { useBackEndApi } from "../Contexts/BackEndApi";
import axios from "axios";
import { ToastContainer , toast } from "react-toastify";
import { replace, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ApplicantsRow from "../MyComponents/ApplicantsRow";
import { useUserData } from "../Contexts/UserData";

export default function ApplicantsPage() {
  const navigate =  useNavigate();
  const {userData} = useUserData();
  const backEndApi = useBackEndApi();

  const [applicants, setApplicants] = useState([]);
  const [allApplicantsRetrieved , setAllApplicantsRetrieved] = useState(false);
  const [notFoundFlag ,setNotFoundFlag] = useState(false);

  const pageNo = useRef(0);
  const jobId = useParams().id;

  const getApplicants = async()=>{
    try
    {
      pageNo.current++;
      var toastId = toast.loading("Loading applicants...")
      const response = await axios.get(`${backEndApi}/application/get_applicants`, { params: { pageNo: pageNo.current, jobId: jobId },
      headers:{"Authorization":localStorage.getItem("token")} });

      if(response.data.applicants.length>0)
      {
        setApplicants([...applicants, ...response.data.applicants])
      }

      if(response.data.totalApplicants===0 && response.data.
        allApplicantsRetrieved)
        {
          setNotFoundFlag(true);
        }
        if(response.data.allApplicantsRetrieved)
        {
          setAllApplicantsRetrieved(true);
        }

    }
    catch(error)
    {
        console.error("Error While Loading applicants...",error);
        setTimeout(()=>{
          navigate("/server_error", replace)

        },1000)
    }
    finally{
      toast.dismiss(toastId)
    }
  }
  


  useEffect(()=>{
    getApplicants()
  },[])



  return (
    <div className="applications-container">
      <Helmet>
        <title>Applicants List  </title>
      </Helmet>
      {userData.role==="admin"?null:<Navbar />}
      <ToastContainer/>
      <div className="tableContent">
      <h1 className="applications-title">Applicants List</h1>
      {notFoundFlag?<div>No applicants found on this job</div>:<div className="applications-content">
        <div className="applications-header">
          <span className="header-item">Name</span>
          <span className="header-item">Email</span>
          <span className="header-item">Resume</span>
        </div>
        <div className="applications-list">
          {applicants.map((applicant) => (
            <ApplicantsRow  key={applicant._id} applicant={applicant} />
          ))}
        </div>
      </div>}
      

      {notFoundFlag?null:<button onClick={allApplicantsRetrieved?null:()=>getApplicants()} className={`load-more-btn ${allApplicantsRetrieved?"no-more":null}`}>{allApplicantsRetrieved?"No more":"Load More"}</button>}
      </div>
      {userData.role==="admin"?null:<Footer />}
      
    </div>
  );
}
