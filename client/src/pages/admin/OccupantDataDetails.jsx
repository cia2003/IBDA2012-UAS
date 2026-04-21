import { useState } from "react";
import Table from "../../components/Table";
import { useAppContext } from "../../hook/useAppContext";
import { Users, Search, UserCog, UserMinus, Filter } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function OccupantDataDetails() {
    const { staffId } = useParams()
    const { rooms } = useAppContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("All");
    const navigate = useNavigate()

    const currentKost = rooms[0];
    
    const allOccupants = currentKost?.rooms
        ? currentKost.rooms
            .filter(room => room.status === 'Occupied' && Array.isArray(room.resident))
            .flatMap(room => 
                room.resident.map(person => ({
                    ...person,
                    roomNumber: room.roomNumber
                }))
            )
        : [];

    const filteredOccupants = allOccupants.filter(person => {
        const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRoom = selectedRoom === "All" || person.roomNumber === selectedRoom;
        return matchesSearch && matchesRoom;
    });

    const roomOptions = [...new Set(allOccupants.map(p => p.roomNumber))].sort();

    const handleEdit = (item) => {
        navigate(`/dashboard/staff/${staffId}/edit-penghuni/${item.id}`)
    };

    const handleDelete = (id) => {
        if (window.confirm("Keluarkan penghuni ini dari sistem?")) {
            alert(`ID Penghuni ${id} telah dihapus.`);
        }
    };

    const columns = [
        { 
            header: "ID", 
            accessor: "id",
            cell: (val) => <span className="text-gray-400 font-mono text-xs">{val}</span>
        },
        { 
            header: "Nama Penghuni", 
            accessor: "name",
            cell: (val) => <span className="font-bold text-gray-700">{val}</span>
        },
        { 
            header: "No Kamar", 
            accessor: "roomNumber",
            cell: (val) => (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100 font-medium">
                    {val}
                </span>
            )
        },
        { header: "Kontak", accessor: "contact" },
        { 
            header: "Check-in", 
            accessor: "checkInDate",
            cell: (val) => new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        },
        {
            header: "Email",
            accessor: "email"
        },
        { 
            header: "Action", 
            accessor: "action",
            cell: (_, item)=> (
                <div className="flex gap-1">
                    <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Profil"
                    >
                        <UserCog size={18} />
                    </button>
                    <button 
                        onClick={() => handleDelete(id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus/Keluar"
                    >
                        <UserMinus size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="text-blue-600" size={24} />
                            <h1 className="text-xl font-bold text-gray-800">Daftar Penghuni</h1>
                        </div>
                        <p className="text-sm text-gray-500">Total: {filteredOccupants.length} orang aktif</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text"
                                placeholder="Cari nama..."
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm">
                            <Filter size={16} className="text-gray-400" />
                            <select 
                                className="bg-transparent focus:outline-none text-gray-600 font-medium"
                                value={selectedRoom}
                                onChange={(e) => setSelectedRoom(e.target.value)}
                            >
                                <option value="All">Semua Kamar</option>
                                {roomOptions.map(roomNum => (
                                    <option key={roomNum} value={roomNum}>Kamar {roomNum}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-0">
                <Table 
                    columns={columns}
                    data={filteredOccupants}
                />
            </div>

            {filteredOccupants.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-gray-400 italic text-sm">Tidak ada penghuni yang sesuai dengan filter.</p>
                </div>
            )}
        </div>
    );
}

export default OccupantDataDetails;