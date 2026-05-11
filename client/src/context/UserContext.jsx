import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../api/api";
import { AppContext } from "./AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { kostData, User } from "../assets/assets";


export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const addToWishlist = useCallback(
    async (kostId, roomId) => {
      if (!userData?.id) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }
      try {
        // const { data } = await api.post("/add-wishlist", {
        //   room_id: roomId,
        //   user_id: userData.id,
        // });

        // if (data) {
        //   toast.success("Kamar ditambahkan ke favorit");
        //   setWishlist((prev) => [...prev, data]);
        // }

        const alreadyAdded = wishlist.some(
          (w) => w.kostId === kostId && w.roomId === roomId,
        );

        if (alreadyAdded) {
          toast("Kamar sudah ada di favorit", { icon: "ℹ️" });
          return;
        }

        const newWishlistItem = {
          id: `WL${Math.floor(Math.random() * 1000)}`, // Generate dummy ID
          kostId: kostId,
          roomId: roomId,
        };

        setWishlist((prev) => [...prev, newWishlistItem]);
        toast.success("Kamar ditambahkan ke favorit");
      } catch (error) {
        const msg =
          error.response?.data?.message || "Gagal menambahkan favorit";
        toast.error(msg);
        console.error(error.message);
      }
    },
    [userData, wishlist],
  );

  const deleteWishlist = useCallback(async (wishlistId) => {
    try {
      // const { data } = await api.delete("/hapus-wishlist", {
      //   wishlist: wishlistId,
      //   user: userData.id,
      // });

      // if (data) {
      //   toast.success("Berhasil dihapus dari favorit");
      // }

      // setWishlist(prev.filter((item) => item.wishlistId !== wishlistId));
      toast.success("Berhasil dihapus dari favorit");
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const getUserWishlist = useCallback(async () => {
    if (!userData?.id) return;

    try {
      const currentUserFullData = User.find(
        (u) => String(u.id) === String(userData.id),
      );

      if (currentUserFullData?.wishlist) {
        // Enrich each wishlist item with kost + room data
        const enriched = currentUserFullData.wishlist.map((wl) => {
          const kost = kostData.find((k) => k.id === wl.kostId);
          const room = kost?.rooms?.find((r) => r.id === wl.roomId);

          return {
            wishlistId: wl.id, // used by deleteWishlist & key prop
            id: wl.kostId, // used by navigate(`/kost/${item.id}`)
            name: kost?.name,
            location: kost?.location,
            image: kost?.image, // or room?.image if rooms have their own image
            roomInfo: {
              id: room?.id,
              number: room?.number,
              price: room?.price,
            },
          };
        });

        setWishlist(enriched);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error.message);
    }
  }, [userData]);

  // Mengirimkan data registrasi untuk sewa kos (Bukan resgistrasi awal user)
  const handleRegistration = useCallback(
    async (formData) => {
      // Langsung terima object formData
      try {
        // Simulasi loading
        await new Promise((resolve) => setTimeout(resolve, 800));

        // -- MODE BACKEND --
        // const { data } = await api.post("/sewa-kost", {
        //   user_id: currentUser.id, // Ambil dari Auth/User context jika ada
        //   name: formData.fullname,
        //   kost_id: formData.kostId,
        //   room_id: formData.roomId,
        //   check_in: formData.checkInDate,
        // });

        // -- MODE DUMMY --
        console.log("Memproses pendaftaran:", formData);

        toast.success("Pengajuan sewa berhasil dikirimkan!");
        navigate("/"); // Kembali ke homepage setelah berhasil
        return true;
      } catch (error) {
        console.error("Registration Error:", error.message);
        toast.error("Gagal mengirim pengajuan");
        return false;
      }
    },
    [navigate],
  );

  useEffect(() => {
    getUserWishlist();
  }, [getUserWishlist]);

  const value = useMemo(
    () => ({
      wishlist,
      addToWishlist,
      deleteWishlist,
      getUserWishlist,
      setWishlist,
      handleRegistration,
    }),
    [wishlist, addToWishlist, getUserWishlist, handleRegistration],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
