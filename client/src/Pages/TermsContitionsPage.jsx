import { Helmet } from "react-helmet-async";
import Navbar from "../MyComponents/Navbar";
import Footer from "../MyComponents/Footer";
import "../assets/FooterPages.css";


export default function TermsContitionsPage() {
    return (<div className="wholePage">
        <Helmet>
  <title>Terms and Conditions - Review our terms and conditions before using our services</title>
</Helmet>

        <div>
            <Navbar />
        </div>
        <div className="main">
            <div className="details">
                <h1>Terms and Conditions</h1>
                <p>
               <span>1. Introduction</span>
               <br /> 
These Terms and Conditions govern your use of Job Board .
<br /> 
By accessing our platform, you agree to comply with these Terms.
<br />
<span>2. User Responsibilities</span>
<br />
You must provide accurate information when registering.
<br />
Employers must only post legitimate job opportunities.
<br />
Users must not engage in fraudulent activities or spamming.
<br />
<span>3. Job Posting Guidelines</span>
<br />
Job listings must not include misleading or discriminatory content.
<br />
Employers must respect user data and avoid unauthorized communication.
<br />
<span>
4. Account Termination
</span>
<br />
We reserve the right to suspend or terminate accounts that violate our Terms, including fraudulent activities, spamming, or abusive behavior.
<br />
<span>
5. Limitation of Liability
</span>
<br />
We are not responsible for employment decisions, third-party content, or damages resulting from the use of our platform.
<br />
<span>
6. Contact Us
</span>
<br />
For any legal inquiries, reach out to legal@jobboard.com

                </p>
            </div>
            <div className="image">
                <img src="/images/terms.jpeg" alt="terms and contitions" />

            </div>

        </div>
        <div>
            <Footer />
        </div>

    </div>
    )
}
