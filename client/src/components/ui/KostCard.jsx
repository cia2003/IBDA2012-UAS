import { useNavigate } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";

const KostCard = ({ data }) => {
  const navigate = useNavigate();

  const availableRoomsCount = data.rooms?.filter(
    (room) => room.is_available === true
  ).length || 0;

  const lowestPrice = data.rooms?.length > 0 
    ? Math.min(
      ...data.rooms
        .map(room => Number(room.room_type?.price))
        .filter(p => Number.isFinite(p))
    ) 
    : 0;

  return (
    <div 
      onClick={() => navigate(`/kost/${data.id}`)}
      className="group bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Area Gambar */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={data.image} 
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badge Status Kamar */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
            availableRoomsCount > 0 
            ? "bg-emerald-500 text-white" 
            : "bg-rose-500 text-white"
          }`}>
            {availableRoomsCount > 0 ? `${availableRoomsCount} Kamar Kosong` : "Penuh"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors truncate">
          {data.name}
        </h3>
        
        <div className="mt-2 flex items-start gap-1.5 text-zinc-500">
          <MapPin size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
          <p className="text-sm line-clamp-2 leading-relaxed">
            {data.address}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Mulai dari</p>
            <p className="text-blue-600 font-extrabold">
              Rp {lowestPrice.toLocaleString('id-ID')}
              <span className="text-xs text-zinc-400 font-medium"> /bln</span>
            </p>
          </div>
          
          <div className="bg-zinc-50 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
            <ChevronRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KostCard