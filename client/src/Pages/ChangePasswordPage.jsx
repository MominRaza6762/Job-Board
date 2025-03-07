import Navbar from "../MyComponents/Navbar";
import Footer from "../MyComponents/Footer";
import { useState } from "react";
import "../assets/ChangePasswordPage.css";
import { useBackEndApi } from "../Contexts/BackEndApi";
import { replace, useNavigate } from "react-router-dom";
import { ToastContainer , toast } from "react-toastify";
import axios from "axios";
import { useUserData } from "../Contexts/UserData";
import { useTheme } from "../Contexts/Theme";
import { Helmet } from "react-helmet-async";

export default function ChangePasswordPage() {
  const backEndApi = useBackEndApi();
  const {userData , setUserData } = useUserData();
  const {setDarkMode} = useTheme();
    const navigate = useNavigate();
    const [errors , setErrors]=useState({});
    const [touched , setTouched]=useState({})
  const [formData , setFormData] = useState({
    oldPassword:"",
    newPassword:"",
    confirmPassword:""
  })

  const validateForm =(name = null , value = null)=>{
    const data = {...formData , [name]:value};
    const newErrors ={...errors};

    
    if(!data.oldPassword.trim())
        {
            newErrors.oldPassword = "Old Password is required";
        }
        else
        {
            delete newErrors.oldPassword;
        }

        if(!data.newPassword.trim())
            {
                newErrors.newPassword = "New Password is required";
            }
            else if(data.newPassword.length<6)
            {
              newErrors.newPassword = "Password at least 6 characters";
            }
            else
            {
                delete newErrors.newPassword;
            }


             if(data.confirmPassword!==data.newPassword)
              {
                newErrors.confirmPassword = "Password did not match";
              }
              else if(data.confirmPassword==="")
              {
                newErrors.confirmPassword = "Confirm Password is also required";
              }
              else
              {
                  delete newErrors.confirmPassword;
              }

                    setErrors(newErrors);
                    return Object.keys(newErrors).length === 0;
};

const handleChange =(e)=>{
  const fieldName = e.target.name;
  const fieldValue = e.target.value;
      setFormData({...formData,[fieldName]:fieldValue});
      setTouched({...touched , [fieldName]:true});
      validateForm(fieldName, fieldValue);
}

  const handleSubmit =async (e) => {
    e.preventDefault();
    setTouched({
      oldPassword: true,
      newPassword: true,
      confirmPassword: true
  });

  if(validateForm())
  {

      try
      {
        var toastId = toast.loading("Changing Password..")
        await axios.put(`${backEndApi}/user/change_password`, {
          userId:userData.userId,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        }, {
          headers: { "Authorization": localStorage.getItem("token") }
        });
        setTimeout(() => {
          navigate("/signin", replace)
        }, 700);
        toast.dismiss(toastId);
        localStorage.setItem("toastMessage", "Password changed successfully...");
        localStorage.setItem("toastType", "success");
        setFormData({
          oldPassword:"",
          newPassword:"",
          confirmPassword:""
        })
        localStorage.removeItem("token");
        localStorage.removeItem("darkMode");
        localStorage.removeItem("userData");
        setDarkMode(false);
        setUserData({auth:false})
      }
      catch(error)
      {
          if(error.response?.status===400)
          {
            toast.error(error.response.data.message)
                      
          }
          else
          {
            toast.error("Error while changing password ");
            setTimeout(()=>{
              navigate("/server_error", replace)
    
            },1000)  
            console.error("Error while changing password ", error.message);

          }
          setFormData({
            oldPassword:"",
            newPassword:"",
            confirmPassword:""
          })
          toast.dismiss(toastId)
      }
      
  
  }
  else
  {
      toast.error("Form contain some errors first resolve them");
  }
  };

  return (
    <div className="custom-changePasswordPage">
      <Helmet>
        <title>Change Your Password</title>
      </Helmet>
      <ToastContainer/>
      <div>
        <Navbar />
      </div>

      <div className="custom-password-container">
        <div className="custom-password-card">
          <h2 className="custom-password-title">Change Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="custom-password-input-group">
              <label>Old Password</label>
              <input 
                type="password" 
                value={formData.oldPassword} 
                onChange={(e) => handleChange(e)} 
                placeholder="••••••••"
                name="oldPassword"
              />
              {touched.oldPassword && errors.oldPassword && <span>{errors.oldPassword}</span>}
            </div>

            <div className="custom-password-input-group">
              <label>New Password</label>
              <input 
                type="password" 
                value={formData.newPassword} 
                onChange={(e) => handleChange(e)}
                placeholder="••••••••"
                name="newPassword"
              />
              {touched.newPassword && errors.newPassword && <span>{errors.newPassword}</span>}
            </div>

            <div className="custom-password-input-group">
              <label>Confirm Password</label>
              <input 
                type="password" 
                value={formData.confirmPassword} 
                onChange={(e) => handleChange(e)}
                placeholder="••••••••"
                name="confirmPassword"
              />
              {touched.confirmPassword && errors.confirmPassword && <span>{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="custom-save-btn">Save Password</button>
          </form>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
