import { useEffect, useRef, useState } from "react";
import { useBackEndApi } from "../Contexts/BackEndApi";
import axios from "axios";
import { ToastContainer , toast } from "react-toastify";
import { replace, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function UserTable({user}) {
  const navigate =  useNavigate();
  const backEndApi = useBackEndApi();

  const [usersData, setUsersData] = useState([]);
  const [allUsersRetrieved , setAllUsersRetrieved] = useState(false);
  const [notFoundFlag ,setNotFoundFlag] = useState(false);

  const pageNo = useRef(0);

  const getUsersData = async()=>{
    try
    {
      pageNo.current++;
      if(user === "employer")
        {
          var toastId = toast.loading("Loading Employers...");
          let response = await axios.get(`${backEndApi}/admin/employer`, { params: { pageNo: pageNo.current },
            headers:{"Authorization":localStorage.getItem("token")} });

            if(response.data.epmloyers.length>0)
                {
                  if(pageNo.current === 1)
                  {
                    setUsersData(response.data.epmloyers)
                  }
                  else
                  {
                    setUsersData([...usersData, ...response.data.epmloyers])
                  }
                }
          
                if(response.data.totalEmployers===0 && response.data.
                    allEmployersRetrieved)
                  {
                    setNotFoundFlag(true);
                  }
                  if(response.data.allEmployersRetrieved)
                  {
                    setAllUsersRetrieved(true);
                  }
      
        }

        if(user === "job-seeker")
            {
              toastId = toast.loading("Loading Job Seekers...");
              let response = await axios.get(`${backEndApi}/admin/job-seekers`, { params: { pageNo: pageNo.current },
                headers:{"Authorization":localStorage.getItem("token")} });
    
                if(response.data.jobSeekers.length>0)
                    {
                      if(pageNo.current === 1)
                      {
                        setUsersData(response.data.jobSeekers)
                      }
                      else
                      {
                        setUsersData([...usersData, ...response.data.jobSeekers])

                      }
                    }
              
                    if(response.data.totalJobSeekers===0 && response.data.
                        allJobSeekersRetrieved)
                      {
                        setNotFoundFlag(true);
                      }
                      if(response.data.allJobSeekersRetrieved)
                      {
                        setAllUsersRetrieved(true);
                      }
          
            }


    }
    catch(error)
    {
        console.error("Error While getting users",error);
        setTimeout(()=>{
          navigate("/server_error", replace)

        },1000)
    }
    finally{
      toast.dismiss(toastId)
    }
  }

  const handleDelete = async(userId)=>{
    try
    { var toastId = toast.loading("Deleting user...")
      await axios.delete(`${backEndApi}/user/delete`, {
        data: { userId: userId }, 
        headers: { "Authorization": localStorage.getItem("token") }
      });
      toast.dismiss(toastId);
      toast.success("User deleted successfully");
      pageNo.current = 0;

           setTimeout(() => {
            getUsersData();
      }, 1000);

    }
    catch(error)
    {
      toast.dismiss(toastId);
      toast.error("Error while deleting user")
        console.error("Error while deleting user",error.message);
    }
  }



  useEffect(()=>{
    getUsersData();
  },[])



  return (
    <div className="applications-container">
      <Helmet>
        <title>{`${user === "employer"?"Employers":"Job Seekers"}`} List  </title>
      </Helmet>
      <ToastContainer/>
      <div className="tableContent">
      <h1 className="applications-title">{`${user === "employer"?"Employers":"Job Seekers"}`} List</h1>
      {notFoundFlag?<div>No applicants found on this job</div>:<div className="applications-content">
        <div className="applications-header">
          <span className="header-item">Name</span>
          <span className="header-item">Email</span>
          <span className="header-item">Role</span>
          <span className="header-item">Delete User</span>
        </div>
        <div className="applications-list">
            {usersData.map((userData)=>{
                return  <div key={userData._id} className="job-row" >
                <span className="job-item">{userData.name}</span>
                <span className="job-item">{userData.email}</span>
                <span className="job-item">{userData.role}</span>
                <span  className="job-item"><img
                onClick={()=>handleDelete(userData._id)}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(0.9)"} src="/svg/deleteuser.svg" alt="delteUser" /> </span>
              </div>
            })}
        
        </div>
      </div>}
      

      {notFoundFlag?null:<button onClick={allUsersRetrieved?null:()=>getUsersData()} className={`load-more-btn ${allUsersRetrieved?"no-more":null}`}>{allUsersRetrieved?"No more":"Load More"}</button>}
      </div>
      
    </div>
  );
}
