import Table from "../../components/Table";
import { useAppContext } from "../../hook/useAppContext";

function RoomsDataDetails() {
    const { rooms } = useAppContext();

    // rooms[0] adalah lokasi kost yang di-manage staff tersebut
    const currentKost = rooms[0];
    const roomsList = currentKost?.rooms || [];

    const columns = [
        { header: "No. Kamar", accessor: "roomNumber" },
        { header: "Tipe", accessor: "name" }, // di ROOM_TYPES namanya 'name' (Tipe 1, 2, dst)
        { header: "Harga / Bulan", accessor: "price" },
        { 
            header: "Status", 
            accessor: "status",
            // Custom cell untuk warna status
            cell: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {value}
                </span>
            )
        },
        { 
            header: "Total Penghuni", 
            accessor: "resident",
            cell: (value) => {return Array.isArray(value) ? value.length : 0 ? value.name : "—"}
        }
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Daftar Kamar</h1>
                <p className="text-gray-500">{currentKost?.name || "Loading..."}</p>
            </div>
            
            <Table 
                columns={columns}
                data={roomsList}
            />
        </div>
    );
}

export default RoomsDataDetails;