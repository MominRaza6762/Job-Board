import { Helmet } from "react-helmet-async";
import Navbar from "../MyComponents/Navbar";
import Footer from "../MyComponents/Footer";
import "../assets/FooterPages.css";


export default function AboutPage() {
    return (<div className="wholePage">
        <Helmet>
        <title>About us - Learn more about our company, mission, and values</title>
      </Helmet>


        <div>
            <Navbar />
        </div>
        <div className="main">
            <div className="details">
                <h1>About Job Board</h1>
                <p>Job Board Name is a cutting-edge job marketplace built using the MERN stack. Our mission is to connect job seekers with employers through a seamless, secure, and efficient platform.
                    <br />
                    <span>1. Our Mission</span>
                    <br />
                    We aim to:
                    Provide a reliable job-seeking experience.
                    <br />
                    Offer powerful tools for employers to find top talent.
                    <br />Ensure a secure and inclusive hiring process.
                    <br />
                    <span>2. Why Choose Us?</span><br />
                    User-Friendly Interface: Built with React.js for seamless job searching. <br />
                    Security & Privacy: We prioritize data security with JWT authentication and encrypted storage. <br />
                    Scalability: Designed to handle thousands of job postings efficiently.

                </p>
            </div>
            <div className="image">
                <img src="/images/about.jpeg" alt="about" />

            </div>

        </div>
        <div>
            <Footer />
        </div>

    </div>
    )
}
