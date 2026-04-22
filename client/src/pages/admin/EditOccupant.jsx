import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../hook/useAppContext";
import { useState, useEffect } from "react";

export default function EditOccupant() {
    const { occupantId } = useParams();
    const { rooms } = useAppContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        const findOccupant = () => {
            const currentKost = rooms[0];
            const allOccupants = currentKost?.rooms
                ?.filter(room => Array.isArray(room.resident))
                .flatMap(room => room.resident.map(p => ({ ...p, roomNumber: room.roomNumber })));
            
            const target = allOccupants?.find(p => p.id === occupantId);
            if (target) setFormData(target);
        };

        findOccupant();
    }, [occupantId, rooms]);

    if (!formData) return <p>Loading data penghuni...</p>;

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h1 className="text-xl font-bold mb-4">Form Data Penghuni</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Nama</label>
                    <input 
                        className="w-full border p-2 rounded"
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                
                </div>
                <div>
                    <label className="block text-sm font-medium">Kontak</label>
                    <input 
                        className="w-full border p-2 rounded"
                        value={formData.contact} 
                        onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input type="email" 
                    className="w-full border p-2 rounded"
                    value={formData.email}
                    onChange={(e)=>setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">No Kamar</label>
                    <input type="text" 
                    className="w-full border p-2 rounded"
                    value={formData.roomNumber}
                    onChange={(e)=>setFormData({...formData, roomNumber: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Tanggal Masuk</label>
                    <input type="date" 
                    className="w-full border p-2 rounded"
                    value={formData.checkInDate}
                    onChange={(e)=>setFormData({...formData, checkInDate: e.target.value})}
                    />
                </div>
                <div className="flex flex-col-1 gap-2">
                    <button type="button" onClick={() => navigate(-1)} className="text-gray-500 px-4 py-2 rounded hover:bg-gray-400 hover:text-white transition-colors">Batal</button>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors">Simpan</button>
                </div>
            </form>
        </div>
    );
}