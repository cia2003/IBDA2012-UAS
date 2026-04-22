import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../hook/useAppContext";
import KPICard from "../../components/KPICard";
import { House, Zap, UserRoundPlus, HousePlus, Users } from "lucide-react";

export default function StaffDashboard() {
    const { staffId } = useParams();
    const { staffData, rooms } = useAppContext();
    const navigate = useNavigate()

    const currentRooms = rooms[0];
    const totalRooms = currentRooms?.rooms?.length || 0;

    const totalOccupants = currentRooms?.rooms?.reduce((total, room) => 
        total + (room.status === 'Occupied' && room.resident ? room.resident.length : 0)
    , 0) || 0;

    const roomsLeft = currentRooms?.rooms?.reduce((total, room) => {
        return room.status !== 'Occupied' ? total + 1 : total;
    }, 0) || 0;

    const handleAddOccupant =()=>{
        const occupantId = "P-" + Math.floor(10000 + Math.random() * 90000);
        navigate(`/dashboard/staff/${staffId}/tambah-penghuni/${occupantId}`)
        
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800">Kost Management Dashboard</h1>
                <p className="text-gray-500 font-medium">Monitoring Unit: <span className="text-blue-600">{currentRooms?.name || staffId}</span></p>
            </div>

            {/* KPI Cards Section - 2:1:1 Scale */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2 md:col-span-2">
                    <KPICard title="Total Kamar" value={totalRooms} icon={<House className="text-blue-500" />} />
                </div>
                <div className="lg:col-span-1">
                    <KPICard title="Total Penghuni" value={totalOccupants} icon={<Users className="text-purple-500" />} />
                </div>
                <div className="lg:col-span-1">
                    <KPICard title="Kamar Tersedia" value={roomsLeft} icon={<HousePlus className="text-green-500" />} />
                </div>
            </div>

            {/* Quick Actions Section */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm w-fit">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500 rounded-lg text-white">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">Quick Actions</h3>
                </div>
                
                <div className="flex flex-col gap-3 "> 
                    <button
                        onClick={handleAddOccupant}
                        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-blue-600 font-semibold py-2 px-4 rounded-lg border border-blue-200 transition-all shadow-sm group text-sm">
                        <UserRoundPlus size={18} className="group-hover:scale-110 transition-transform" />
                        New Registration
                    </button>
                    
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md group text-sm">
                        <HousePlus size={18} className="group-hover:scale-110 transition-transform" />
                        Add New Room
                    </button>
                </div>
            </div>
        </div>
    );
}