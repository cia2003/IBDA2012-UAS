import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  Home,
  Hash,
  Calendar,
  User as UserIcon,
  ArrowLeft,
} from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useManagerContext, useUserContext } from "../../hook/useContext"; // Pastikan path hook benar

function RegistrationForm() {
  const { kostId, roomId } = useParams();
  const { getRoomDetails } = useManagerContext();
  const { handleRegistration } = useUserContext();
  const navigate = useNavigate();

  const dateNow = new Date().toISOString().split("T")[0];

  // State untuk menyimpan label yang user-friendly
  const [displayInfo, setDisplayInfo] = useState({
    kostName: "",
    roomNumber: "",
  });

  const [form, setForm] = useState({
    fullname: "",
    kostId: "",
    roomId: "",
    checkInDate: dateNow,
  });

  useEffect(() => {
    const fetchData = async () => {
      setForm((prev) => ({
        ...prev,
        kostId: kostId || "",
        roomId: roomId || "",
      }));

      if (kostId && roomId) {
        const data = await getRoomDetails(kostId, roomId);
        if (data) {
          setDisplayInfo({
            kostName: data.kostName,
            roomNumber: data.roomNumber,
          });
        }
      }
    };

    fetchData();
  }, [kostId, roomId, getRoomDetails]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const data = await handleRegistration(form);
        if (data) {
          toast.success(
            `Berhasil mendaftarkan ${form.fullname} di ${displayInfo.kostName}`,
          );
        }
      } catch (error) {
        toast.error("Gagal melakukan registrasi");
      }
    },
    [form, displayInfo],
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} /> Kembali
        </button>
      </div>

      <header className="px-2">
        <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
          Registrasi Penghuni
        </h1>
        <p className="text-zinc-500 font-medium text-sm md:text-base">
          Lengkapi detail untuk konfirmasi pesanan kamar.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-zinc-100 border border-zinc-100 overflow-hidden"
      >
        <div className="p-6 md:p-12 space-y-8 md:space-y-10">
          {/* Section 1: Info Kamar (Read Only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 bg-zinc-50 p-5 md:p-6 rounded-3xl border border-zinc-100">
            <div className="space-y-1 md:space-y-2">
              <label className="flex items-center gap-2 text-[10px] md:text-xs font-black text-zinc-400 uppercase tracking-widest">
                <Home size={14} /> Kost Tujuan
              </label>
              <p className="text-base md:text-lg font-bold text-zinc-800 break-words">
                {displayInfo.kostName || "Memuat data kost..."}
              </p>
            </div>
            <div className="space-y-1 md:space-y-2">
              <label className="flex items-center gap-2 text-[10px] md:text-xs font-black text-zinc-400 uppercase tracking-widest">
                <Hash size={14} /> Nomor Kamar
              </label>
              <p className="text-base md:text-lg font-bold text-blue-600">
                {displayInfo.roomNumber
                  ? `Kamar ${displayInfo.roomNumber}`
                  : "Memuat..."}
              </p>
            </div>
          </div>

          {/* Section 2: Input User */}
          <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col gap-2 md:gap-3">
              <label
                className="flex items-center gap-2 text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-widest"
                htmlFor="fullname"
              >
                <UserIcon size={14} /> Nama Lengkap Sesuai KTP
              </label>
              <input
                id="fullname"
                type="text"
                placeholder="Masukan nama lengkap..."
                value={form.fullname}
                onChange={handleChange}
                className="w-full outline-none py-3 md:py-4 px-5 md:px-6 rounded-xl md:rounded-2xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-zinc-700 text-sm md:text-base"
                required
              />
            </div>

            {/* Gunakan w-full di mobile, md:w-1/2 di desktop */}
            <div className="w-full md:w-1/2 flex flex-col gap-2 md:gap-3">
              <label
                className="flex items-center gap-2 text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-widest"
                htmlFor="checkInDate"
              >
                <Calendar size={14} /> Tanggal Mulai Sewa
              </label>
              <input
                id="checkInDate"
                type="date"
                value={form.checkInDate}
                onChange={handleChange}
                className="w-full outline-none py-3 md:py-4 px-5 md:px-6 rounded-xl md:rounded-2xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-zinc-700 text-sm md:text-base"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Buttons: Stack di mobile, row di desktop */}
        <div className="bg-zinc-50/50 p-6 md:p-8 border-t border-zinc-100 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full md:w-auto text-zinc-400 font-bold hover:text-zinc-600 transition-colors uppercase tracking-widest text-[10px] md:text-xs py-2"
          >
            Kembali
          </button>
          <button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 md:px-12 py-4 md:py-5 bg-blue-600 text-white font-black rounded-xl md:rounded-2xl hover:bg-blue-900 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95 uppercase tracking-widest text-[10px] md:text-xs"
          >
            <Save size={18} />
            Konfirmasi Pesanan
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;
