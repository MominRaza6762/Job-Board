import { createContext , useContext } from "react";

export const BackEndApiContext = createContext();

export const useBackEndApi =()=>{
    const {backEndApi} = useContext(BackEndApiContext);
    return backEndApi;

}

export const BackEndApiProvider =(props)=>{
    const backEndApi ="https://job-board-liart-seven.vercel.app";

    return(
        <BackEndApiContext.Provider value={{backEndApi:backEndApi}}>
            {props.children}
        </BackEndApiContext.Provider>
    )
}
