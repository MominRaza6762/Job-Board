import { createContext , useContext } from "react";

export const BackEndApiContext = createContext();

export const useBackEndApi =()=>{
    const {backEndApi} = useContext(BackEndApiContext);
    return backEndApi;

}

export const BackEndApiProvider =(props)=>{
    const backEndApi ="http://192.168.18.18:8000";

    return(
        <BackEndApiContext.Provider value={{backEndApi:backEndApi}}>
            {props.children}
        </BackEndApiContext.Provider>
    )
}