import { AppContext } from "../context/AppContext"
import { useContext } from "react"
import { ManagerContext } from "../context/ManagerContext";
import { StaffContext } from "../context/StaffContext";

export const useAppContext =()=>{
    const context = useContext(AppContext)
    return context;
}

export const useManagerContext =()=>{
    const context = useContext(ManagerContext)
    return context;
}

export const useStaffContext=()=>{
    const context = useContext(StaffContext)
    return context
}