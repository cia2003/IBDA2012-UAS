import React, { useEffect } from "react";
import { useUserContext } from "../../hook/useContext";
import { HeartOff, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { wishlistKostDetail, removeWishlist, getUserWishlistKostDetail } = useUserContext();
  const navigate = useNavigate();

  if (!wishlistKostDetail) return;

  useEffect(() => {
    getUserWishlistKostDetail();
  }, []);


  if (wishlistKostDetail.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-zinc-100 p-6 rounded-full mb-4">
          <HeartOff size={48} className="text-zinc-400" />
        </div>
        <h2 className="text-2xl font-black text-zinc-800">Belum ada favorit</h2>
        <p className="text-zinc-500 max-w-xs mt-2">
          Mungkin kamu harus jalan-jalan sebentar dan simpan kost yang kamu suka.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all"
        >
          Cari Kost
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-6 md:p-10">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-zinc-900 tracking-tight">
          Favorit Saya
        </h1>
        <p className="text-zinc-500 font-medium">
          {wishlistKostDetail.length} Kamar pilihan yang sudah kamu simpan.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistKostDetail.map((item) => {
          const isAvailable = item.room.is_available;

          return (
            <div
              key={item.id}
              className={`group bg-white rounded-[2rem] border shadow-lg overflow-hidden transition-all duration-300
                ${isAvailable
                  ? "border-zinc-100 shadow-zinc-200/40 hover:-translate-y-1"
                  : "border-zinc-200 opacity-70 grayscale"
                }`}
            >
              {/* IMAGE */}
              <div className="relative h-48">
                <img
                  src={item.room.image}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={item.room.name || item.room.kost_name}
                />

                {/* ROOM BADGE */}
                <div className="absolute top-3 left-3 px-3 py-1 bg-indigo-600/90 backdrop-blur-md text-white rounded-xl text-xs font-black shadow-lg">
                  No. {item.room.room_number || ""}
                </div>

                {/* STATUS BADGE */}
                {!isAvailable && (
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-zinc-900/80 text-white text-[10px] font-black rounded-xl">
                    OCCUPIED
                  </div>
                )}

                {/* DELETE */}
                <button
                  onClick={() => removeWishlist(item.id)}
                  className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md"
                >
                  <HeartOff size={18} />
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <div className="mb-4">
                  <h3 className="text-lg font-black text-zinc-800 truncate">
                    {item.room.name || item.room.kost_name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-zinc-400 font-bold text-[11px] mt-1">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{item.room.location}</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-xl font-black text-indigo-600">
                    Rp {item.room.price.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[10px] font-black text-zinc-300 uppercase tracking-tighter">
                    / Bln
                  </span>
                </div>

                {/* ACTION */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={!isAvailable}
                    onClick={() =>
                      navigate(`/kost/${item.room.kost_id}/${item.room.id}`)
                    }
                    className={`py-3 font-black rounded-xl transition-all text-[10px] uppercase tracking-widest border
                      ${
                        isAvailable
                          ? "bg-zinc-50 text-zinc-600 hover:bg-zinc-200 border-zinc-100"
                          : "bg-zinc-100 text-zinc-400 cursor-not-allowed border-zinc-200"
                      }`}
                  >
                    Detail
                  </button>

                  <button
                    disabled={!isAvailable}
                    onClick={() =>
                      navigate(`/registration/${item.room.kost_id}/${item.room.id}`)
                    }
                    className={`py-3 font-black rounded-xl transition-all text-[10px] uppercase tracking-widest shadow-md
                      ${
                        isAvailable
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
                          : "bg-zinc-300 text-zinc-500 cursor-not-allowed shadow-none"
                      }`}
                  >
                    Sewa
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;