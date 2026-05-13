import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import api, { unauthenticatedApi } from "../api/api";
import { AppContext } from "./AppContext";
import toast from "react-hot-toast"; 
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { userData } = useContext(AppContext);
  const navigate = useNavigate()

  // Ini untuk mendapatkan data kost tanpa perlu token, digunakan di halaman Home agar bisa menampilkan data kost meskipun user belum login
  const getUnauthenticatedKostData = useCallback(async () => {
    try {
      const response = await unauthenticatedApi.get("kosts/");
      const { kosts } = response.data;

      return kosts;
    } catch (error) {
      console.error("Error fetching kost data:", error.message);
      return [];
    }
  }, []);

  // Ini untuk mendapatkan detail kost tanpa perlu token, digunakan di halaman KostDetail agar bisa menampilkan data kost meskipun user belum login
  const getUnauthenticatedKostDetail = useCallback(async (kostId) => {
    try {
      const response = await unauthenticatedApi.get(`kosts/${kostId}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching kost detail:", error.message);
      return null;
    }
  }, []);

  const getUnauthenticatedRooms = useCallback(async (kostId) => {
    try {
      const response = await unauthenticatedApi.get(`rooms/`);
      return response.data.rooms;
    } catch (error) {
      console.error("Error fetching rooms:", error.message);
      return [];
    }
  }, []);

  const getUnauthenticatedRoomTypes = useCallback(async () => {
    try {
      const response = await unauthenticatedApi.get("roomtypes/");
      const { room_types } = response.data;

      return room_types;
    } catch (error) {
      console.error("Error fetching room types:", error.message);
      return [];
    }
  }, []);

  const getUserWishlist = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!userData?.id || !accessToken) return;

    try {
      const response = await api.get(`wishlists/`);
      const { wishlists } = response.data;

      if (wishlists) {
        setWishlist(wishlists);
      }

      console.log(wishlists)
    } catch (error) {
      console.error("Error fetching wishlist:", error.message);
      return null;
    }
  }, [userData?.id]);

  const addToWishlist = useCallback(async (roomId) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken || !userData?.id) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/login");
      return null;
    }

    try {
      const response = await api.post("wishlists/", {
        room: roomId,
        user: userData.id,
      });

      if (response.data) {
        toast.success("Kamar ditambahkan ke favorit ❤️");

        // 🔥 penting: refresh dari server
        await getUserWishlist();

        return response.data;
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Gagal menambahkan favorit";
      toast.error(msg);
      return null;
    }
  }, [navigate, userData, getUserWishlist]);

  const removeWishlist = useCallback(async (id) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!userData?.id || !accessToken) return false;

    try {
      const response = await api.delete(`wishlists/${id}/`);

      if (response.status === 204) {
        toast("Kamar dihapus dari wishlist", { icon: "🗑️" });

        // 🔥 penting: refresh dari server
        await getUserWishlist();

        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [userData, getUserWishlist]);

  // Mengirimkan data registrasi untuk sewa kos (Bukan resgistrasi awal user)
  const registrationForm = useCallback(async({formData})=>{
    try {
      const {data} = await api.post('leases/', {
        user_id: userData.id,
        name: formData.name,
        room: formData.room,
        check_in: formData.date
      })
      if(data){
        toast.success("Pengajuan sewa kost berhasil dikirimkan")
        navigate('/')
      }
    } catch (error) {
      console.error(error.message)
    }
  }, [navigate, userData])

  const value = useMemo(() => ({
    wishlist,
    addToWishlist,
    removeWishlist,
    getUserWishlist,
    setWishlist,
    registrationForm,
    getUnauthenticatedKostData,
    getUnauthenticatedKostDetail,
    getUnauthenticatedRooms,
    getUnauthenticatedRoomTypes,
  }), [
    wishlist,
    addToWishlist,
    removeWishlist,
    getUserWishlist,
    registrationForm,
    getUnauthenticatedKostData,
    getUnauthenticatedKostDetail,
    getUnauthenticatedRooms,
    getUnauthenticatedRoomTypes,
  ]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};