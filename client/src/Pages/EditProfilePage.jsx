import Navbar from "../MyComponents/Navbar";
import Footer from "../MyComponents/Footer";
import "../assets/EditProfilePage.css"; 
import { useUserData } from "../Contexts/UserData";
import { useState } from "react";
import { useBackEndApi } from "../Contexts/BackEndApi";
import axios from "axios";
import { replace, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { handleError} from "../Utils/Utils";
import { Helmet } from "react-helmet-async";

export default function EditProfilePage() {
  const {userData , setUserData} = useUserData();
  const backEndApi = useBackEndApi();
  const navigate = useNavigate();
  const [errors , setErrors]=useState({});
  const [touched , setTouched]=useState({})
  const [formData , setFormData] = useState({
    name: userData.name ,
    email: userData.email
  })

  const validateForm =(name = null , value = null)=>{
    const data = {...formData , [name]:value};
    const newErrors ={...errors};

        if(!data.name.trim())
            {
                newErrors.name = "Name Can't be Empity";
            }
            else
            {
                delete newErrors.name;
            }

            if(!data.email.trim())
              {
                  newErrors.email = "Email Can't be Empity";
              }
              else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email))
              {
                  newErrors.email = "Invalid email format";
      
              }
              else
              {
                  delete newErrors.email;
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

const handleSubmit = async(e)=>{
  e.preventDefault();
  setTouched({
    name: true,
      email: true
  });
   const data ={};

  if(validateForm())
  {
    if(formData.name===userData.name && formData.email===userData.email)
    {
      if(userData.role==="admin")
        {
         toast.success("Saved...")

        }
        else
        {
          localStorage.setItem("toastMessage", "Saved...");
      localStorage.setItem("toastType", "success");

        }
  

      setTimeout(()=>{
        if(userData.role==="admin")
        {
          navigate("/admin", replace)

        }
        else
        {
          navigate("/profile", replace)

        }

      },500);
      return;
    }
    if(formData.name!==userData.name)
    {
      data.name = formData.name;
    }

    if(formData.email!==userData.email)
      {
        data.email = formData.email;
      }


      try
      {
        data.userId = userData.userId;
        var toastId = toast.loading("Saving profile data...")
        const response = await axios.put(`${backEndApi}/user/user_update`,{data},{headers:{"Authorization":localStorage.getItem("token")}});
        const {token}= response.data;     
        localStorage.setItem("token",token);
        toast.dismiss(toastId);
        if(userData.role==="admin")
          {
           toast.success("Profile saved successfully...")
  
          }
          else
          {
            localStorage.setItem("toastMessage", "Profile saved successfully...");
        localStorage.setItem("toastType", "success");
  
          }
        
        setTimeout(()=>{
          if(userData.role==="admin")
            {
              navigate("/admin", replace)
    
            }
            else
            {
              navigate("/profile", replace)
    
            }
  
        },700);
             
      }
      catch(error)
      {
        toast.dismiss(toastId);
        console.log(error.response)
        handleError("Error While Editing Profile")
        console.error("Error While Editing Profile", error.message);
        
      }
      
  
  }
  else
  {
      handleError("Name is Empity or Email  is not valid .");
  }

  
}



  return (
    <div className="custom-editProfilePage">
      <Helmet>
        <title>Edit Your Profile</title>
      </Helmet>
      <ToastContainer/>
     {userData.role==="admin"?null:<Navbar />} 
      <div className="custom-edit-container">
        <div className="custom-edit-card">
          <h2 className="custom-edit-title">Edit Profile</h2>
          <form className="custom-edit-form" onSubmit={(e)=>handleSubmit(e)}>
            <div className="custom-input-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" onChange={(e)=>handleChange(e)} value={formData.name} />
              {touched.name && errors.name && <span>{errors.name}</span>}              
            </div>
            <div className="custom-input-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={(e)=>handleChange(e)} />
              {touched.email && errors.email && <span>{errors.email}</span>}              
            </div>
            <button type="submit" className="custom-save-btn">Save Profile</button>
          </form>
        </div>
      </div>
      {userData.role==="admin"?null:<Footer />}
      
    </div>
  );
}
