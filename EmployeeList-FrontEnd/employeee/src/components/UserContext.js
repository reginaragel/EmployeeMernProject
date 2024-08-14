import { Children,createContext,useState } from "react";


export const UserContext=createContext({});

export function UserContextProvider({children,value}){

    const [userInfo,setUserInfo]=useState({});
    const [token,setToken]=useState(value.token||null);
    return(
        <UserContext.Provider value={{userInfo,setUserInfo,token,setToken}}>
            {children}
        </UserContext.Provider>
    )
}