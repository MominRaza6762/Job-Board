import { Link } from "react-router-dom";
import "../assets/Footer.css";

export default function Footer() {
  return (
    <div className="footer">
        <div className="footerLinks">

            <Link to={"/"} className="div">
                Home
            </Link>         
            <Link to={"/about"} className="div">
                About
            </Link>         
            <Link to={"/privacy"} className="div">
                Privacy Policy
            </Link>
            <Link to={"/terms"} className="div">
                Terms & Conditions
            </Link>

         </div>

         <div className="footerContact">

            <div>
                <a href="https://mail.google.com/">
                <img src="/svg/email.svg" alt="email" />
                </a>
            </div>
            <div>
            <a href="https://facebook.com/">
            <img src="/svg/fb.svg" alt="facebook" />
            </a>
            </div>
            <div>
            <a href="https://instagram.com/">
            <img src="/svg/insta.svg" alt="instagram" />
            </a>
            </div>
            <div>
            <a href="https://linkedin.com/">
            <img src="/svg/link.svg" alt="linked in" />
            </a>
            </div>

         </div>

         <div className="footerCopyRight">
            &copy;  2025 JobBoard
         </div>


    </div>
  )
}
