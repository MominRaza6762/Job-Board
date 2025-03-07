import { useEffect, useRef, useState } from "react"
import JobRow from "./JobRow";
import axios from "axios";
import { useBackEndApi } from "../Contexts/BackEndApi";
import { ToastContainer , toast } from "react-toastify";
import { replace, useNavigate } from "react-router-dom";
import AdminJob from "./AdminJob";

export default function JobListing() {
  const navigate = useNavigate();
    const [notFoundFlag , setNotFoundFlag] = useState(false);
    const [jobList , setJobList] = useState([]);
    const [allJobsRetrieved , setAllJobsRetrieved] = useState(false)
    const pageNo = useRef(0);
    const backEndApi = useBackEndApi();
    const [showJob , setShowJob] = useState({show:false})

    
    const getJobs = async () => {
    
      const toastId = toast.loading("Fetching jobs...");
    
      try {
        setNotFoundFlag(false);
        setAllJobsRetrieved(false);
        
          pageNo.current++;
        const response = await axios.get(`${backEndApi}/jobs/`, {
          params: { page: pageNo.current }
        });
    
        if (response.data.jobList.length > 0) {
          if(pageNo.current===1)
          {
            setJobList(response.data.jobList);

          }
          else{
            setJobList([...jobList,...response.data.jobList]);

          }
    
        } else if (response.data.totalJobs === 0) {
          setNotFoundFlag(true);
          setJobList([]);
          toast.info("No jobs found.");
        }
    
        if (response.data.allJobRetrieved) {
          setAllJobsRetrieved(true);
        }
      } catch (error) {
        setTimeout(() => {
          navigate("/server_error", replace)
        }, 1000);
        console.error("Error fetching jobs", error);
        toast.error("Failed to fetch jobs. Server-side error...");
      } finally {
        toast.dismiss(toastId);
      }
    };

    useEffect(()=>{
      if(showJob.show === true)
        {
          pageNo.current = 0;
          return;
        } 
        else
        {
          getJobs();
        }
          
      
    },[showJob.show])
   


  return (<><ToastContainer/>
  {showJob.show?<AdminJob showJob={showJob} setShowJob={setShowJob}/>:<>
    <h1 className={notFoundFlag?null:"applications-title"}>Job List</h1>
            {notFoundFlag?<div>No applications found</div>:<div className="applications-content">
              <div className="applications-header">
                <span className="header-item">Title</span>
                <span className="header-item">Category</span>
                <span className="header-item">Company</span>
                <span className="header-item">Salary</span>
                <span className="header-item">Description</span>
              </div>
              <div className="applications-list">
                {jobList.map((job) => (
                  <JobRow setShowJob={setShowJob}  key={job._id} job={job} />
                ))}
              </div>
            </div>}
            
      
            {notFoundFlag?null:<button onClick={allJobsRetrieved?null:()=>getJobs()} className={`load-more-btn ${allJobsRetrieved?"no-more":null}`}>{allJobsRetrieved?"No more":"Load More"}</button>}
  
  </>}
            
          
    </>)
}
