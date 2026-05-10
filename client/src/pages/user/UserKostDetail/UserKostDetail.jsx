import { useParams } from "react-router-dom";
import { useManagerContext } from "../../../hook/useContext";
import { useEffect, useState, useCallback } from "react";
import RoomCard from "../../../components/ui/RoomCard";
import { Mail, Phone } from "lucide-react"; // Tambahan ikon biar manis

function UserKostDetail() {
  const { kostId } = useParams();
  const { getKostById } = useManagerContext();
  const [kostData, setKostData] = useState(null);

  const fetchKostInfo = useCallback(async () => {
    try {
      const result = await getKostById(kostId);
      if (result) {
        setKostData(result);
      }
    } catch (error) {
      console.error("Gagal mengambil data kost:", error.message);
    }
  }, [getKostById, kostId]);

  useEffect(() => {
    fetchKostInfo();
  }, [fetchKostInfo]);

  useEffect(() => {
    console.log(kostData);
  });

  if (!kostData)
    return (
      <div className="p-20 text-center font-medium animate-pulse">
        Memuat rincian kost...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-900">{kostData.name}</h1> 
        <p className="text-zinc-500 mt-2 flex items-center gap-2">
                    {kostData.address}       
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             
        <div className="lg:col-span-2 space-y-6">
                   
          <h2 className="text-xl font-bold text-zinc-800 border-b pb-3">
                        Pilihan Kamar Tersedia          
          </h2>
                             
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kostData.rooms && kostData.rooms.length > 0 ? (
              kostData.rooms.map((room) => (
                <RoomCard key={room.id} data={room} kostId={kostId} />
              ))
            ) : (
              <p className="text-zinc-400 italic">
                Maaf, saat ini tidak ada kamar tersedia.
              </p>
            )}
                     
          </div>
        </div>
                {/* Kolom Kanan: Sidebar Info (1/3 width) */}       
        <div className="space-y-6">
                   
          <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm sticky top-24">
                       
            <img
              src={kostData.thumbnail || kostData.img}
              alt={kostData.name}
              className="w-full aspect-video object-cover rounded-2xl mb-4 shadow-inner"
            />
                                   
            <div className="space-y-4">
                           <h3 className="font-bold text-lg">Informasi Kost</h3>
                           
              <p className="text-sm text-zinc-600 leading-relaxed">
                                Dapatkan pengalaman menginap terbaik dengan
                fasilitas lengkap dan lokasi strategis.              
              </p>
                                         
              <div className="flex flex-col md:flex-row lg:flex-col gap-3 justify-center items-center w-full">
                  <a
                    href={`https://wa.me/${kostData.phone?.replace(/\D/g, "") || ""}`} // Membersihkan karakter non-angka
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-green-100"
                  >
                    <Phone size={18} />
                    WhatsApp
                  </a>
                <a
                  href={`mailto:${kostData.email || ""}?subject=Tanya Kost: ${kostData.name}`}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-100"
                >
                  <Mail size={18} />
                  Email
                </a>
              </div>
                         
            </div>
                     
          </div>
                 
        </div>
             
      </div>
         
    </div>
  );
}

export default UserKostDetail;
