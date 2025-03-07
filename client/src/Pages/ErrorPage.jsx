import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async";
import "../../src/assets/ErrorPage.css"
export default function ErrorPage() {
  return (
    <div className="errorContent">
      <Helmet>
        <title>404 - Page Not Found | Oops! The page you are looking for does not exist</title>
      </Helmet>
        <img src="/images/404page.jpeg" alt="" />
        <h2>Whoops! This page doesn&apos;t exist </h2>
        <p>You may have mistyped the address or the page may have moved.</p>
        <Link to={"/"}>Go Back Home</Link>
      
    </div>
  )
}
