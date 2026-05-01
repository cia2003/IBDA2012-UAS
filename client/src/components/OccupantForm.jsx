import { useEffect, useState } from "react";
import { useAppContext } from "../hook/useContext";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  DoorOpen,
  Calendar,
  Save,
  ArrowLeft,
} from "lucide-react";

function OccupantForm() {
  const { occupantId } = useParams();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const { rooms, getOccupantById, occupantData } = useAppContext();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    contact: "",
    email: "",
    roomNumber: "",
    checkInDate: today,
  });

  useEffect(() => {
    if (occupantId) {
      const data = getOccupantById(occupantId);
      if (data) setFormData(data);
    }
  }, [occupantId, occupantData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (occupantId) {
      console.log("Update:", formData);
    } else {
      console.log("Create:", formData);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto pb-10 px-4 sm:px-0">
      {/* Header Section */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={20} className="sm:w-[24px] sm:h-[24px]" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
              {occupantId ? "Edit Data Penghuni" : "Tambah Penghuni Baru"}
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">
              Informasi Personal & Alokasi Kamar
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-1">
                Nama Lengkap
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors"
                  size={20}
                />
                <input
                  className="w-full outline-none py-3 sm:py-3.5 pl-12 pr-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-gray-700 text-sm sm:text-base"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* No Kontak */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-1">
                Nomor Kontak (WhatsApp)
              </label>
              <div className="relative group">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors"
                  size={20}
                />
                <input
                  className="w-full outline-none py-3 sm:py-3.5 pl-12 pr-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-gray-700 text-sm sm:text-base"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-1">
                Alamat Email
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors"
                  size={20}
                />
                <input
                  type="email"
                  className="w-full outline-none py-3 sm:py-3.5 pl-12 pr-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-gray-700 text-sm sm:text-base"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Nomor Kamar */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-1">
                Alokasi Nomor Kamar
              </label>
              <div className="relative group">
                <DoorOpen
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors"
                  size={20}
                />
                <input
                  type="number"
                  className="w-full outline-none py-3 sm:py-3.5 pl-12 pr-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-blue-600 text-sm sm:text-base"
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, roomNumber: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Tanggal Check-in */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-1">
                Tanggal Masuk
              </label>
              <div className="relative group">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors"
                  size={20}
                />
                <input
                  type="date"
                  className="w-full outline-none py-3 sm:py-3.5 pl-12 pr-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-gray-700 cursor-pointer text-sm sm:text-base"
                  value={formData.checkInDate}
                  onChange={(e) =>
                    setFormData({ ...formData, checkInDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="bg-gray-50 p-6 sm:p-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto text-gray-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:text-gray-600 transition-colors py-2"
          >
            Batalkan
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 text-white px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-100 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <Save size={18} />
            Simpan Penghuni
          </button>
        </div>
      </form>
    </div>
  );
}

export default OccupantForm;
