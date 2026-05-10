import { useEffect, useCallback, useState } from "react";
import KostCard from "../../../components/ui/KostCard";
import { useManagerContext } from "../../../hook/useContext";
import style from "./home.module.css";

function Home() {
  const [kost, setKost] = useState([]);
  const { getKostData } = useManagerContext();

  const fetchKost = useCallback(async () => {
    try {
      const data = await getKostData();
      setKost(data || []);
    } catch (error) {
      console.error("Gagal fetching kost:", error);
      setKost([]);
    }
  }, [getKostData]);

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