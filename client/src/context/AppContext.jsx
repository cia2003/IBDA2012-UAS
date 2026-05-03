import { createContext, useReducer, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  kostData as initialKostData,
  staff as staffList,
  newTenant,
} from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext();

const initialState = {
  isLoggedIn: false,
  staffData: null,
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

  const role = state.staffData?.role ?? null;

  const filteredRooms = useMemo(() => {
    if (!state.staffData) return [];
    return role === "manager"
      ? initialKostData
      : initialKostData.filter(
          (kost) => kost.id === state.staffData.assignedKost,
        );
  }, [role, state.staffData]);

  const login = useCallback((email, password) => {
    dispatch({ type: "LOGIN_START" });

    const user = staffList.find(
      (s) => s.email === email && s.password === password,
    );

    if (user) {
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      toast.success(`Selamat Datang, ${user.name}!`);
    } else {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "Email atau Password salah!",
      });
      toast.error("Email atau Password salah!");
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    toast.success("Logout Berhasil");
  }, [navigate]);

  const getKostById = useCallback(
    (kostId) =>
      initialKostData.find((kost) => String(kost.id) === String(kostId)) ??
      null,
    [],
  );

  // const getStaffByKostId = useCallback((kostId) => {
  //   const kost = initialKostData.find((k) => String(k.id) === String(kostId));
  //   if (!kost) return null;
  //   return staffList.find((s) => s.id === kost.staffId) ?? null;
  // }, []);

  const getOccupantById = useCallback((occupantId) => {
    for (const kost of initialKostData) {
      for (const room of kost.rooms ?? []) {
        if (!Array.isArray(room.resident)) continue;
        const occupant = room.resident.find(
          (p) => String(p.id) === String(occupantId),
        );
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
  }, []);

  const fetchNewTenants = useCallback(
    (kostId) =>
      newTenant.filter((t) => String(t.requestedKostId) === String(kostId)),
    [],
  );

  const values = useMemo(
    () => ({
      isLoggedIn: state.isLoggedIn,
      staffData: state.staffData,
      isLoading: state.isLoading,
      error: state.error,
      role,

      allLocations: initialKostData,
      rooms: filteredRooms,

      login,
      logout,
      getKostById,
      getOccupantById,
      // getStaffByKostId,
      fetchNewTenants,
    }),
    [
      state,
      role,
      filteredRooms,
      login,
      logout,
      getKostById,
      getOccupantById,
      // getStaffByKostId,
      fetchNewTenants,
    ],
  );

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
