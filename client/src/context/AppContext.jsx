import { createContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import {
  kostData as initialKostData,
  staff as staffList,
  ROLES,
  newTenant,
} from "../assets/assets";

import { api } from "../axios/axios";

export const AppContext = createContext();

const initialState = {
  isLoggedIn: false,
  staffData: null,
  staffRole: null,
  isLoading: false,
  error: null,
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
        staffRole: action.payload.role,
      };
    case "LOGIN_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // Derived: kamar yang bisa diakses sesuai role
  const filteredRooms =
    state.staffRole === ROLES.MANAGER
      ? initialKostData
      : initialKostData.filter(
          (kost) => kost.id === state.staffData?.assignedKost,
        );

  const login = async (email, password) => {
    dispatch({ type: "LOGIN_START" });

    const res = await api.post("/login/", { email, password });
    const { access, refresh, user } = res.data;
    if (user) {
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      navigate(
        user.role === ROLES.MANAGER
          ? "/dashboard/manager"
          : `/dashboard/staff/${user.id}`,
      );
    } else {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "Email atau Password salah!",
      });
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const getKostById = async (kostId) => {
    const res = await api.get(`/kosts/${kostId}/`);
    return res.data;
  };

  const getStaffByKostId = (kostId) => {
    const kost = initialKostData.find((k) => String(k.id) === String(kostId));
    if (!kost) return null;
    return staffList.find((s) => s.id === kost.staffId) ?? null;
  };

  const getOccupantById = (occupantId) => {
    for (const kost of initialKostData) {
      for (const room of kost.rooms ?? []) {
        if (!Array.isArray(room.resident)) continue;
        const occupant = room.resident.find((p) => p.id == occupantId);
        if (occupant) {
          return {
            ...occupant,
            roomNumber: room.roomNumber,
            kostName: kost.name,
          };
        }
      }
    }
    return null;
  };

  const fetchNewTenants = (kostId) => {
    const data = newTenant.filter(
      (t) => t.requestedKostId === kostId
    );
    return data
  };

  const values = {
    // Auth state
    isLoggedIn: state.isLoggedIn,
    staffData: state.staffData,
    staffRole: state.staffRole,
    isLoading: state.isLoading,
    error: state.error,

    // Data
    allLocations: initialKostData,
    rooms: filteredRooms,

    // Functions
    login,
    logout,
    getKostById,
    getOccupantById,
    getStaffByKostId,
    fetchNewTenants
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
