import  { useState } from "react";
import SideBar from "../MyComponents/SideBar";
import "../assets/AdminPage.css";
import { Link , useNavigate } from "react-router-dom";
import { useUserData } from "../Contexts/UserData";
import { Helmet } from "react-helmet-async";
import JobListing from "../MyComponents/JobListing";
import UserTable from "../MyComponents/UserTable";
import ApplicationsList from "../MyComponents/ApplicationsList";

export default function AdminPage() {
  const {userData ,setUserData } = useUserData();
  const [selectedPage, setSelectedPage] = useState(localStorage.getItem("adminNav") || "Dashboard");
  const navigate = useNavigate();

  const handleLogOut = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUserData({auth:false});
    localStorage.setItem("toastMessage", "Logged out ...");
    localStorage.setItem("toastType", "info");
    setTimeout(()=>{
     navigate("/");

    }, 500)
 }

  return (
    <div className="admin-container">
      
      <SideBar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <div className="main-content">
        <div className="manage-content">

        {selectedPage === "Dashboard" && <>
          <Helmet>
    <title>{`Admin - Dashboard`}</title>
  </Helmet>
  
          <div className="custom-profile-container">
        <div className="custom-profile-card">
          <h2 className="custom-profile-title">Profile</h2>
          <div className="custom-profile-details">
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Role:</strong> {userData.role}</p>
          </div>

          <Link to={"/edit_profile"} className="custom-edit-btn">Edit Profile</Link>
          <button style={{backgroundColor:"rgba(196, 187, 187, 0.329)", color:"black"}}  className="custom-edit-btn delete-btn" onClick={handleLogOut}>Log out</button>
        </div>
      </div>
        </>}
        {selectedPage === "Job Listings" && <> 
        <Helmet>
        <title>{`Admin - Job Lisings`}</title>
        </Helmet>
        <JobListing/>
        </>}
        {selectedPage === "Employers" && <>
          <Helmet>
        <title>{`Admin - Employers List`}</title>
        </Helmet>
        <UserTable user={"employer"}/>
        </>}
        {selectedPage === "Job Seekers" && <>
          <Helmet>
        <title>{`Admin - Job Seekers List`}</title>
        </Helmet>
          <UserTable user={"job-seeker"}/>
        </>}
        {selectedPage === "Applications" && <>
          <Helmet>
        <title>{`Admin - Applications`}</title>
        </Helmet>
        <ApplicationsList/>
        </>}

      </div>
      </div>
    </div>
  );
}
