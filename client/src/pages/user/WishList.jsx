import React, { useCallback, useEffect, useMemo } from "react";
import { useUserContext } from "../../hook/useContext";
import { HeartOff, MapPin, ArrowRight, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, deleteWishlist } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Isi wishlist:", wishlist);
  }, [wishlist]);

  const handleDelete = useCallback(async()=>{
    try {
        const data = await deleteWishlist(wishlistId)
    } catch (error) {
        console.error(error.message)
    }
  })

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-zinc-100 p-6 rounded-full mb-4">
          <HeartOff size={48} className="text-zinc-400" />
        </div>
        <h2 className="text-2xl font-black text-zinc-800">Belum ada favorit</h2>
        <p className="text-zinc-500 max-w-xs mt-2">
          Mungkin kamu harus jalan-jalan sebentar dan simpan kost yang kamu
          suka.
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
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-zinc-900 tracking-tight">
          Favorit Saya
        </h1>
        <p className="text-zinc-500 font-medium">
          Kamar pilihan yang sudah kamu simpan.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlist.map((item) => (
          <div
            key={item.wishlistId}
            className="group bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/40 overflow-hidden hover:-translate-y-2 transition-all duration-300"
          >
            {/* Image & Delete Button */}
            <div className="relative h-64">
              <img
                src={item.image}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt={item.name}
              />
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
              >
                <HeartOff size={20} />
              </button>
            </div>

            {/* Information */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-zinc-800 truncate leading-tight">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 text-zinc-400 font-bold text-sm mt-1">
                  <MapPin size={14} />
                  Kamar {item.roomInfo.roomNumber} • {item.location}
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-3xl font-black text-indigo-600">
                  Rp {item.roomInfo.price}
                </span>
                <span className="text-xs font-black text-zinc-300 uppercase tracking-widest">
                  / Bulan
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/kost/${item.id}`)}
                  className="flex-1 py-4 bg-zinc-50 text-zinc-600 font-black rounded-2xl hover:bg-zinc-200 transition-all text-xs uppercase tracking-widest border border-zinc-100"
                >
                  Detail
                </button>
                <button
                  onClick={() =>
                    navigate(`/registrasi/${item.id}/${item.roomInfo.id}`)
                  }
                  className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-xs uppercase tracking-widest"
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
