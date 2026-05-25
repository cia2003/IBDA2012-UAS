// Tetap logout di client meski server error
import {
  createContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
  use,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  kostData as initialKostData,
  staff as staffList,
  newTenant,
} from "../assets/assets";
import toast from "react-hot-toast";
import api,  { unauthenticatedApi } from "../api/api";

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

  const isManager = state.staffData?.groups?.includes("manager") ?? false;
  const isStaff = state.staffData?.groups?.includes("staff") ?? false;
  const role = isManager ? "manager" : isStaff ? "staff" : null;

  const filteredRooms = useMemo(() => {
    if (!state.staffData) return [];
    return role === "manager"
      ? initialKostData
      : initialKostData.filter(
          (kost) => kost.id === state.staffData.assignedKost,
        );
  }, [role, state.staffData]);

  const clearLocalStorage = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
  };

  const setLocalStorage = (access, refresh, user) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem(
      "userData", 
      JSON.stringify(user)
    )
  }
  // Login admin
  const adminLogin = useCallback(
    async (email, password) => {
      try {
        dispatch({ type: "AUTH_START" });

        const response = await api.post('login/', { email, password });
        const { access, refresh, user } = response.data; // Sesuaikan jika backend mengembalikan { access, refresh, user }
 
        if (user) {
          const isManager = user?.groups?.includes("manager");
          const isStaff = user?.groups?.includes("staff");
          const role = isManager ? "manager" : isStaff ? "staff" : null;

          if (isManager) {
            setLocalStorage(access, refresh, user);

            dispatch({ type: "ADMIN_LOGIN_SUCCESS", payload: user });
            toast.success(`Selamat Datang, ${user.first_name}!`);
            navigate("/admin/dashboard/manager");
          } else if (isStaff) {
            setLocalStorage(access, refresh, user);

            dispatch({ type: "ADMIN_LOGIN_SUCCESS", payload: user });
            toast.success(`Selamat Datang, ${user.first_name}!`);
            navigate(`/admin/dashboard/${user.id}`);
          }
        } else {
          toast.error("Email atau Password Salah!");
          throw new Error("Email atau Password salah!");
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.message || error.message || "Terjadi kesalahan";
        dispatch({ type: "AUTH_FAILURE", payload: errorMsg });
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
      clearLocalStorage();

      dispatch({ type: "ADMIN_LOGOUT" });
      toast.success("Logout Berhasil");
      navigate("/");
    } catch (error) {
      console.error(error.message);
      dispatch({ type: "ADMIN_LOGOUT" });
      navigate("/");
    }
  }, [navigate]);

  const userLogin = useCallback(
    async (email, password) => {
      dispatch({ type: "AUTH_START" });
      try {
        const response = await api.post('login/', { email, password });
        const { access, refresh, user } = response.data; // Sesuaikan jika backend mengembalikan { access, refresh, user }

        if (user) {
          setLocalStorage(access, refresh, user);

          dispatch({ type: "USER_LOGIN_SUCCESS", payload: user });
          toast.success("Login berhasil");
          return user
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

  // const refreshAccessToken = useCallback(async () => {
  //   const refreshToken = localStorage.getItem("refreshToken");

  //   if (!refreshToken) return null;

  //   try {
  //     const response = await unauthenticatedApi.post(
  //       "token/refresh/",
  //       {
  //         refresh: refreshToken,
  //       }
  //     );

  //     const newAccess = response.data.access;

  //     localStorage.setItem("accessToken", newAccess);

  //     return newAccess;
  //   } catch (error) {
  //     localStorage.removeItem("accessToken");
  //     localStorage.removeItem("refreshToken");

  //     return null;
  //   }
  // }, []);

  const userLogout = useCallback(async () => {
    try {
      // await api.get("/user/logout");
      clearLocalStorage();

      dispatch({ type: "USER_LOGOUT" });
      toast.success("Logout Berhasil");
      navigate("/");
    } catch (error) {
      console.error(error.message);
      dispatch({ type: "USER_LOGOUT" });
      navigate("/");
    }
  }, [navigate]);

  const userRegister = useCallback(async (userData) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await api.post("users/", userData);
      const user = response.data;
      if (user) {
        dispatch({ type: "USER_LOGIN_SUCCESS", payload: user });
        toast.success("Register berhasil");
        return user;
      }
    } catch (error) {
      toast.error("Register gagal");
      console.error(error.message);
    }
  }, [navigate]);

  const checkAuthStatus = useCallback(async () => {
    try {
      // Cek admin session
      // const adminRes = await api.get('/admin/is-auth');
      // if(adminRes.data.success) dispatch({ type: "ADMIN_LOGIN_SUCCESS", payload: adminRes.data.user });
      // Cek user session
      // const userRes = await api.get('/user/is-auth');
      // if(userRes.data.success) dispatch({ type: "USER_LOGIN_SUCCESS", payload: userRes.data.user });
    } catch (e) {
      console.error("No active session");
    }
  }, []);
  useEffect(() => { 
    const initializeAuth = async () => { 
      const token = localStorage.getItem("accessToken"); 
      const unparseData = localStorage.getItem("userData");

      if (!token || !unparseData) return; 
      
      const storedUser = JSON.parse(unparseData); 

      const groups = storedUser?.groups ?? []; 
      const isManager = groups.includes("manager"); 
      const isStaff = groups.includes("staff"); 

      if (isManager || isStaff) { 
        try { 
          dispatch({ type: "ADMIN_LOGIN_SUCCESS", payload: storedUser}); 

        } catch (error) { 
          console.error(error); 

          adminLogout(); 
        } } else { 
            try { dispatch({ 
              type: "USER_LOGIN_SUCCESS", 
              payload: storedUser}); 

            } catch (error) { 
              console.error(error); userLogout(); 
            } 
          } 
        }; 
        
        initializeAuth(); 
      }, [userLogout, adminLogout]);


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
