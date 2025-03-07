import { Helmet } from "react-helmet-async";
import Navbar from "../MyComponents/Navbar";
import Footer from "../MyComponents/Footer";
import "../assets/SiginingPages.css";
import { Link , useNavigate } from "react-router-dom";
import { useState } from "react";
import {toast, ToastContainer } from "react-toastify";
import { handleError} from "../Utils/Utils";
import { useBackEndApi } from "../Contexts/BackEndApi";
import axios from "axios";


export default function RigesterPage() {
    const backEndApi = useBackEndApi();
    const navigate = useNavigate();
    const [errors , setErrors]=useState({});
    const [touched , setTouched]=useState({})
    const [formData, setFormData] = useState({
        name:"",
        email:"",
        role:"job-seeker",
        password:"",
        confirmPassword:"",
        checkBox:false
    })

    const validateForm =(name = null , value = null)=>{
        const data = {...formData , [name]:value};
        const newErrors ={...errors};

        if(!data.name.trim())
        {
            newErrors.name = "Name is required";
        }
        else
        {
            delete newErrors.name;
        }

        if(!data.email.trim())
            {
                newErrors.email = "Email is required";
            }
            else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email))
            {
                newErrors.email = "Invalid email format";

            }
            else
            {
                delete newErrors.email;
            }

            if(!data.password.trim())
                {
                    newErrors.password = "Password is required";
                }
                else if(data.password.length<6)
                {
                    newErrors.password = "Password must be atleast 6 characters";
                }
                else
                {
                    delete newErrors.password;
                }

                if(!data.confirmPassword.trim())
                    {
                        newErrors.confirmPassword = "Confirm Password is required";
                    }
                    else if(data.confirmPassword!==data.password)
                    {
                        newErrors.confirmPassword = "Passwords do not Match";
                    }
                    else
                    {
                        delete newErrors.confirmPassword;
                    }

                    if(data.checkBox===false)
                        {
                            newErrors.checkBox = "You must agree to the Terms & Conditions and Privacy Policy to proceed."
                        }
                        else
                        {
                            delete newErrors.checkBox;
                        }

                        setErrors(newErrors);
                        return Object.keys(newErrors).length === 0;

    };


    const handleChange =(e)=>{
        const fieldName = e.target.name;
        const fieldValue = e.target.value;
        if(fieldName==="checkBox")
        {
            setFormData({...formData,[fieldName]:e.target.checked});
            validateForm(fieldName, e.target.checked)
        }
        else
        {
            setFormData({...formData,[fieldName]:fieldValue});
            validateForm(fieldName, fieldValue)
        }
        setTouched({...touched , [fieldName]:true});
    }

    const handleSubmit = async()=>{
        setTouched({
            name: true,
            email: true,
            password: true,
            confirmPassword: true,
            checkBox:true
        });

        if(validateForm())
        {

            try
            {
                const {name , email , role , checkBox , password} =formData;
                
                var toastId = toast.loading("Signing up, please wait...")
                 await axios.post(`${backEndApi}/user/register`,{name , email , role , checkBox , password});

                localStorage.setItem("toastMessage", "Rigesterd Successfully...");
                localStorage.setItem("toastType", "success");
                setFormData({name:"",
                    email:"",
                    role:"job-seeker",
                    password:"",
                    confirmPassword:"",
                    checkBox:false});

                    setTimeout(()=>{
                        navigate("/signin");
                        toast.dismiss(toastId)

                    },1000)                   


             
            }
            catch(error)
            { toast.dismiss(toastId)
                if(error.response.status===400)
                {
                    localStorage.setItem("toastMessage", error.response.data.message);
                    localStorage.setItem("toastType", "info");
                    setTimeout(()=>{
                        navigate("/signin");

                    },1000)        
                }
                else
                {
                    toast.error("Error While sign up")
                    console.error("Error While sign up", error.message);
                }
            }
            
            
        
        }
        else
        {
            handleError("Form contains errors, fix them first.");
        }

        
    }

  return (<>
  <Helmet>
        <title>Register - Create an account to access exclusive features on our website</title>
      </Helmet>

    <div>
        <Navbar/>
    </div>
    <div className="signingContent">
        <ToastContainer/>
        <div className="signingForm">
            
        <h2>Register to get started</h2>

            <div>
            <label htmlFor="">Name</label>
            <input type="text" value={formData.name} onChange={(e)=>handleChange(e)} name="name" placeholder="Your Name"  required/>
            {touched.name && errors.name && <span>{errors.name}</span>}
            </div>

            <div>
            <label htmlFor="">Email</label>
            <input type="email" value={formData.email} onChange={(e)=>handleChange(e)} name="email" placeholder="you@example.com" required/>
            {touched.email && errors.email && <span>{errors.email}</span>}
            </div>

            <div>
            <label htmlFor="">Select Role</label>
            <select value={formData.role} onChange={(e)=>handleChange(e)} name="role" required>
                <option value="job-seeker">Job Seeker</option>
                <option value="employer">Employer</option>
            </select>
            </div>

            <div>
            <label htmlFor="">Password</label>
            <input type="password" value={formData.password} onChange={(e)=>handleChange(e)} name="password" placeholder="••••••••" required/>
            {touched.password && errors.password && <span>{errors.password}</span>}
            </div>

            <div>
            <label htmlFor="">Confirm Password</label>
            <input type="password" value={formData.confirmPassword} onChange={(e)=>handleChange(e)} name="confirmPassword" placeholder="••••••••" required/>
            {touched.confirmPassword && errors.confirmPassword && <span>{errors.confirmPassword}</span>}
            </div>

            <div>
            <label className="checkBox" >
                <input value={formData.checkBox} onChange={(e)=>handleChange(e)} name="checkBox" type="checkbox" required/>I agree to the  <Link to={"/terms"} >
                Terms & Conditions
            </Link> and  <Link to={"/privacy"} >
                Privacy Policy
            </Link>
            </label>
            {touched.checkBox && errors.checkBox && <span>{errors.checkBox}</span>}
            </div>

            <Link to={"/signin"} className="spanClass">
            <span>Already Have an Account?</span>
            </Link>
            <div>
            <button type="button" onClick={handleSubmit}>Sign up</button>
            </div>


        </div>
        <div className="signingImage">
            <img src="/images/signup.jpeg" alt="" />
        </div>

    </div>

    <div>
        <Footer/>
    </div>
    
    </>)
}
