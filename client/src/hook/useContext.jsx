import { AppContext } from "../context/AppContext"
import { useContext } from "react"
import { ManagerContext } from "../context/ManagerContext";

export const useAppContext =()=>{
    const context = useContext(AppContext)
    return context;
}

export const useManagerContext =()=>{
    const context = useContext(ManagerContext)
    return context;
}