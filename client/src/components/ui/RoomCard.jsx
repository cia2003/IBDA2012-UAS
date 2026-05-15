import { Heart, Maximize2, User, Lock } from "lucide-react";
import { useCallback, useState, useMemo } from "react"; // Tambahkan useMemo
import { Link, useNavigate } from "react-router-dom";
import { useAppContext, useUserContext } from "../../hook/useContext";

const RoomCard = ({ data, kostId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { userData, userIsLoggedIn } = useAppContext();
  const { wishlist, deleteWishlist, addWishlist } = useUserContext();
  const navigate = useNavigate();

  const isDisabled = data.status === "Occupied";

  const isFavorite = useMemo(() => {
    return wishlist.some((item) => item.roomInfo?.id === data.id);
  }, [wishlist, data.id]);

  const handleWishlist = useCallback(
    async (e) => {
      e.stopPropagation();
      e.preventDefault();

      if (isDisabled) return;

      if (!userIsLoggedIn) {
        return navigate("/login");
      }

      if (isFavorite) {
        const itemToDelete = wishlist.find(
          (item) => item.roomInfo?.id === data.id,
        );
        if (itemToDelete) {
          await deleteWishlist(itemToDelete.wishlistId);
        }
      } else {
        await addWishlist(kostId, data.id);
      }
    },
    [
      userData,
      isFavorite,
      wishlist,
      kostId,
      data.id,
      deleteWishlist,
      addWishlist,
      navigate,
      isDisabled,
    ],
  );

  const formattedPrice = data.price?.toLocaleString("id-ID");

  return (
    <Link
      to={isDisabled ? "#" : `/kost/${kostId}/${data.id}`}
      onClick={(e) => isDisabled && e.preventDefault()}
      className={`group bg-white rounded-3xl border overflow-hidden shadow-sm transition-all duration-500 ${
        isDisabled
          ? "opacity-60 grayscale cursor-not-allowed border-zinc-200"
          : "hover:shadow-2xl hover:border-blue-100 border-zinc-100"
      }`}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={
            data.images?.[0] ||
            "https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=600"
          }
          alt={`Kamar ${data.type}`}
          className={`w-full h-full object-cover transition-transform duration-700 ${!isDisabled && "group-hover:scale-105"}`}
        />

        {isDisabled && (
          <div className="absolute inset-0 bg-zinc-900/20 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-white/90 px-4 py-2 rounded-full flex items-center gap-2 shadow-xl">
              <Lock size={14} className="text-zinc-600" />
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Tidak Tersedia
              </span>
            </div>
          </div>
        )}

        {!isDisabled && (
          <button
            onClick={handleWishlist}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/70 backdrop-blur-sm border border-white hover:bg-white hover:scale-110 shadow-lg transition-all duration-300"
          >
            <Heart
              size={20}
              strokeWidth={1.5}
              className={`transition-colors duration-300 ${
                isFavorite || isHovered
                  ? "fill-red-500 text-red-500"
                  : "text-zinc-500"
              }`}
            />
          </button>
        )}

        {!isDisabled &&
          data.available_stocks > 0 &&
          data.available_stocks <= 3 && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2.5 py-1 bg-amber-500/80 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase rounded-full tracking-widest">
                Sisa {data.available_stocks} Unit
              </span>
            </div>
          )}
      </div>

      <div className="p-5">
        <h4
          className={`text-xl font-extrabold transition-colors truncate ${isDisabled ? "text-zinc-400" : "text-zinc-950 group-hover:text-blue-600"}`}
        >
          {data.type}
        </h4>
        <div className="flex items-center gap-3 mt-1.5 text-sm text-zinc-500">
          <div className="flex items-center gap-1">
            <Maximize2
              size={14}
              className={isDisabled ? "text-zinc-300" : "text-blue-400"}
            />
            {data.size || "3x4"} m²
          </div>
          <div className="flex items-center gap-1">
            <User
              size={14}
              className={isDisabled ? "text-zinc-300" : "text-blue-400"}
            />
            {data.capacity || 1} Orang
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-zinc-100 flex items-end justify-between">
          <div>
            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest leading-none">
              Harga per bulan
            </p>
            <p
              className={`text-xl font-black mt-1 ${isDisabled ? "text-zinc-400" : "text-blue-600"}`}
            >
              <span className="text-sm font-medium">Rp</span> {formattedPrice}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;
