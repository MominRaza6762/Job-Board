import { Link , useLocation , useNavigate } from "react-router-dom";
import "../assets/NavBar.css";
import { useUserData } from "../Contexts/UserData";
import { useState } from "react";
import { useTheme } from "../Contexts/Theme";


export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const {userData , setUserData } = useUserData();
  const [isOpen, setIsOpen] = useState(false);
  const {setDarkMode} = useTheme();



  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogOut = ()=>{
     localStorage.removeItem("token");
     localStorage.removeItem("darkMode");
     localStorage.removeItem("userData");
     setDarkMode(false);
     setUserData({auth:false});
     localStorage.setItem("toastMessage", "Logged out ...");
     localStorage.setItem("toastType", "info");
     setTimeout(()=>{
      navigate("/");

     }, 500)
  }
  
  return (
    <div className="navBar">
        <div className="navLogo">
            <Link to={"/"}><img src="/svg/logo.svg" alt="logo" /></Link>
        </div>
        {userData.auth?<div className="navProfile">
           <div className="profile-container">
      <div className="profile-icon" onClick={toggleDropdown}>
        <img src="/svg/profile.svg" alt="profile" />
      </div>

      {isOpen && (
        <div className="profile-dropdown">
          <ul>
            <li><Link className="link" to={"/profile"}>Profile</Link></li>
            {userData.role==="employer"?<li><Link to={"/posted_job"}>Posted Jobs</Link></li>:<li><Link to={"/applications"}>Your Applications</Link></li>}
            <li><Link className="link" to={"/change_password"}>Change Your Password</Link></li>
            <li onClick={handleLogOut}>Log Out</li>
          </ul>
        </div>
      )}
    </div>
            
            {userData.role==="employer"?<Link to={"/post"} className={`navSignIn ${location.pathname==="/post"?"located":""} `}>Post Job
            </Link>:null}
        </div>:<div className="navButtons">
            <Link to={'/signin'} className={`navSignIn ${location.pathname==="/signin"?"located":""} `}>
            Sign in
            </Link>
            <Link to={"/rigester"} className={`navRigester ${location.pathname==="/rigester"?"located":""}`}>
            Rigester
            </Link>
            </div>}
        
              
    </div>
  )
}
