import { useState } from "react";
import Table from "../../components/Table";
import { useAppContext } from "../../hook/useAppContext";
import { Filter, Search, Edit3, Trash2 } from "lucide-react"; // Ikon tambahan

function RoomsDataDetails() {
    const { rooms } = useAppContext();
    const [filterStatus, setFilterStatus] = useState("All");

    const currentKost = rooms[0];
    const roomsList = currentKost?.rooms || [];

    // Logika Filter
    const filteredData = roomsList.filter(room => {
        if (filterStatus === "All") return true;
        return room.status === filterStatus;
    });

    const handleEdit = (item) => console.log("Edit:", item);
    const handleDelete = (id) => console.log("Delete ID:", id);

    const columns = [
        { header: "No. Kamar", accessor: "roomNumber" },
        { 
            header: "Tipe", 
            accessor: "name",
            cell: (value) => <span className="font-semibold text-gray-700">{value}</span>
        },
        { 
            header: "Harga / Bulan", 
            accessor: "price",
            cell: (value) => `Rp ${value.toLocaleString('id-ID')}`
        },
        { 
            header: "Status", 
            accessor: "status",
            cell: (value) => (
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    value === 'Available' 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                    : 'bg-rose-100 text-rose-700 border border-rose-200'
                }`}>
                    {value}
                </span>
            )
        },
        { 
            header: "Total Penghuni", 
            accessor: "resident",
            cell: (value) => (
                <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-md text-xs ${Array.isArray(value) && value.length > 0 ? 'bg-blue-100 text-blue-600 font-bold' : 'bg-gray-100 text-gray-400'}`}>
                        {Array.isArray(value) ? value.length : 0}
                    </span>
                    <span className="text-gray-500 text-xs">Orang</span>
                </div>
            )
        },
        { 
            header: "Action", 
            accessor: "id", 
            cell: (id, item) => (
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Kamar"
                    >
                        <Edit3 size={18} />
                    </button>
                    <button 
                        onClick={() => handleDelete(id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Kamar"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-white-50/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Manajemen Kamar</h1>
                        <p className="text-sm text-gray-500">{currentKost?.name || "Memuat data..."}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
                        <button 
                            onClick={() => setFilterStatus("All")}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filterStatus === 'All' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            Semua
                        </button>
                        <button 
                            onClick={() => setFilterStatus("Available")}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filterStatus === 'Available' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            Tersedia
                        </button>
                        <button 
                            onClick={() => setFilterStatus("Occupied")}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filterStatus === 'Occupied' ? 'bg-rose-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            Terisi
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="p-0">
                <Table 
                    columns={columns}
                    data={filteredData}
                />
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-medium">
                    Menampilkan {filteredData.length} dari {roomsList.length} total kamar di lokasi ini.
                </p>
            </div>
        </div>
    );
}

export default RoomsDataDetails;