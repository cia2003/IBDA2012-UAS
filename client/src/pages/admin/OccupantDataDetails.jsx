import Table from "../../components/Table";
import { useAppContext } from "../../hook/useAppContext";

function OccupantDataDetails() {
    const { rooms } = useAppContext();

    const currentKost = rooms[0];
    const occupantList = currentKost?.rooms
        ? currentKost.rooms
            .filter(room => room.status === 'Occupied' && Array.isArray(room.resident))
            .flatMap(room => 
                room.resident.map(person => ({
                    ...person,
                    roomNumber: room.roomNumber
                }))
            )
        : [];

    const columns = [
        { header: "ID Penghuni", accessor: "id" },
        { header: "Nama Penghuni", accessor: "name" },
        { header: "No Kamar", accessor: "roomNumber" },
        { header: "Kontak", accessor: "contact" },
        { header: "Tanggal Masuk", accessor: "checkInDate"},
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Daftar Penghuni</h1>
                <p className="text-gray-500">{currentKost?.name || "Loading..."}</p>
            </div>
            
            <Table 
                columns={columns}
                data={occupantList}
            />
        </div>
    );
}

export default OccupantDataDetails
