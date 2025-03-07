import { useNavigate } from "react-router-dom";
import { useUserData } from "../Contexts/UserData";

export default function JobRow({ job  , setShowJob = ()=>{}}) {
  const navigate = useNavigate();
  const {userData} = useUserData();

  return (
    <div className="job-row" onClick={userData.role==="admin"?()=>setShowJob({show:true, jobId:job._id}):() => navigate(`/job/${job._id}`)}>
      <span className="job-item">{job.title}</span>
      <span className="job-item">{job.category}</span>
      <span className="job-item">{job.company}</span>
      <span className="job-item">{job.salary}</span>
      <span className="job-item">{job.description}</span>
    </div>
  );
}
