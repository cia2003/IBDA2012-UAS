import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import api from "../api/api";
import { AppContext } from "./AppContext";
import toast from "react-hot-toast"; 
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { userData } = useContext(AppContext);
  const navigate = useNavigate()

  const addToWishlist = useCallback(async (roomId) => {
    if (!userData?.id) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    try {
      const { data } = await api.post("/add-wishlist", {
        room_id: roomId,
        user_id: userData.id,
      });

      if (data) {
        toast.success("Kamar ditambahkan ke favorit");
        setWishlist((prev) => [...prev, data]); 
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Gagal menambahkan favorit";
      toast.error(msg);
      console.error(error.message);
    }
  }, [userData]);

  const getUserWishlist = useCallback(async () => {
    if (!userData?.id) return;

    try {
      const { data } = await api.get(`/wishlist?userId=${userData.id}`);
      if (data) {
        setWishlist(data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error.message);
    }
  }, [userData]);

  // Mengirimkan data registrasi untuk sewa kos (Bukan resgistrasi awal user)
  const registrationForm = useCallback(async({formData})=>{
    try {
      const {data} = await api.post('/sewa-kost', {
        user_id: userData.id,
        name: formData.name,
        room: formData.room,
        check_in: formData.date
      })
      if(data){
        toast.success("Pengajuan sewa kost berhasil dikirimkan")
        Navigate('/')
      }
    } catch (error) {
      console.error(error.message)
    }
  }, [navigate, userData])

  const value = useMemo(() => ({
    wishlist,
    addToWishlist,
    getUserWishlist,
    setWishlist,
    registrationForm
  }), [wishlist, addToWishlist, getUserWishlist, registrationForm]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};