import { useActionData, useParams } from "react-router-dom";
import { useAppContext } from "../../hook/useAppContext";
import KPICard from "../../components/KPICard";

export default function StaffDashboard() {
    const { staffId } = useParams(); // Pastikan ID ini sama dengan yang di App.jsx :staffId
    const { staffData, rooms } = useAppContext();

    // Menghitung total kamar
    const currentRooms = rooms[0]
    const totalRooms = currentRooms?.rooms?.length || 0;

    // Menghitung total penghuni
    const totalOccupants = currentRooms?.rooms?.reduce((total, room) => {
        return room.status === 'Occupied' && room.resident ? total + 1 : total;
    }, 0) || 0;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h1 className="text-2xl font-bold text-gray-800">Kost Management Dashboard</h1>
            <p className="text-gray-500">Monitoring ID Unit: {staffId}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                <KPICard title={"Total Kamar"} value={totalRooms}/>
                <KPICard title={"Total Penghuni"} value={totalOccupants}/>
                {/* <KPICard />
                <KPICard /> */}
            </div>
        </div>
    );
}