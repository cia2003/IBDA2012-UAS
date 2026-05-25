import { useEffect, useCallback, useState } from "react";
import KostCard from "../../../components/ui/KostCard";
import { useUserContext } from "../../../hook/useContext";
import style from "./home.module.css";

import {
  Search,
  MapPin,
  CircleDollarSign,
  SlidersHorizontal,
} from "lucide-react";
import { kostData } from "../../../assets/assets";

function Home() {
  const [loading, setLoading] = useState(true);
  const [kost, setKost] = useState([]);
  const [originalKost, setOriginalKost] = useState([]);

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState(1400000);

  const {
    getUnauthenticatedKostData,
    getUnauthenticatedRooms,
    getUnauthenticatedRoomTypes,
  } = useUserContext();

  const fetchKost = useCallback(async () => {
    try {
      setLoading(true);
      // Ambil semua data
      const kostData = await getUnauthenticatedKostData();

      const roomResponse = await getUnauthenticatedRooms();

      const roomTypes = await getUnauthenticatedRoomTypes();

      // Filter hanya room available
      const filteredRooms = roomResponse.filter(
        (room) => room.is_available === true,
      );

      // Gabungkan room + room type + kost
      const kostWithRooms = kostData.map((kostItem) => {
        // Semua room milik kost ini
        const roomsForKost = filteredRooms.filter(
          (room) => room.kost === kostItem.id,
        );

        // Inject room_type object
        const roomsWithType = roomsForKost.map((room) => {
          const roomType = roomTypes.find(
            (type) => type.id === room.room_type,
          );

          return {
            ...room,
            room_type: roomType,
            price: Number(roomType?.price || 0),
          };
        });

        return {
          ...kostItem,
          rooms: roomsWithType,
        };
      });

      setKost(kostWithRooms || []);
      setOriginalKost(kostWithRooms || []);
    } catch (error) {
      console.error("Gagal fetching kost:", error);

      setKost([]);
      setOriginalKost([]);
    } finally {
      setLoading(false);
    }
  }, [
    getUnauthenticatedKostData,
    getUnauthenticatedRooms,
    getUnauthenticatedRoomTypes,
  ]);

  useEffect(() => {
    fetchKost();
  }, [fetchKost]);

  const handleSearch = () => {
    const filtered = originalKost.filter((item) => {
      const matchName = item.name
        ?.toLowerCase()
        .includes(query.toLowerCase());

      const matchLocation = item.address
        ?.toLowerCase()
        .includes(location.toLowerCase());

      const matchPrice = item.rooms?.some(
        (room) => Number(room.price) <= maxPrice,
      );

      return matchName && matchLocation && matchPrice;
    });

    setKost(filtered);
  };

  // =========================
  // SCROLL TO SEARCH
  // =========================
  const scrollToSearch = () => {
    const searchSection = document.getElementById("search-section");

    if (searchSection) {
      searchSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section id="banner" className={style.banner}>
        <div className={style.heroContent}>
          <p className={style.heroBadge}>✨ Platform Kost Modern</p>

          <h2>Temukan Kost Nyaman dengan Mudah</h2>

          <p>
            Cari kost terbaik dengan tampilan modern, informasi lengkap, dan
            pengalaman pencarian yang lebih cepat.
          </p>

          <div className={style.heroButtons}>
            <button
              className={style.primaryBtn}
              onClick={scrollToSearch}
            >
              Cari Sekarang
            </button>

            <a
              href="#why-us"
              className={style.secondaryBtn}
            >
              Pelajari Lebih Lanjut
            </a>
          </div>

          <div className={style.heroStats}>
            <div className={style.statItem}>
              <h3>100+</h3>
              <span>Kost Tersedia</span>
            </div>

            <div className={style.statItem}>
              <h3>24 Jam</h3>
              <span>Respon Cepat</span>
            </div>

            <div className={style.statItem}>
              <h3>4.9★</h3>
              <span>Rating Pengguna</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <div
        id="search-section"
        className="w-full max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-200/60 p-3 border border-zinc-100 mt-[-40px] relative z-20"
      >
        <div className="flex flex-col md:flex-row items-center gap-2">
          {/* SEARCH NAMA */}
          <div className="flex-1 flex items-center gap-3 px-6 py-3 border-r-0 md:border-r border-zinc-100">
            <Search className="text-indigo-500" size={20} />

            <div className="w-full">
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                Nama Kost
              </p>

              <input
                type="text"
                placeholder="Cari nama kost..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-sm font-bold text-zinc-800 placeholder:text-zinc-300"
              />
            </div>
          </div>

          {/* SEARCH LOKASI */}
          <div className="flex-1 flex items-center gap-3 px-6 py-3 border-r-0 md:border-r border-zinc-100">
            <MapPin className="text-rose-500" size={20} />

            <div className="w-full">
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                Lokasi
              </p>

              <input
                type="text"
                placeholder="Cari alamat..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent outline-none text-sm font-bold text-zinc-800 placeholder:text-zinc-300"
              />
            </div>
          </div>

          {/* FILTER HARGA */}
          <div className="flex-1 flex items-center gap-3 px-6 py-3">
            <CircleDollarSign
              className="text-emerald-500"
              size={20}
            />

            <div className="w-full">
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                Harga Maksimal
              </p>

              <select
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(Number(e.target.value))
                }
                className="w-full bg-transparent outline-none text-sm font-bold text-zinc-800 appearance-none cursor-pointer"
              >
                <option value={1400000}>
                  Di bawah 1.4 Juta
                </option>

                <option value={2000000}>
                  Di bawah 2 Juta
                </option>

                <option value={3000000}>
                  Di bawah 3 Juta
                </option>

                <option value={99999999}>
                  Semua Harga
                </option>
              </select>
            </div>
          </div>

          {/* BUTTON SEARCH */}
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-3xl transition-all active:scale-95 shadow-lg shadow-indigo-100"
          >
            <SlidersHorizontal size={24} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <main className={style.homeContainer}>
        <header className={style.header}>
          <div className={style.headerContent}>
            <h2 className={style.title}>
              Kost Terpopuler
            </h2>

            <p className={style.subtitle}>
              Pilih hunian nyaman sesuai kebutuhanmu
            </p>
          </div>
        </header>

        <section className={style.contentSection}>
          <div className={style.cardGrid}>
            {loading ? (
              <div className={style.emptyState}>
                <p>Memuat data kost...</p>
              </div>
            ) : kost.length > 0 ? (
              kost.map((item) => (
                <KostCard
                  key={item.id}
                  data={item}
                />
              ))
            ) : (
              <div className={style.emptyState}>
                <p>
                  Tidak ada data kost tersedia saat ini.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;