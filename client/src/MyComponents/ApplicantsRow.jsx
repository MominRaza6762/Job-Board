import { useNavigate } from "react-router-dom";

export default function ApplicantsRow({ applicant }) {
  const navigate = useNavigate();
  console.log(applicant)

  return (
    <div className="job-row" onClick={() => navigate(`/job/${job?._id}`)}>
      <span className="job-item">{applicant.user?.name}</span>
      <span className="job-item">{applicant.user?.email}</span>
      <a target="_blank" rel="noopener noreferrer" href={applicant?.fileUrl} className="job-item"><img src="/svg/resume.svg" alt="resume" /></a>
    </div>
  );
}
