import { useLocation ,useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserData } from "../Contexts/UserData";

export default function Refresher() {
    const location = useLocation();
    const navigate = useNavigate();
    const {userData} = useUserData();
    

    useEffect(()=>{
        if(userData.auth===true)
            {
                if(location.pathname === "/signin" ||location.pathname === "/signin/" || location.pathname === "/rigester" || location.pathname === "/rigester/" )
                    {
                        navigate("/")
                    }   
            }

            if(userData.role==="admin")
                {
                    if(location.pathname === "/" )
                        {
                            navigate("/admin")
                        }   
                }

        

    }, [location, navigate, userData.auth])
    

  
    return(
        null
    ) ;
}
