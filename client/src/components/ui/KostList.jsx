import { MapPin, Users, DoorOpen, House } from "lucide-react";

function KostList({ data }) {
  const totalResidents =
    data.rooms?.reduce((acc, room) => acc + (room.resident?.length || 0), 0) ||
    0;

  const roomsLeft =
    data?.rooms?.reduce((total, room) => {
      return room.status !== "Occupied" ? total + 1 : total;
    }, 0) || 0;

  return (
    <div className="w-full">
      <div className="bg-white p-5 rounded-[2rem] border border-gray-100 flex items-center gap-6 group hover:shadow-xl hover:shadow-blue-900/5 transition-all">
        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
          <img
            src={data.image || data.img}
            alt="kost-img"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="flex-1">
          <h5 className="text-lg font-black text-gray-900 tracking-tight">
            {data.name}
          </h5>

          <div className="flex items-center gap-1.5 mt-1">
            <MapPin size={14} className="text-rose-500" />
            <p className="text-sm text-gray-500 font-medium">
              {data.location || data.address}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-100">
              <House size={12} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">
                {data.rooms?.length || 0} Kamar
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100">
              <Users size={12} className="text-emerald-600" />
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                {totalResidents} Penghuni
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-xl border border-red-100">
              <DoorOpen size={12} className="text-red-600" />
              <span className="text-[10px] font-black uppercase tracking-wider text-red-700">
                {roomsLeft} Kamar Kosong
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KostList;
