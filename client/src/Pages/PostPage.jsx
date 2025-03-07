import { useState } from "react";
import "../assets/PostPage.css";
import Navbar from "../MyComponents/Navbar";
import Footer from "../MyComponents/Footer";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useBackEndApi } from "../Contexts/BackEndApi";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../Contexts/UserData";

export default function PostPage() {
  const backEndApi = useBackEndApi();
  const {userData , setUserData} = useUserData();
  const navigate = useNavigate();
  const [categories] = useState([
    "IT",
    "Marketing",
    "Finance",
    "Engineering",
    "Healthcare",
    "Education",
    "Sales",
    "Human Resources",
    "Customer Support",
    "Operations",
    "Legal",
    "Design",
    "Writing",
    "Media",
    "Construction",
    "Logistics",
    "Research & Development",
    "Consulting",
    "Government",
    "Hospitality",
    "Retail",
    "Other", 
  ]);

  const [touched , setTouched]=useState({})
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [formData , setFormData] = useState({
            title:"",
            description:"",
            salary:"",
            category:"",
            company:"",
  })
  const [errors , setErrors] = useState({});

  const validateForm =(name = null , value = null)=>{
    const data = {...formData , [name]:value};
    const newErrors ={...errors};

    if(!data.title.trim())
    {
        newErrors.title = "Title is required";
    }
    else
    {
        delete newErrors.title;
    }

    if(!data.description.trim())
        {
            newErrors.description = "Description is required";
        }
        else if(data.description.length<100)
        {
            newErrors.description = "Description at least 100 characters";

        }
        else
        {
            delete newErrors.description;
        }

        if(!data.salary)
            {
                newErrors.salary = "Salary is required";
            }
            else if(Number(data.salary)<5000)
            {
                newErrors.salary = "Salary Must be at least 5000";
            }
            else
            {
                delete newErrors.salary;
            }

            if(!data.category.trim())
                {
                    newErrors.category = "Category is required";
                }
                else
                {
                    delete newErrors.category;
                }
                
                if(name==="other" && !value)
                {
                    newErrors.other = "Write Your Custom Category";
                }
                else
                {
                    delete newErrors.other;
                }
                

                if(!data.company)
                    {
                        newErrors.company = "Company is required"
                    }
                    else
                    {
                        delete newErrors.company;
                    }

                    setErrors(newErrors);
                    return Object.keys(newErrors).length === 0;

};


  const handleChange = (event) => {
    const value = event.target.value;
    const fieldName =event.target.name;
    if(fieldName ==="category")
      {
      setSelectedCategory(value);
      setFormData((prev)=>({...prev ,[fieldName]:value}))
    }
    else if(fieldName ==="other")
    {
      setCustomCategory(value);
      setFormData((prev)=>({...prev ,category:value}))
    }
    else
    {
      setFormData((prev)=>({...prev ,[fieldName]:value}))
    }
    setTouched({...touched , [fieldName]:true});
    validateForm(fieldName,value);

  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setTouched({
            title:true,
            description:true,
            salary:true,
            category:true,
            other:true,
            company:true

    })
    if(validateForm())
    {
      const data = formData;
      data.postedBy = userData.userId;
      try
            {
              var toastId = toast.loading("Posting Job...")
                 await axios.post(`${backEndApi}/jobs/post`,data,{headers:{Authorization:localStorage.getItem("token")}});
                 toast.dismiss(toastId)

                localStorage.setItem("toastMessage", "Job Posted Successfully...");
                localStorage.setItem("toastType", "success");
                setFormData({
                  title:"",
                  description:"",
                  salary:"",
                  category:"",
                  company:"",  
                });

                    setTimeout(()=>{
                        navigate("/");

                    },2000)                   
             
            }
            catch(error)
            {
                toast.dismiss(toastId);
               toast.error("Error While Posing Job");
               if(error.status===401)
                {
                  setUserData({auth:false})
                  setTimeout(()=>{
                    navigate("/");

                },2000)
          
                }
                    console.error("Error While Posing Job", error.message);
            }
    }
    else
    {
      toast.error("Form contains errors, fix them first.");
    }
  }

  return (
    <div className="postPage">
      <ToastContainer/>
      <div>
        <Navbar />
      </div>
      <div className="postData">
        <form className="postForm" onSubmit={(e)=>handleSubmit(e)}>
          <h2 className="formTitle">Create a Job Post</h2>

          <div className="inputGroup">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={formData.title}
            onChange={(e)=>handleChange(e)} placeholder="Enter job title" />
            {touched.title && errors.title && <span>{errors.title}</span>}
          </div>

          <div className="inputGroup">
            <label htmlFor="description">Description</label>
            <textarea id="description" placeholder="Enter job description" name="description" value={formData.description}
            onChange={(e)=>handleChange(e)}></textarea>
            {touched.description && errors.description && <span>{errors.description}</span>}
          </div>

          <div className="inputGroup">
            <label htmlFor="salary">Salary</label>
            <input type="number" id="salary" name="salary" value={formData.salary}
            onChange={(e)=>handleChange(e)} placeholder="Enter salary amount" />
            {touched.salary && errors.salary && <span>{errors.salary}</span>}
          </div>

          <div className="inputGroup">
            <label htmlFor="category">Category</label>
            <select id="category" value={selectedCategory} name="category" onChange={(e)=>handleChange(e)}>
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {touched.category && errors.category && <span>{errors.category}</span>}
          </div>

          {selectedCategory === "Other" && (
            <div className="inputGroup">
              <label htmlFor="customCategory">Enter Category</label>
              <input
                type="text"
                id="customCategory"
                name= "other"
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(e) => handleChange(e)}
              />
              {touched.other && errors.other && <span>{errors.other}</span>}
            </div>
          )}

          <div className="inputGroup">
            <label htmlFor="company">Company</label>
            <input type="text" id="company" name="company" value={formData.company}
            onChange={(e)=>handleChange(e)} placeholder="Enter company name" />
            {touched.company && errors.company && <span>{errors.company}</span>}
          </div>

          <div className="formButtons">
          <Link to={"/"}  className="postButton cancelButton">Cancel</Link>
          <button type="submit" className="postButton">Post</button>
          </div>

          
        </form>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
