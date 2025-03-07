import PostedJobPage from "./Pages/PostedJobPage";
import { HelmetProvider } from "react-helmet-async";
import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import PrivacyPolicyPage from "./Pages/PrivacyPolicyPage";
import TermsContitionsPage from "./Pages/TermsContitionsPage";
import { Routes , Route , Navigate } from "react-router-dom";
import RigesterPage from "./Pages/RigesterPage";
import SignInPage from "./Pages/SignInPage";
import ErrorPage from "./Pages/ErrorPage";
import Refresher from "./Utils/Refresher";
import JobPage from "./Pages/JobPage";
import PostPage from "./Pages/PostPage";
import ProfilePage from "./Pages/ProfilePage";
import EditProfilePage from "./Pages/EditProfilePage";
import { useUserData } from "./Contexts/UserData";
import ChangePasswordPage from "./Pages/ChangePasswordPage";
import { useEffect } from "react";
import { toast  } from "react-toastify";
import { useLocation } from "react-router-dom";
import ApplicationsPage from "./Pages/ApplicationsPage";
import ServerIssue from "./Pages/ServerIssue";
import ApplicantsPage from "./Pages/ApplicantsPage";
import AdminPage from "./Pages/AdminPage";

function App() {
  const location = useLocation();
  const {userData,getUser} = useUserData();


  useEffect(() => {
    const message = localStorage.getItem("toastMessage");
    const type = localStorage.getItem("toastType");
    
    if (message) {
      toast[type](message, { autoClose: 2500 });
      
      localStorage.removeItem("toastMessage");
      localStorage.removeItem("toastType");
    }
  }, [location]);
  
  useEffect(()=>{
    setTimeout(()=>{
      getUser();
    },1000);

  },[location])
  


  const PrivateAdminRoute =({element})=>{
    return userData.role==="admin"?element:<Navigate to={"/"} replace/>
  }

  const PrivateAdminAndEmployerRoute =({element})=>{
    return userData.role==="employer" ||  userData.role==="admin"?element:<Navigate to={"/"} replace/>
  }

  const PrivateEmployerRoute =({element})=>{
    return userData.role==="employer"?element:<Navigate to={"/"} replace/>
  }
  
  const PrivateJobSeekerRoute =({element})=>{
    return userData.role==="job-seeker"?element:<Navigate to={"/"} replace/>
  }
  const PrivateRoute =({element})=>{
    return userData.auth?element:<Navigate to={"/"} replace/>
  }
  
  

  return (
    <>
    <HelmetProvider>
    <Refresher/>

    <Routes>
      <Route path="/*" element={<ErrorPage/>} />
      <Route path="/" element={<HomePage/>} />
      <Route path="/server_error" element={<ServerIssue/>} />
      <Route path="/about" element={<AboutPage/>} />
      <Route path="/privacy" element={<PrivacyPolicyPage/>} />
      <Route path="/terms" element={<TermsContitionsPage/>} />
      <Route path="/signin" element={<SignInPage/>} />
      <Route path="/rigester" element={<RigesterPage/>} />
      <Route path="/job/:id" element={<JobPage/>} />
      <Route path="/post" element={<PrivateEmployerRoute element={<PostPage/>} />} />
      <Route path="/profile" element={<PrivateRoute element={<ProfilePage/>}/>} />
      <Route path="/edit_profile" element={<PrivateRoute element={<EditProfilePage/>}/>} />
      <Route path="/change_password" element={<PrivateRoute element={<ChangePasswordPage/>}/>} />
      <Route path="/applications" element={<PrivateJobSeekerRoute element={<ApplicationsPage/>}/>} />
      <Route path="/posted_job" element={<PrivateEmployerRoute element={<PostedJobPage/>}/>} />
      <Route path="/applicants_list/:id" element={<PrivateAdminAndEmployerRoute element={<ApplicantsPage/>}/>} />
      <Route path="/admin" element={<PrivateAdminRoute element={<AdminPage/>}/>} />

    </Routes>    

    </HelmetProvider>
    </>
  )
}

export default App
