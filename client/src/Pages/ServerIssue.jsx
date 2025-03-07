import { Helmet } from "react-helmet-async";
import "../../src/assets/ErrorPage.css"
import { useEffect } from "react";
import { replace, useNavigate } from "react-router-dom";
import { useBackEndApi } from "../Contexts/BackEndApi";
import axios from "axios";

export default function ServerIssue() {
  const navigate = useNavigate();
  const backEndApi = useBackEndApi();

  const checkServer =async()=>{
    try
    {
      await axios.get(`${backEndApi}/`)
      return true;
     
    }
    catch(error)
    {
     return false
    }
  }
  useEffect(()=>{
    const checkNavigate =async()=>{
      const check = await checkServer();
      if(check)
        {
          navigate("/", replace)
        }

    }
    checkNavigate();
    
  },[])
  return (
    <div className="errorContent">
      <Helmet>
        <title>Server issue | Oops! </title>
      </Helmet>
        <img src="/images/servererror.jpeg" alt="" />
        <h2>Whoops! Server is not responding </h2>
      
    </div>
  )
}
