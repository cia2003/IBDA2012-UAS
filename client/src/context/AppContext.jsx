      // Tetap logout di client meski server error
import { createContext, useReducer, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  kostData as initialKostData,
  staff as staffList,
  newTenant,
} from "../assets/assets";
import toast from "react-hot-toast";
import api from "../api/api";

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

  // Login admin
  const login = useCallback(async (email, password) => {
    try {
      dispatch({ type: "LOGIN_START" });

      // --- MODE DUMMY ---
      const user = staffList.find(
        (s) => s.email === email && s.password === password,
      );

      // --- MODE BACKEND ---
      // const response = await api.post('/login', { email, password });
      // const user = response.data.user; // Sesuaikan jika backend mengembalikan { data: { user: ... } }

      if (user) {
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        toast.success(`Selamat Datang, ${user.name}!`);
      } else {
        throw new Error("Email atau Password salah!");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Terjadi kesalahan";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMsg });
      toast.error(errorMsg);
      console.error(errorMsg);
    }
  }, []);

  // Logout admin
  const logout = useCallback(async () => {
    try {
      // --- MODE BACKEND ---
      // await api.post('/logout');

      // --- LOGIKA CLIENT SIDE ---
      dispatch({ type: "LOGOUT" });
      toast.success("Logout Berhasil");
      navigate("/");
    } catch (error) {
      console.error(error.message);
      dispatch({ type: "LOGOUT" });
      navigate("/");
    }
  }, [navigate]);

  // Ambil data login admin (Persist Login)
  const isAuth = useCallback(async () => {
    try {
      // --- MODE BACKEND ---
      // const response = await api.get('/is-auth');
      // if (response.data.success) {
      //   dispatch({ type: "LOGIN_SUCCESS", payload: response.data.user });
      // }
    } catch (error) {
      console.error("Session expired or not logged in");
    }
  }, []);

  useEffect(() => {
    // Panggil isAuth jika menggunakan backend untuk menjaga session saat refresh
    // isAuth();
  }, [isAuth]);

  const values = useMemo(
    () => ({
      isLoggedIn: state.isLoggedIn,
      staffData: state.staffData,
      isLoading: state.isLoading,
      error: state.error,
      role,
      login,
      logout,
      // isAuth // Buka jika mau diintegrasikan dengan backend
    }),
    [state, role, login, logout]
  );

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};