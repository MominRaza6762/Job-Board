import { Helmet } from "react-helmet-async";
import Navbar from "../MyComponents/Navbar";
import Footer from "../MyComponents/Footer";
import "../assets/FooterPages.css";


export default function PrivacyPolicyPage() {
    return (<div className="wholePage">
        <Helmet>
        <title>Privacy Policy - Read our privacy policy to understand how we protect your data</title>
      </Helmet>

        <div>
            <Navbar />
        </div>
        <div className="main">
            <div className="details">
                <h1>Privacy Policy</h1>
                <p>
                    <span>1. Introduction</span>
                    <br />

                    Welcome to Job Board .
                    <br />
                    Your privacy is important to us, and we are committed to protecting your personal data. <br />
                    This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.
                    <br />
                    <span>2. Information We Collect</span>

                    <br />
                    We collect various types of information, including:
                    <br />
                    Personal Information: Name, email address, phone number, and resume.
                    <br />
                    Job-Related Information: Job postings, applications, and employer details.
                    <br />
                    Technical Data: IP address, browser type, and cookies for site analytics.
                    <br />
                    <span>3. How We Use Your Information</span>
                    <br />
                    We use your data for the following purposes:
                    <br />
                    To provide and improve our job board services.
                    <br />
                    To process job applications and employer postings.
                    <br />
                    To personalize user experiences and offer recommendations.
                    <br />
                    To ensure security and prevent fraud.
                    <br />
                    <span>4. Data Protection & Security</span>
                    <br />
                    We implement strong security measures, including encryption and secure databases, to protect your personal data.
                    <br />
                    However, we cannot guarantee complete security due to online threats.
                    <br />
                    <span>5. User Rights</span>
                    <br />
                    You have the right to:
                    <br />
                    Access, modify, or delete your personal data.
                    <br />
                    Opt-out of marketing communications.
                    <br />
                    Withdraw consent for data processing.
                    <br />
                    <span>6. Contact Us</span>
                    <br />
                    If you have any questions about our Privacy Policy, contact us at privacy@jobboard.com

                </p>
            </div>
            <div className="image">
                <img src="/images/privacy.jpeg" alt="privacy" />

            </div>

        </div>
        <div>
            <Footer />
        </div>

    </div>
    )
}
