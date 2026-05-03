import { useEffect, useState, useCallback } from "react";
import KPICard from "../../../components/ui/KPICard";

import { House, Bed, HouseHeart, HousePlus, Zap, UserPlus2 } from "lucide-react";
import { useManagerContext } from "../../../hook/useContext";
import { useNavigate } from "react-router-dom";

function ManagerDashboard() {
  const { getKostData } = useManagerContext();
  const [kostData, setKostData] = useState([]);
  const navigate = useNavigate();

  const fetchKostData = useCallback(async () => {
    const data = await getKostData();
    if (data) {
      setKostData(data);
    }
  }, [getKostData]);

  useEffect(() => {
    fetchKostData();
  }, [fetchKostData]);

  const totalKost = kostData.length;
  
  const totalRooms = kostData.reduce((acc, current) => {
    return acc + (current.rooms?.length || 0);
  }, 0);

  const occupiedRooms = kostData.reduce((acc, current) => {
    const occupiedInThisKost = current.rooms?.filter(room => room.status === 'Occupied').length || 0;
    return acc + occupiedInThisKost;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          IBDA Kost Management
        </h1>
      </div>

      {/* KPI Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 md:col-span-2">
          <KPICard
            title="Total Kost"
            value={totalKost}
            icon={<House className="text-blue-500" />}
          />
        </div>
        <div className="lg:col-span-1">
          <KPICard
            title="Total Kamar"
            value={totalRooms}
            icon={<Bed className="text-purple-500" />}
          />
        </div>
        <div className="lg:col-span-1">
          <KPICard
            title="Kamar Terisi"
            value={occupiedRooms}
            icon={<HouseHeart className="text-green-500" />}
          />
        </div>
      </div>

    {/* CTA Links */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm w-fit">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500 rounded-lg text-white">
            <Zap size={20} fill="currentColor" />
          </div>
          <h3 className="font-bold text-lg text-gray-800">Quick Actions</h3>
        </div>

        <div className="flex flex-col gap-3 ">
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md group text-sm"
          >
            <HousePlus
              size={18}
              className="group-hover:scale-110 transition-transform"
            />
            Tambah Kost Baru
          </button>
          <button
            className="flex items-center gap-2 bg-gray-400 hover:bg-gray-700 hover:text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md group text-sm"
            onClick={()=>navigate('/dashboard/manager/staff-form')}
          >
            <UserPlus2
              size={18}
              className="group-hover:scale-110 transition-transform"
            />
            Tambah Staff Baru
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
