import { Helmet } from "react-helmet-async";
import Navbar from "../MyComponents/Navbar";
import Footer from "../MyComponents/Footer";
import "../assets/SiginingPages.css";
import { Link , useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast , ToastContainer } from "react-toastify";
import {  handleError} from "../Utils/Utils";
import { useBackEndApi } from "../Contexts/BackEndApi";
import axios from "axios";
import { useUserData } from "../Contexts/UserData";


export default function SignInPage() {
    
    const {setUserData} = useUserData();


    const backEndApi = useBackEndApi();
    const navigate = useNavigate();
    const [errors , setErrors]=useState({});
    const [touched , setTouched]=useState({})
    const [formData, setFormData] = useState({
        email:"",
        password:"",
    })

    const validateForm =(name = null , value = null)=>{
        const data = {...formData , [name]:value};
        const newErrors ={...errors};

        
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
                else
                {
                    delete newErrors.password;
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

    const handleSubmit = async()=>{
        setTouched({
            email: true,
            password: true,
        });

        if(validateForm())
        {

            try
            {
                var toastId = toast.loading("Signing in, please wait...")
                 const response =await axios.post(`${backEndApi}/user/signin`,{formData});
                 localStorage.setItem("token",response.data.token);
                 if(response.data.role==="admin")
                    {
                        setUserData({auth:true , role:"admin"})
                    }

                localStorage.setItem("toastMessage", "Signed in Successfully...");
                localStorage.setItem("toastType", "success");
                
                setFormData({
                    email:"",
                    password:""
                    });
                    setTimeout(()=>{
                        if(response.data.role==="admin")
                        {
                            navigate("/admin");
                        }
                        else
                        {
                            navigate("/");
                        }
                        toast.dismiss(toastId);

                    },1000)                   

             
            }
            catch(error)
            {
                toast.dismiss(toastId);
                if(error.response?.status===400)
                {
                    handleError(error.response.data.message);
                    setFormData({
                        email:"",
                        password:""
                        });
                            
                }
                else
                {
                    toast.error("Error While signing in")
                    console.error("Error While signing in", error.message);
                }
            }
            
        
        }
        else
        {
            handleError("Email  is not valid.");
        }

        
    }

  return (<>
        
  <Helmet>
  <title>Sign In - Sign in to your account and continue your journey with us</title>
      </Helmet>

    <div>
        <Navbar/>
    </div>
    <div className="signingContent">
    <ToastContainer/>
        <div className="signingForm">
            
        <h2>Sign in to Job Board</h2>

            
            <div>
            <label htmlFor="">Email</label>
            <input type="email" value={formData.email} onChange={(e)=>handleChange(e)} name="email" placeholder="you@example.com" required/>
            {touched.email && errors.email && <span>{errors.email}</span>}
            </div>

           
            <div>
            <label htmlFor="">Password</label>
            <input type="password" value={formData.password} onChange={(e)=>handleChange(e)} name="password" placeholder="••••••••" required/>
            {touched.password && errors.password && <span>{errors.password}</span>}
            </div>

           
            <Link to={"/rigester"} className="spanClass">
            <span> Don&apos;t Have an Account?</span>
            </Link>
            <div>
            <button type="button" onClick={handleSubmit}>Sign in</button>
            </div>


        </div>
        <div className="signingImage">
            <img src="/images/signin.jpeg" alt="" />
        </div>

    </div>

    <div>
        <Footer/>
    </div>
    
    </>)
}
