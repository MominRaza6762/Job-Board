import { useEffect, useState } from "react";
import "../assets/PostPage.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useBackEndApi } from "../Contexts/BackEndApi";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../Contexts/UserData";
import { Helmet } from "react-helmet-async";

export default function EditJob({job , onClose}) {
  const backEndApi = useBackEndApi();
  const { setUserData} = useUserData();
  const navigate = useNavigate();
  const [categories , setCategories] = useState([
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
  const oldData ={
    title:job.title,
    description:job.description,
    salary:job.salary,
    category:job.category}
  
  const [touched , setTouched]=useState({})
  const [selectedCategory, setSelectedCategory] = useState(job.category);
  const [customCategory, setCustomCategory] = useState("");
  const [formData , setFormData] = useState(oldData)
  const [errors , setErrors] = useState({});

  const appendCategory =()=>{
    if(!categories.includes(job.category))
    {
      setCategories([job.category,...categories])
    }
    
  }
  useEffect(()=>{
    appendCategory()

  },[])

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

    })
    
    if(validateForm())
    {
      var toastId = toast.loading("Saving Job...")
     
        const newData ={};
        if(oldData.title!==formData.title) newData.title = formData.title;
        if(oldData.description!==formData.description) newData.description = formData.description;
        if(oldData.salary!==formData.salary) newData.salary = formData.salary;
        if(oldData.category!==formData.category) newData.category = formData.category;
        if(Object.keys(newData).length===0)
        {
          toast.dismiss(toastId);
          toast.success("Job saved Successfully...");
          setTimeout(() => {
            onClose();
          }, 1500);
            

          return;
        }
     
      try
            {
              
                 await axios.put(`${backEndApi}/jobs/edit_job/${job._id}`,newData,{headers:{Authorization:localStorage.getItem("token")}});
                 

                 toast.dismiss(toastId)
                toast.success("Job saved Successfully...");
          

                    setTimeout(()=>{
                      onClose();

                    },1500)                   
             
            }
            catch(error)
            {
                toast.dismiss(toastId);
               toast.error("Error While Editing Job");
               if(error.status===401)
                {
                  setUserData({auth:false})
                  setTimeout(()=>{
                    navigate("/");

                },2000)
          
                }
                    console.error("Error While Editing Job", error.message);
            }
    }
    else
    {
      toast.error("Form contains errors, fix them first.");
    }
  }

  return (
    <div className="postPage">
        <Helmet>
    <title>{`Edit ${job.title} Job Details `}</title>
  </Helmet>
      <ToastContainer/>
      <div className="postData">
        <form className="postForm" onSubmit={(e)=>handleSubmit(e)}>
          <h2 className="formTitle">Edit your Job</h2>

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

<div className="formButtons">
          <div onClick={onClose}  className="postButton cancelButton">Cancel</div>
          <button type="submit" className="postButton">Save</button>
          </div>

        </form>
      </div>
    </div>
  );
}
