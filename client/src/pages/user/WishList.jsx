import React, { useEffect, useState } from "react";
import { useUserContext } from "../../hook/useContext";
import { HeartOff, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const {
    wishlistKostDetail,
    removeWishlist,
    getUserWishlistKostDetail,
  } = useUserContext();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        await getUserWishlistKostDetail();
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="animate-spin text-indigo-600 mb-4" />

        <h2 className="text-xl font-black text-zinc-800">
          Memuat wishlist...
        </h2>

        <p className="text-zinc-500 mt-2">
          Tunggu sebentar ya.
        </p>
      </div>
    );
  }

  if (!wishlistKostDetail) return null;

  const availableWishlist = wishlistKostDetail.filter(
    (item) => item.room.is_available
  );

  if (availableWishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-zinc-100 p-6 rounded-full mb-4">
          <HeartOff size={48} className="text-zinc-400" />
        </div>

        <h2 className="text-2xl font-black text-zinc-800">
          Belum ada favorit
        </h2>

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
          {availableWishlist.length} kamar pilihan yang sudah kamu simpan.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {availableWishlist.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-[2rem] border border-zinc-100 shadow-lg shadow-zinc-200/40 overflow-hidden transition-all duration-300 hover:-translate-y-1"
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
                  onClick={() =>
                    navigate(`/kost/${item.room.kost_id}/${item.room.id}`)
                  }
                  className="py-3 font-black rounded-xl transition-all text-[10px] uppercase tracking-widest border bg-zinc-50 text-zinc-600 hover:bg-zinc-200 border-zinc-100"
                >
                  Detail
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/registration/${item.room.kost_id}/${item.room.id}`
                    )
                  }
                  className="py-3 font-black rounded-xl transition-all text-[10px] uppercase tracking-widest shadow-md bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
                >
                  Sewa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;