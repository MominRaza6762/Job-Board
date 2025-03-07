import { createContext , useContext, useState } from "react";
import axios from "axios";
import { useBackEndApi } from "./BackEndApi";

 const UserDataContext = createContext();




export const useUserData = ()=>{
    const {getUser ,userData , setUserData} = useContext(UserDataContext);
    return { getUser, userData , setUserData};
}

export const UserDataProvider = (props)=>{
    const [userData , setUserData] = useState( JSON.parse(localStorage.getItem("userData")) || {auth:false});
    const backEndApi = useBackEndApi();

      const getUser =async ()=>{
        try
        {
          const response = await axios.get(`${backEndApi}/user/me`,{headers:{
            Authorization:localStorage.getItem("token")
          }});
          const {userId , email , name , role }= response.data.user;     
          const newUserData ={auth:true, userId ,email, name, role}

          if (JSON.stringify(userData) !== JSON.stringify(newUserData)) {
            setUserData(newUserData);
            localStorage.setItem("userData", JSON.stringify(newUserData));
        }
        }
        catch(error)
        {
          console.log("User is Not logged in");
          localStorage.removeItem("userData");
          setUserData({auth:false})
        }
        
      }


    return(
        <UserDataContext.Provider value={{getUser,userData , setUserData}}>
            {props.children}
        </UserDataContext.Provider>
    )
} 