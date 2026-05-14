import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import api, { formDataApi, unauthenticatedApi } from "../api/api";
import { AppContext } from "./AppContext";
import toast from "react-hot-toast"; 
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../hook/useContext";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistKostDetail, setWishlistKostDetail] = useState([])
  const { userData } = useAppContext();
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
    } catch (error) {
      console.error("Error fetching wishlist:", error.message);
      return null;
    }
  }, [userData?.id]);

  const getUserWishlistKostDetail = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!userData?.id || !accessToken) return;

    try {
      const response = await api.get(`wishlists/kost-details/`);
      const { wishlists } = response.data;

      if (wishlists) {
        setWishlistKostDetail(wishlists);
      }
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
        await getUserWishlistKostDetail();

        console.log(wishlist);
        return response.data;
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Gagal menambahkan favorit";
      toast.error(msg);
      return null;
    }
  }, [navigate, userData, getUserWishlist, getUserWishlistKostDetail]);

  const removeWishlist = useCallback(async (id) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!userData?.id || !accessToken) return false;

    try {
      const response = await api.delete(`wishlists/${id}/`);

      if (response.status === 204) {
        toast("Kamar dihapus dari wishlist", { icon: "🗑️" });

        // 🔥 penting: refresh dari server
        await getUserWishlist();
        await getUserWishlistKostDetail();

        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [userData, getUserWishlist, getUserWishlistKostDetail]);

  const handleRegistration = useCallback(async (formData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken || !userData) return false;

      let newUserData = userData;

      const updateUserData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
      };

      if (
        userData.first_name !== updateUserData.first_name ||
        userData.last_name !== updateUserData.last_name
      ) {
        const updateUserResponse = await api.put(
          `users/${userData.id}/`,
          updateUserData
        );

        newUserData = updateUserResponse.data;
      };

      const tenantData = {
        user: newUserData.id,
        gender: formData.gender,
        phone_number: formData.phoneNumber,
        occupation: formData.occupation,
        institution: formData.institution,
        identity_type: formData.identityType,
        identity_card: formData.identityCard,
      };

      // 🔥 UPSERT TENANT
      let resTenant;


      const existing = await api.get(`tenants/${newUserData.id}/`);

      if (existing?.data) {
        resTenant = existing.data;
      } else {
        const tenantResponse = await formDataApi.post(
          "tenants/",
          tenantData
        );
        resTenant = tenantResponse.data;
      };

      // 🔥 FIX roomId typo
      const leaseData = {
        tenant: resTenant.user,
        room: formData.roomId,
        start_date: formData.checkInDate,
        end_date: formData.endDate,
      };

      const response = await api.post("leases/", leaseData);

      if (response.data) {
        toast.success("Pengajuan sewa kost berhasil dikirimkan");
        navigate("/");
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [navigate, userData]);

  const value = useMemo(() => ({
    wishlist,
    wishlistKostDetail,
    addToWishlist,
    removeWishlist,
    getUserWishlist,
    getUserWishlistKostDetail, 
    setWishlist,
    handleRegistration,
    getUnauthenticatedKostData,
    getUnauthenticatedKostDetail,
    getUnauthenticatedRooms,
    getUnauthenticatedRoomTypes,
  }), [
    wishlist,
    wishlistKostDetail,
    addToWishlist,
    removeWishlist,
    getUserWishlist,
    getUserWishlistKostDetail,
    handleRegistration,
    getUnauthenticatedKostData,
    getUnauthenticatedKostDetail,
    getUnauthenticatedRooms,
    getUnauthenticatedRoomTypes,
  ]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};