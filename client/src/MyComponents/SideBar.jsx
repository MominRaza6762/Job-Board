import { useState } from "react";
import "../assets/AdminPage.css";

export default function SideBar({ selectedPage, setSelectedPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (page) => {
    localStorage.setItem("adminNav",page)
    setSelectedPage(page);
    setIsOpen(false); 
  };

  return (<>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
          <div className={`sidebar ${isOpen ? "open" : null}`}>
      <ul>
        <li
          className={selectedPage === "Dashboard" ? "active" : null}
          onClick={() => handleNavClick("Dashboard")}
        >
            <img src="/svg/dashboard.svg" alt="dashboard" />
          Dashboard
        </li>
        <li
          className={selectedPage === "Job Listings" ? "active" : null}
          onClick={() => handleNavClick("Job Listings")}
        >
            <img src="/svg/jobs.svg" alt="jobs" />
          Job Listings
        </li>
        <li
          className={selectedPage === "Employers" ? "active" : null}
          onClick={() => handleNavClick("Employers")}
        >
            <img src="/svg/employer.svg" alt="employers" />
          Employers
        </li>
        <li
          className={selectedPage === "Job Seekers" ? "active" : null}
          onClick={() => handleNavClick("Job Seekers")}
        >
            <img src="/svg/job-seeker.svg" alt="job-seekers" />
          Job Seekers
        </li>
        <li
          className={selectedPage === "Applications" ? "active" : null}
          onClick={() => handleNavClick("Applications")}
        >
            <img src="/svg/applications.svg" alt="applications" />
          Applications
        </li>
      </ul>
    </div>
    </>);
}
