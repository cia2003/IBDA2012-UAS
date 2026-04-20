import { AppContext } from "../context/AppContext"
import { useContext } from "react"

export const useAppContext =()=>{
    const context = useContext(AppContext)
    return context;
}