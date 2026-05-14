import { useParams, useNavigate } from "react-router-dom";
import {
  useAppContext,
  useManagerContext,
  useUserContext,
} from "../../../hook/useContext";
import { useCallback, useEffect, useState } from "react";
import {
  MapPin,
  Maximize2,
  User,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Phone,
  Heart,
  Trash2,
  BookmarkPlus,
} from "lucide-react";
import toast from "react-hot-toast";

import styles from "./userRoomDetail.module.css";

function UserRoomDetail() {
  const { kostId, roomId } = useParams();
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState(null);
  const { userIsLoggedIn } = useAppContext();
  const { getRoomDetails } = useManagerContext();
  const { getUserWishlist, addWishlist, deleteWishlist, wishlist } =
    useUserContext();
  const [wishlistStatus, setWishlistStatus] = useState(false);

  const fetchRoomDetails = useCallback(async () => {
    if (!kostId || !roomId) return;

    try {
      const data = await getRoomDetails(kostId, roomId);
      if (data) {
        setRoomDetails(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [roomId, kostId, getRoomDetails]);

  const fetchIsRoomWishlist = useCallback(async () => {
    if (!roomId) return;
    try {
      // Pastikan await jika ini memanggil API
      const userWishlist = await getUserWishlist();

      // Cari apakah ada room yang ID-nya cocok di dalam array wishlist
      const isBookmarked = wishlist.find(
        (item) => String(item.roomInfo?.id) === String(roomId),
      );

      console.log(isBookmarked);

      setWishlistStatus(!!isBookmarked);
    } catch (error) {
      console.error("Gagal cek wishlist:", error);
    }
  }, [getUserWishlist, roomId]);

  const handleWishlist = async () => {
    if (!userIsLoggedIn) {
      return navigate("/login");
    }

    try {
      if (!wishlistStatus) {
        await addWishlist(kostId, roomId);
        setWishlistStatus(true);
      } else {
        // Perbaikan di sini: tambahkan await dan pastikan userWishlist adalah array
        const targetWishlist = wishlist.find(
          (item) => String(item.roomInfo?.id) === String(roomId),
        );

        if (targetWishlist) {
          await deleteWishlist(targetWishlist.wishlistId); // Gunakan wishlistId yang benar
          setWishlistStatus(false);
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
    fetchIsRoomWishlist();
  }, [fetchRoomDetails, fetchIsRoomWishlist]);

  if (!roomDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-indigo-200 rounded-full"></div>
          <p className="text-zinc-400 font-medium">
            Menyiapkan kamar idamanmu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.container}>
        {/* Kolom Kiri: Galeri & Detail */}
        <div className={styles.leftColumn}>
          {/* Main Image Gallery */}
          <div className={styles.galleryWrapper}>
            <div className={styles.imageCard}>
              <img
                src={roomDetails.images || roomDetails.img}
                className={styles.mainImg}
                alt="Room"
              />
            </div>
          </div>

          {/* Room Titles */}
          <div className={styles.titleSection}>
            <div className={styles.badgeWrapper}>
              <span className={styles.roomBadge}>
                Kamar {roomDetails.roomNumber}
              </span>
            </div>
            <h1 className={styles.mainTitle}>
              Kamar {roomDetails.roomNumber} — {roomDetails.kostName}
            </h1>
            <p className={styles.locationText}>
              <MapPin size={18} className={styles.iconPrimary} />
              {roomDetails.kostAddress}
            </p>
          </div>

          <hr className={styles.divider} />

          {/* Quick Specs */}
          <div className={styles.specsGrid}>
            <div className={styles.specItem}>
              <div className={styles.iconBox}>
                <Maximize2 size={24} />
              </div>
              <div>
                <p className={styles.specLabel}>Luas Kamar</p>
                <p className={styles.specValue}>
                  {roomDetails.size || "3x4"} m²
                </p>
              </div>
            </div>
            <div className={styles.specItem}>
              <div className={styles.iconBox}>
                <User size={24} />
              </div>
              <div>
                <p className={styles.specLabel}>Kapasitas</p>
                <p className={styles.specValue}>
                  {roomDetails.capacity || 1} Orang
                </p>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className={styles.facilitySection}>
            <h3 className={styles.sectionTitle}>Fasilitas Kamar</h3>
            <div className={styles.facilityGrid}>
              {roomDetails.facilities?.map((f, i) => (
                <div key={i} className={styles.facilityItem}>
                  <CheckCircle2 size={18} className={styles.iconCheck} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Sticky Price Card */}
        <div className={styles.rightColumn}>
          <div className={styles.stickySidebar}>
            <div className={styles.priceCard}>
              <div className={styles.priceHeader}>
                <p className={styles.priceLabel}>Mulai dari</p>
                <h2 className={styles.priceValue}>
                  Rp {roomDetails.price?.toLocaleString("id-ID")}
                  <span className={styles.perMonth}>/bln</span>
                </h2>
              </div>

              <div className={styles.trustSignals}>
                <div className={styles.signalItem}>
                  <ShieldCheck size={18} className={styles.iconPrimary} />
                  Keamanan Terjamin
                </div>
                <div className={styles.signalItem}>
                  <Zap size={18} className={styles.iconPrimary} />
                  Sudah termasuk Listrik*
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                <button
                  onClick={() => navigate(`/registration/${kostId}/${roomId}`)}
                  className="flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-800 hover:text-white px-5 py-2.5 rounded-2xl transition-all duration-300 font-bold text-sm border border-red-100 shadow-sm w-fit"
                >
                  <BookmarkPlus size={20} />
                  Pesan Kamar
                </button>
                <button
                  onClick={handleWishlist}
                  className="flex items-center justify-center bg-red-50 text-red-600 gap-2 hover:bg-red-600 hover:text-white px-5 py-2.5 rounded-2xl transition-all duration-300 font-bold text-sm border border-red-100 shadow-sm w-fit"
                >
                  {!wishlistStatus ? (
                    <>
                      <Heart size={20} />
                      <span>Favorite</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={20} />
                      <span>Unfavorite</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserRoomDetail;
