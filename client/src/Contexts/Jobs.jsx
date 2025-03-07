import { createContext , useContext, useState } from "react";

export const JobsContext = createContext();

export const useJobs = ()=>{
    const {jobs , setJobs} = useContext(JobsContext);
    return {jobs , setJobs};
}

export const JobsProvider = (props)=>{
    const [jobs , setJobs] = useState([]);
    return(
        <JobsContext.Provider value={{jobs:jobs , setJobs:setJobs}}>
            {props.children}
        </JobsContext.Provider>
    )
} 