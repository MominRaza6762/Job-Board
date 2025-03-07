import { Link } from "react-router-dom";
import "../assets/JobCard.css";

export default function JobCard({job}) {
  return (
    <Link className="jobCard" to={`/job/${job._id}`}>
        <h3>{job.title}</h3>
        <span className="cardCompany">{job.company}</span>
        <span className="catdCategory">{job.category}</span>
        <p>{job.description}</p>  
    </Link>
  )
}
