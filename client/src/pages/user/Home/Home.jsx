import { useEffect, useCallback, useState } from "react";
import KostCard from "../../../components/ui/KostCard";
import { useManagerContext, useUserContext } from "../../../hook/useContext";
import style from "./home.module.css";

function Home() {
  const [kost, setKost] = useState([]);
  const { getUnauthenticatedKostData, getUnauthenticatedRooms, getUnauthenticatedRoomTypes } = useUserContext();
  const { getKostData } = useManagerContext();

  const fetchKost = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const data = await getUnauthenticatedKostData();

      const roomResponse = await getUnauthenticatedRooms();
      const filteredRooms = roomResponse.filter(room => room.is_available === true);

      const roomTypes = await getUnauthenticatedRoomTypes();

      const kostWithRooms = data.map(kostItem => {
        const roomsForKost = filteredRooms.filter(room => room.kost === kostItem.id);
        const roomsWithType = roomsForKost.map(room => {
          const roomType = roomTypes.find(type => type.id === room.room_type);
          return { ...room, room_type: roomType };
        });

        return { ...kostItem, rooms: roomsWithType };
      });

      setKost(kostWithRooms || []);
    } catch (error) {
      console.error("Gagal fetching kost:", error);
      setKost([]);
    }
  }, [getUnauthenticatedKostData, getUnauthenticatedRooms, getUnauthenticatedRoomTypes]);

  useEffect(() => {
    fetchKost();
  }, [fetchKost]);

  // useEffect(()=>{
  //   console.log(kost)
  // },[kost])

  return (
    <main className={style.homeContainer}>
      <header className={style.header}>
        <div className={style.headerContent}>
          <h2 className={style.title}>Kost Terpopuler</h2>
          <p className={style.subtitle}>Pilih hunian nyaman sesuai kebutuhanmu</p>
        </div>
      </header>

      <section className={style.contentSection}>
        <div className={style.cardGrid}>
          {kost.length > 0 ? (
            kost.map((item) => <KostCard key={item.id} data={item} />)
          ) : (
            <div className={style.emptyState}>
              <p>Tidak ada data kost tersedia saat ini.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Home;