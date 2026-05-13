import { useParams, useNavigate } from "react-router-dom";
import { useAppContext, useStaffContext, useUserContext } from "../../../hook/useContext";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  MapPin,
  Maximize2,
  User,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Heart,
  Trash2,
  BookmarkPlus,
} from "lucide-react";

import styles from "./userRoomDetail.module.css";

function UserRoomDetail() {
  const { kostId, roomId } = useParams();
  const navigate = useNavigate();

  const [roomDetails, setRoomDetails] = useState(null);
  const { getRoomById } = useStaffContext();

  const {
    wishlist,
    addToWishlist,
    removeWishlist,
    getUserWishlist,
  } = useUserContext();

  const { userData } = useAppContext();

  // Fetch detail kamar
  const fetchRoomDetails = useCallback(async () => {
    if (!kostId || !roomId) return;

    try {
      const data = await getRoomById(roomId);

      if (data) {
        setRoomDetails(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [roomId, kostId, getRoomById]);


  useEffect(() => {
    if (userData?.id) {
      getUserWishlist();
    }

    console.log("userEffect:", wishlist);
    console.log("userEffect:", userData?.id);
    console.log("userEffect:", userData);

    fetchRoomDetails();
  }, [userData?.id, getUserWishlist, fetchRoomDetails]);

  // Cari apakah room ini sudah ada di wishlist
  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];

  const existingWishlist = safeWishlist.find(
    (item) =>
      String(item.room?.id || item.room) === String(roomId)
  );

  const isFavorite = !!existingWishlist;

  const isDisabled = roomDetails?.is_available === false;

  // Handle wishlist
  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled) return;

    try {
      // Tambah wishlist

      console.log(isFavorite);
      if (!isFavorite) {
        const result = await addToWishlist(roomId);


        if (result) {
          toast.success("Kamar ditambahkan ke wishlist ❤️");
        }
      }

      // Hapus wishlist
      else {
        const success = await removeWishlist(existingWishlist.id);
        console.log(success)
        if (success) {
          toast.success("Wishlist dihapus 🗑️");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        {/* LEFT */}
        <div className={styles.leftColumn}>
          <div className={styles.galleryWrapper}>
            <div className={styles.imageCard}>
              <img
                src={roomDetails?.image || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200"}
                className={styles.mainImg}
                alt="Room"
              />
            </div>
          </div>

          <div className={styles.titleSection}>
            <div className={styles.badgeWrapper}>
              <span className={styles.roomBadge}>
                Kamar {roomDetails?.name}
              </span>
            </div>

            <h1 className={styles.mainTitle}>
              Kamar {roomDetails?.name} — {roomDetails?.kost?.name}
            </h1>

            <p className={styles.locationText}>
              <MapPin size={18} className={styles.iconPrimary} />
              {roomDetails?.kost?.address}
            </p>
          </div>

          <hr className={styles.divider} />

          {/* SPECS */}
          <div className={styles.specsGrid}>
            <div className={styles.specItem}>
              <div className={styles.iconBox}>
                <Maximize2 size={24} />
              </div>

              <div>
                <p className={styles.specLabel}>Luas Kamar</p>

                <p className={styles.specValue}>
                  {roomDetails?.room_type?.size || "3x4"} m²
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
                  {roomDetails?.capacity || 1} Orang
                </p>
              </div>
            </div>
          </div>

          {/* FACILITIES */}
          <div className={styles.facilitySection}>
            <h3 className={styles.sectionTitle}>Fasilitas Kamar</h3>

            <div className={styles.facilityGrid}>
              {roomDetails?.facilities?.map((facility) => (
                <div key={facility.id} className={styles.facilityItem}>
                  <CheckCircle2
                    size={18}
                    className={styles.iconCheck}
                  />
                  <span>{facility.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.rightColumn}>
          <div className={styles.stickySidebar}>
            <div className={styles.priceCard}>
              <div className={styles.priceHeader}>
                <p className={styles.priceLabel}>Mulai dari</p>

                <h2 className={styles.priceValue}>
                  Rp{" "}
                  {Number(
                    roomDetails?.room_type?.price || 0
                  ).toLocaleString("id-ID")}

                  <span className={styles.perMonth}>/bln</span>
                </h2>
              </div>

              <div className={styles.trustSignals}>
                <div className={styles.signalItem}>
                  <ShieldCheck
                    size={18}
                    className={styles.iconPrimary}
                  />
                  Keamanan Terjamin
                </div>

                <div className={styles.signalItem}>
                  <Zap
                    size={18}
                    className={styles.iconPrimary}
                  />
                  Sudah termasuk Listrik*
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    navigate(`/registration/${kostId}/${roomId}`)
                  }
                  className="flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-800 px-5 py-2.5 rounded-2xl transition-all duration-300 font-bold text-sm shadow-sm"
                >
                  <BookmarkPlus size={20} />
                  Pesan
                </button>

                <button
                  onClick={handleWishlist}
                  className="flex items-center justify-center bg-red-50 text-red-600 gap-2 hover:bg-red-600 hover:text-white px-5 py-2.5 rounded-2xl transition-all duration-300 font-bold text-sm border border-red-100 shadow-sm"
                >
                  {!isFavorite ? (
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