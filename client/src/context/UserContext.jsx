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

  const addWishlist = useCallback(
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
          (w) => String(w.roomInfo?.id) === String(roomId),
        );

        if (alreadyAdded) {
          toast("Kamar sudah ada di favorit", { icon: "ℹ️" });
          return;
        }
        const kost = kostData.find((k) => String(k.id) === String(kostId));
        const room = kost?.rooms?.find((r) => String(r.id) === String(roomId));

        const newWishlistItem = {
          wishlistId: `WL${Math.floor(Math.random() * 1000)}`,
          id: kostId,
          name: kost?.name || "Kost Baru",
          location: kost?.address || "Lokasi",
          image:
            room?.img ||
            "https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=600",
          roomInfo: {
            id: roomId,
            number: room?.roomNumber || "N/A",
            price: room?.price || 0,
            type: room?.name || "Standard",
          },
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

      setWishlist((prev) =>
        prev.filter((item) => item.wishlistId !== wishlistId),
      );
      toast.success("Berhasil dihapus dari favorit");
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const getUserWishlist = useCallback(async () => {
    try {
     if (!userData?.id) return;

      // const {data} = await api.get('/wishlist', {
      //   user_id: userId,
      // })

      // if(data){
      //   const wishList = {
      //     wishlistId: data.id,
      //     kostId: data.kost_id,
      //     name: data.kost_name,
      //     location: data.location,
      //     image: data.room_image,
      //     roomId: data.room_id,
      //     roomNumber: data.room_number,
      //     price: data.price,
      //     type: data.type
      //   }
      // }

      // setWishlist(wishlist)

      const currentUserFullData = User.find(
        (u) => String(u.id) === String(userData.id),
      );

      if (currentUserFullData?.wishlist) {
        const enriched = currentUserFullData.wishlist.map((wl) => {
          // 1. Cari Kost
          const kost = kostData.find((k) => String(k.id) === String(wl.kostId));

          // 2. Cari Kamar (Gunakan optional chaining yang kuat)
          const room = kost?.rooms?.find(
            (r) => String(r.id) === String(wl.roomId),
          );

          // DEBUG: Jika masih undefined, kita log di sini
          if (!room) {
            console.log(
              `Gagal menemukan Kamar ID: ${wl.roomId} di Kost ID: ${wl.kostId}`,
            );
            console.log("Daftar kamar yang tersedia di kost ini:", kost?.rooms);
          }

          return {
            wishlistId: wl.id,
            id: wl.kostId,
            name: kost?.name || "Kost Tidak Ditemukan",
            location: kost?.address || "Alamat tidak ada",
            image:
              room?.img ||
              "https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=600", // Fallback ke gambar kost jika gambar kamar tidak ada
            roomInfo: {
              id: room?.id,
              number: room?.roomNumber || "N/A",
              price: room?.price || 0,
              type: room?.name || "Tipe Tidak Diketahui", // Mengambil nama dari ROOM_TYPES
            },
          };
        });

        setWishlist(enriched);
        return enriched;
      }
      return wishlist;
    } catch (error) {
      console.error("Error fetching wishlist:", error.message);
    }
  }, [userData, kostData]); // kostData HARUS ada di sini agar fungsi dipicu ulang saat data siap

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
      addWishlist,
      deleteWishlist,
      getUserWishlist,
      setWishlist,
      handleRegistration,
    }),
    [wishlist, addWishlist, getUserWishlist, handleRegistration],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
