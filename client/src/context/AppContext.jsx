import { createContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { kostData, staff as staffList, ROLES } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();

    const initialState = {
        isLoggedIn: false,
        staffData: null,
        staffRole: null,
        isLoading: false,
        error: null
    };

    const AuthReducer = (state, action) => {
        switch (action.type) {
            case "LOGIN_START":
                return { ...state, isLoading: true, error: null };
            case "LOGIN_SUCCESS":
                return {
                    ...state,
                    isLoading: false,
                    isLoggedIn: true,
                    staffData: action.payload,
                    staffRole: action.payload.role
                };
            case "LOGIN_FAILURE":
                return { ...state, isLoading: false, error: action.payload };
            case "LOGOUT":
                return initialState;
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(AuthReducer, initialState);
    const [filteredRooms, setFilteredRooms] = useState([]);

    const login = (email, password) => {
        dispatch({ type: "LOGIN_START" });
        const user = staffList.find(s => s.email === email && s.password === password);
        if (user) {
            dispatch({ type: "LOGIN_SUCCESS", payload: user });
            fetchRoomData(user);
            navigate(user.role === ROLES.MANAGER ? "/dashboard/manager" : `/dashboard/staff/${user.id}`)
            console.log("Data User: ", user)
        } else {
            dispatch({ type: "LOGIN_FAILURE", payload: "Email atau Password salah!" });
        }
    };

    const fetchRoomData = (user) => {
        if (user.role === ROLES.MANAGER) {
            setFilteredRooms(kostData);
            console.log("Data Kost (Manager): ", kostData);
        } else if (user.role === ROLES.STAFF) {
            const assignedData = kostData.filter(kost => kost.id === user.assignedKost);
            setFilteredRooms(assignedData);
            console.log("Data Kost (Staff): ", assignedData);
        }
    };

    const logout = () => {
        dispatch({ type: "LOGOUT" });
        setFilteredRooms([]);
        navigate("/login");
    };

    const values = {
        isLoggedIn: state.isLoggedIn,
        staffData: state.staffData,
        staffRole: state.staffRole,
        isLoading: state.isLoading,
        error: state.error,
        
        rooms: filteredRooms,
        allLocations: kostData,

        // Functions
        login,
        logout
    };

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    );
};