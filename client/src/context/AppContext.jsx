// Tetap logout di client meski server error
import {
  createContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
} from "react";
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
  adminIsLoggedIn: false,
  staffData: null,

  userIsLoggedIn: false,
  userData: null,
  isLoading: false,
  error: null,
};

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true, error: null };
    case "AUTH_FAILURE":
      return { ...state, isLoading: false, error: action.payload };

    // --- ADMIN ACTIONS ---
    case "ADMIN_LOGIN_SUCCESS":
      return {
        ...state,
        isLoading: false,
        adminIsLoggedIn: true,
        staffData: action.payload,
      };
    case "ADMIN_LOGOUT":
      return {
        ...state,
        adminIsLoggedIn: false,
        staffData: null,
        isLoading: false,
      };

    // --- USER ACTIONS ---
    case "USER_LOGIN_SUCCESS":
      return {
        ...state,
        isLoading: false,
        userIsLoggedIn: true,
        userData: action.payload,
      };
    case "USER_LOGOUT":
      return {
        ...state,
        userIsLoggedIn: false,
        userData: null,
        isLoading: false,
      };

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
  const adminLogin = useCallback(
    async (email, password) => {
      try {
        dispatch({ type: "AUTH_START" });

        // --- MODE DUMMY ---
        const user = staffList.find(
          (s) => s.email === email && s.password === password,
        );

        // --- MODE BACKEND ---
        // const response = await api.post('/admin/login', { email, password });
        // const user = response.data.user; // Sesuaikan jika backend mengembalikan { data: { user: ... } }

        if (user) {
          dispatch({ type: "ADMIN_LOGIN_SUCCESS", payload: user });
          toast.success(`Selamat Datang, ${user.name}!`);
          if (user.role === "manager") {
            navigate("/admin/dashboard/manager");
          } else {
            navigate(`/admin/dashboard/${user.id}`);
          }
        } else {
          throw new Error("Email atau Password salah!");
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.message || error.message || "Terjadi kesalahan";
        dispatch({ type: "LOGIN_FAILURE", payload: errorMsg });
        toast.error(errorMsg);
        console.error(errorMsg);
      }
    },
    [navigate],
  );

  // Logout admin
  const adminLogout = useCallback(async () => {
    try {
      // --- MODE BACKEND ---
      // await api.post('/admin/logout');

      // --- LOGIKA CLIENT SIDE ---
      dispatch({ type: "ADMIN_LOGOUT" });
      toast.success("Logout Berhasil");
      navigate("/");
    } catch (error) {
      console.error(error.message);
      dispatch({ type: "LOGOUT" });
      navigate("/");
    }
  }, [navigate]);

  const userLogin = useCallback(
    async (email, password) => {
      dispatch({ type: "AUTH_START" });
      try {
        const { data } = await api.post("/user/login", { email, password });
        if (data) {
          dispatch({ type: "USER_LOGIN_SUCCESS", payload: data });
          toast.success("Login berhasil");
        } else {
          toast.error("Login gagal");
        }
      } catch (error) {
        toast.error("Email atau Password Salah!");
        console.error(error.message);
      }
    },
    [navigate],
  );

  const userLogout = useCallback(async () => {
    try {
      await api.get("/user/logout");
      dispatch({ type: "USER_LOGOUT" });
      toast.success("Logout Berhasil");
      navigate("/");
    } catch (error) {
      console.error(error.message);
      dispatch({ type: "LOGOUT" });
      navigate("/");
    }
  });

  const userRegister = useCallback(async (formData) => {
    dispatch({ type: "AUTH_START" });
    try {
      const { data } = await api.post("/user/post/register", formData);
      if (data) {
        dispatch({ type: "USER_LOGIN_SUCCESS", payload: data });
        toast.success("Register berhasil");
      }
    } catch (error) {}
  });

  const checkAuthStatus = useCallback(async () => {
    try {
      // Cek admin session
      // const adminRes = await api.get('/admin/is-auth');
      // if(adminRes.data.success) dispatch({ type: "ADMIN_LOGIN_SUCCESS", payload: adminRes.data.user });
      // Cek user session
      // const userRes = await api.get('/user/is-auth');
      // if(userRes.data.success) dispatch({ type: "USER_LOGIN_SUCCESS", payload: userRes.data.user });
    } catch (e) {
      console.log("No active session");
    }
  }, []);

  useEffect(() => {
    // Panggil isAuth jika menggunakan backend untuk menjaga session saat refresh
    // checkAuthStatus();
  }, [checkAuthStatus]);

  const values = useMemo(
    () => ({
      // Admin Props
      adminIsLoggedIn: state.adminIsLoggedIn,
      staffData: state.staffData,
      adminLogin,
      adminLogout,
      role,

      // User Props
      userIsLoggedIn: state.userIsLoggedIn,
      userData: state.userData,
      userLogin,
      userLogout,
      userRegister,

      // Global Props
      isLoading: state.isLoading,
      error: state.error,
    }),
    [state, role, adminLogin, adminLogout, userLogin, userLogout],
  );

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
