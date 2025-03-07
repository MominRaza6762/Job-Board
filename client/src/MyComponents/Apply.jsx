import { Helmet } from "react-helmet-async";
import "../assets/Apply.css";
import { useState , useRef } from "react";
import axios from "axios";
import { useBackEndApi } from "../Contexts/BackEndApi";
import { toast, ToastContainer } from "react-toastify";
import { useUserData } from "../Contexts/UserData";
import { useNavigate } from "react-router-dom";

export default function Apply({job , onClose}) {
  const navigate = useNavigate();
  const backEndApi = useBackEndApi();
  const {userData } = useUserData();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  
  
  const handleFileChange = (event) => {

    const selectedFile = event.target.files[0];
    if(selectedFile)
    {
      const maxSize = 1 * 1024 * 1024;
      const allowedTypes = ["application/pdf", 
        "application/msword", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if(selectedFile.size > maxSize)
      {
        toast.error("File size must be 1MB or less!");
        setFile(null); 
      }
      else if(!allowedTypes.includes(selectedFile.type))
      {
        toast.error("File must be in PDF or Documnet Format...");
        setFile(null);
      }
      else
      {
        setFile(selectedFile);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click(); 
  };

  const handleSubmit =async()=>{
    if(!file)
    {
     return toast.error("Select File First")
    }

    try
    {
      const formData = new FormData();
      formData.append("userId",userData.userId);
      formData.append("jobId",job._id);
      formData.append("document",file);
      
      var toastId = toast.loading("Resume uploading...")
      const response = await axios.post(`${backEndApi}/application/upload`,formData,{
        headers:{
          "Content-Type":"multipart/form-data",
          Authorization:localStorage.getItem("token")
        }
      })
      console.log(response.data)
      toast.dismiss(toastId);
      localStorage.setItem("toastMessage", "Resume uploaded , Applied successfuly...");
        localStorage.setItem("toastType", "success");
      setTimeout(()=>{
        navigate("/",{replace:true})

      },500)

    }
    catch(error)
    {
      toast.dismiss(toastId);
      toast.error("Error While uploading Resume");
      
        console.log("Error While uploading Resume",error.message);
    }
  }


    


  return (<>
   <Helmet>
    <title>{`Apply for ${job.title} Job Details - Find detailed information about job openings and apply now!`}</title>
  </Helmet>
  <ToastContainer/>

    <div className="applyContent">
      <h1>{job.title}</h1>
      <h3>Application</h3>
      <span>Upload your resume to apply for this job.</span>
      <div className="uploadFile">
      <button onClick={handleButtonClick}> 
        <img src="/svg/upload.svg" alt="upload" />
        Upload Resume</button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf, .doc, .docx"
      />
      {file && <div><p><img src="/svg/uploaded.svg" alt="uloaded" /></p>  {file.name}</div>}
      </div>
      <div className="buttons">
        <div onClick={onClose}>Cancel</div>
        <div onClick={handleSubmit} >Submit Application</div>
      </div>
    </div>
    </>  )
}
