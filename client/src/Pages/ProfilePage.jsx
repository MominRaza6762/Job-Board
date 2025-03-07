import Navbar from "../MyComponents/Navbar";
import Footer from "../MyComponents/Footer";
import { useTheme } from "../Contexts/Theme";
import "../assets/ProfilePage.css";
import { useUserData } from "../Contexts/UserData";
import { Link, replace } from "react-router-dom";
import { toast , ToastContainer} from "react-toastify";
import axios from "axios";
import { useBackEndApi } from "../Contexts/BackEndApi";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function ProfilePage() {
    const navigate = useNavigate();
    const {darkMode , toggleTheme} = useTheme();
    const {userData , setUserData} = useUserData();
    const backEndApi = useBackEndApi();

    const handleDelete = async()=>{
      try
      { var toastId = toast.loading("Deleting user...")
        await axios.delete(`${backEndApi}/user/delete`, {
          data: { userId: userData.userId }, 
          headers: { "Authorization": localStorage.getItem("token") }
        });
        setUserData({auth:false});
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        localStorage.removeItem("darkMode");
        localStorage.setItem("toastMessage", "Your profile sussessfully deleted...");
        localStorage.setItem("toastType", "success");
        setTimeout(() => {
          navigate("/", replace)
        }, 1000);

      }
      catch(error)
      {
        toast.dismiss(toastId);
        toast.error("Error while deleting user")
          console.error("Error while deleting user",error.message);
      }
    }


  return (
    <div className={`custom-profilePage `}>
      <Helmet>
        <title>Your Profile Details</title>
      </Helmet>
      <Navbar />
      <ToastContainer/>
      <div className="custom-profile-container">
        <div className="custom-profile-card">
          <h2 className="custom-profile-title">Profile</h2>
          
          <div className="custom-profile-details">
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Role:</strong> {userData.role}</p>
          </div>

          <div className="custom-theme-toggle">
            <label className="custom-switch">
              <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
              <span className="custom-slider"></span>
            </label>
            <span className="custom-toggle-label">{!darkMode?"Dark Mode":"Light Mode"}</span>
          </div>

          <Link to={"/edit_profile"} className="custom-edit-btn">Edit Profile</Link>
          <button onClick={handleDelete} className="custom-edit-btn delete-btn">Delete Profile</button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
