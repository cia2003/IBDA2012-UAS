import { Upload, ChevronRight } from "lucide-react";

const RoomForm = () => {
  const categories = [
    { name: "Tipe 1" },
    { name: "Tipe 2" },
    { name: "Tipe 3" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Upload size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">
              Tambah Kamar Baru
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Lengkapi detail informasi unit kamar
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-12 space-y-8">
          {/* Upload Section */}
          <div>
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Foto Kamar
            </label>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {Array(4)
                .fill("")
                .map((_, index) => (
                  <label key={index} htmlFor={`image${index}`}>
                    <input
                      accept="image/*"
                      type="file"
                      id={`image${index}`}
                      hidden
                    />
                    <img
                      className="max-w-24 cursor-pointer"
                      src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"
                      alt="uploadArea"
                      width={100}
                      height={100}
                    />
                  </label>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* No Kamar */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                htmlFor="no-room"
              >
                Nomor Kamar
              </label>
              <input
                id="no-room"
                type="text"
                className="w-full outline-none py-3 px-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-700"
                required
              />
            </div>

            {/* Tipe Kamar */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                htmlFor="category"
              >
                Tipe Kamar
              </label>
              <div className="relative">
                <select
                  id="category"
                  className="w-full outline-none py-3 px-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all appearance-none font-medium text-gray-700 bg-transparent"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <ChevronRight
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-bold text-gray-700 uppercase tracking-wider"
              htmlFor="product-description"
            >
              Fasilitas & Deskripsi
            </label>
            <textarea
              id="product-description"
              rows={4}
              className="w-full outline-none py-3 px-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-700 resize-none"
            ></textarea>
          </div>

          {/* Harga */}
          <div className="md:w-1/2 flex flex-col gap-2">
            <label
              className="text-sm font-bold text-gray-700 uppercase tracking-wider"
              htmlFor="product-price"
            >
              Harga Sewa / Bulan
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                Rp
              </span>
              <input
                id="product-price"
                type="number"
                className="w-full outline-none py-3 pl-12 pr-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-blue-600 text-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="bg-gray-50 p-8 border-t border-gray-100 flex justify-end">
          <button className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-100 transition-all active:scale-95 uppercase tracking-widest text-xs">
            Simpan Data Kamar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;
