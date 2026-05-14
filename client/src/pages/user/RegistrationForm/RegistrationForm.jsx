import { useNavigate, useParams } from "react-router-dom";
import { Save, Home, Hash, Calendar, User as UserIcon, ArrowLeft } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useManagerContext, useUserContext, useStaffContext, useAppContext } from "../../../hook/useContext";
import { useMemo } from "react";

function RegistrationForm() {
  const { kostId, roomId } = useParams();
  const { getRoomDetails } = useStaffContext();
  const { handleRegistration } = useUserContext();
  const { userData } = useAppContext();
  const navigate = useNavigate()

  const dateNow = new Date().toISOString().split("T")[0];

  // State untuk menyimpan label yang user-friendly
  const [displayInfo, setDisplayInfo] = useState({
    kostName: "",
    roomNumber: "",
  });

  const [form, setForm] = useState({
    firstName: "", 
    lastName: "", 
    gender: "", 
    phoneNumber: "", 
    occupation: "", 
    institution: "", 
    identityType: "", 
    identityCard: "",
    roomId: "",
    checkInDate: dateNow,
  });

  const fullNamePreview = `${form.firstName} ${form.lastName}`.trim();

  const endDate = useMemo(() => {
    if (!form.checkInDate) return "";
    const d = new Date(form.checkInDate);

    d.setDate(d.getDate() + 30);

    return d.toISOString().split("T")[0];
  }, [form.checkInDate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData) return;

      setForm((prev) => ({
        ...prev,
        firstName: userData.first_name || "", 
        lastName: userData.last_name || "", 
        roomId: roomId || "",
      }));
    };

    fetchData();
  }, [userData]);

  useEffect(() => {
    const fetchData = async () => {

      if (roomId) {
        const data = await getRoomDetails(roomId);
        if (data) {
          setDisplayInfo({
            kostName: data.kostName,
            roomNumber: data.roomNumber,
          });
        }
      }
    };
    fetchData();
  }, [roomId, getRoomDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const isSuccess = await handleRegistration({
          ...form, 
          endDate: endDate
        });

        if (isSuccess) {
          toast.success(
            `Berhasil mendaftarkan ${form.firstName} ${form.lastName} di ${displayInfo.kostName}`,
          );
        }
      } catch (error) {
        toast.error("Gagal melakukan registrasi");
        console.log(error.message);
      }
    },
    [form, displayInfo, handleRegistration],
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* BACK BUTTON */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} /> Kembali
        </button>
      </div>

      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
          Registrasi Penghuni
        </h1>
        <p className="text-zinc-500 font-medium">
          Lengkapi detail untuk konfirmasi pesanan kamar.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[2.5rem] shadow-xl shadow-zinc-100 border border-zinc-100 overflow-hidden"
      >
        <div className="p-8 md:p-12 space-y-10">

          {/* SECTION 1: INFO KAMAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest">
                <Home size={14} /> Kost Tujuan
              </label>
              <p className="text-lg font-bold text-zinc-800">
                {displayInfo.kostName || "Memuat data kost..."}
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest">
                <Hash size={14} /> Nomor Kamar
              </label>
              <p className="text-lg font-bold text-blue-600">
                {displayInfo.roomNumber
                  ? `Kamar ${displayInfo.roomNumber}`
                  : "Memuat..."}
              </p>
            </div>
          </div>

          {/* SECTION 2: IDENTITAS */}
          <div className="space-y-8">

            {/* FULL NAME PREVIEW */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-widest">
                Nama Lengkap (Preview dari input)
              </label>

              <div className="w-full py-4 px-6 rounded-2xl border border-zinc-200 bg-zinc-50 font-semibold text-zinc-800">
                {fullNamePreview || "Nama akan muncul otomatis..."}
              </div>
            </div>

            {/* FIRST + LAST NAME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="firstName"
                type="text"
                placeholder="Nama Depan"
                value={form.firstName}
                onChange={handleChange}
                className="w-full outline-none py-4 px-6 rounded-2xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-zinc-700"
                required
              />

              <input
                name="lastName"
                type="text"
                placeholder="Nama Belakang"
                value={form.lastName}
                onChange={handleChange}
                className="w-full outline-none py-4 px-6 rounded-2xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-zinc-700"
                required
              />
            </div>

            {/* GENDER */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-widest">
                Jenis Kelamin
              </label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full py-4 px-6 rounded-2xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 font-semibold text-zinc-700"
                required
              >
                <option value="">Pilih Gender</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </div>


            {/* PHONE */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-widest">
                Nomor Telepon
              </label>

              <input
                name="phoneNumber"
                type="text"
                placeholder="Nomor Telepon"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full py-4 px-6 rounded-2xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 font-semibold text-zinc-700"
                required
              />
            </div>

            {/* OCCUPATION */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-widest">
                Pekerjaan
              </label>

              <input
                name="occupation"
                type="text"
                placeholder="Pekerjaan"
                value={form.occupation}
                onChange={handleChange}
                className="w-full py-4 px-6 rounded-2xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 font-semibold text-zinc-700"
                required
              />
            </div>

            {/* INSTITUTION */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-widest">
                Institusi Tempat Bekerja
              </label>
              <input
                name="institution"
                type="text"
                placeholder="Institusi / Perusahaan"
                value={form.institution}
                onChange={handleChange}
                className="w-full py-4 px-6 rounded-2xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 font-semibold text-zinc-700"
                required
              />
            </div>


            {/* IDENTITY TYPE */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-widest">
                Jenis Kartu Identitas
              </label>

              <select
                name="identityType"
                value={form.identityType}
                onChange={handleChange}
                className="w-full py-4 px-6 rounded-2xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 font-semibold text-zinc-700"
                required
              >
                <option value="">Pilih kartu identitas</option>
                <option value="ktp">KTP</option>
                <option value="passport">Passport</option>
                <option value="sim">SIM</option>
              </select>              
            </div>


            {/* IDENTITY CARD */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-widest">
                Foto Kartu Identitas
              </label>
              <input
                type="file"
                name="identityCard"
                accept="image/*"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    identityCard: e.target.files[0],
                  }))
                }
                className="w-full py-4 px-6 rounded-2xl border border-zinc-200"
                required
              />
            </div>


            {/* CHECK IN DATE */}
            <div className="md:w-1/2 flex flex-col gap-3">
              <label className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-widest">
                Tanggal Mulai Sewa
              </label>
              <input
                name="checkInDate"
                type="date"
                value={form.checkInDate}
                onChange={handleChange}
                className="w-full outline-none py-4 px-6 rounded-2xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 font-semibold text-zinc-700"
                required
              />
            </div>

            {/* END DATE (AUTO) */}
            <div className="md:w-1/2 flex flex-col gap-3">
              <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                Tanggal Selesai (Auto 30 Hari)
              </label>
              <input
                type="date"
                value={endDate}
                disabled
                className="w-full py-4 px-6 rounded-2xl border border-zinc-100 bg-zinc-100 text-zinc-500 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="bg-zinc-50/50 p-8 border-t border-zinc-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-zinc-400 font-bold hover:text-zinc-600 transition-colors uppercase tracking-widest text-xs"
          >
            Kembali
          </button>

          <button
            type="submit"
            className="flex items-center gap-3 px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-900 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95 uppercase tracking-widest text-xs"
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