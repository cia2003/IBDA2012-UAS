import { FileUser, SaveAll, ArrowLeft } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useManagerContext } from "../../../hook/useContext";

function StaffForm() {
  const { staffId } = useParams();
  const { getKostData, getStaffById, editStaff, addStaff } = useManagerContext();
  const navigate = useNavigate();

  const formRole = Boolean(staffId);
  const [kostList, setKostList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "staff",
    telephone: "",
    assignedKost: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    const fetchData = async () => {
        const kost = await getKostData();
        if (kost) setKostList(kost);
        if (staffId) {
            const data = await getStaffById(staffId);
            console.log("Data ditemukan:", data); // Debugging
            if (data) {
                setFormData({
                    name: data.name || "",
                    role: data.role || "",
                    telephone: data.telephone || "",
                    assignedKost: data.assignedKost || "",
                    email: data.email || "",
                    password: data.password || ""
                });
            }
        }
    };
    fetchData();
}, [staffId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = formRole 
      ? await editStaff(staffId, formData) 
      : await addStaff(formData);

    if (success) {
      navigate("/dashboard/manager");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} /> Kembali
        </button>
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 shrink-0">
            <FileUser size={24} className="sm:w-[28px] sm:h-[28px]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {formRole ? "Edit Data Staff" : "Tambah Staff Baru"}
            </h1>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Nama Lengkap</label>
            <input 
              name="name"
              type="text" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Masukan nama staff..."
              className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Jabatan</label>
            <select name="role" value={formData.role} onChange={handleChange} className="border p-3 rounded-xl">
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Penempatan Kost</label>
            <select name="assignedKost" value={formData.assignedKost} onChange={handleChange} className="border p-3 rounded-xl">
              <option value="">Pilih Kost...</option>
              {kostList.map((k) => (
                <option key={k.id} value={k.name}>{k.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} className="border p-3 rounded-xl"/>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Password</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} className="border p-3 rounded-xl"/>
          </div>

          <div className="lg:col-span-2 mt-4">
            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 py-3 px-6 rounded-xl w-full sm:w-max transition-all" type="submit">
              <SaveAll size={18}/>
              <span className="font-bold">Simpan Data</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaffForm;