import { useNavigate, useParams } from "react-router-dom";
import { useStaffContext } from "../../../hook/useContext";
import KPICard from "../../../components/ui/KPICard";
import {
  House,
  Zap,
  UserRoundPlus,
  HousePlus,
  Users,
  BedDouble,
  CircleCheckBig,
  CalendarClock,
  BellRing,
} from "lucide-react";
import { useEffect, useMemo } from "react";

export default function StaffDashboard() {
  const { staffId } = useParams();
  const { managedKost, getKostDataByStaffId, 
    // notifTenantsInvoice 
  } = useStaffContext();
  const navigate = useNavigate();

  const kostData = managedKost?.managedKost;
  const currentRooms = kostData?.rooms;
  const totalRooms = currentRooms?.length || 0;

  const totalOccupants =
    currentRooms?.reduce(
      (total, room) =>
        total +
        (room.status === "Occupied" && room.resident
          ? room.resident.length
          : 0),
      0,
    ) || 0;

  const roomsLeft =
    currentRooms?.reduce((total, room) => {
      return room.status !== "Occupied" ? total + 1 : total;
    }, 0) || 0;

  const handleAddRooms = () => {};

  const overdueResidents = useMemo(() => {
    if (!currentRooms?.rooms) return [];

    const today = new Date();
    const overdueList = [];

    currentRooms.rooms.forEach((room) => {
      if (room.status === "Occupied" && room.resident) {
        room.resident.forEach((res) => {
          const due = new Date(res.paymentDueDate);

          if (due < today) {
            overdueList.push({
              ...res,
              roomNumber: room.roomNumber,
            });
          }
        });
      }
    });

    return overdueList;
  }, [currentRooms]);

  // const handleInvoiceNotif = async()=>{
  //   await notifTenantsInvoice()
  // }

  const columns = [
    { header: "Nama Penghuni", accessor: "name" },
    { header: "No. Kamar", accessor: "roomNumber" },
    {
      header: "Jatuh Tempo",
      accessor: "paymentDueDate",
      cell: (value) => (
        <span className="font-bold text-red-600">Setiap Tanggal {value}</span>
      ),
    },
    {
      header: "Kontak",
      accessor: "contact",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (staffId) {
        await getKostDataByStaffId(staffId);
      }
    };
    fetchData();
  }, [getKostDataByStaffId, staffId]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Kost Management Dashboard
        </h1>
        <p className="text-gray-500 font-medium">
          Monitoring Unit:{" "}
          <span className="text-blue-600">{kostData?.name || "memuat data..."}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 md:col-span-2">
          <KPICard
            title="Total Kamar"
            value={totalRooms}
            icon={<House className="text-blue-500" />}
          />
        </div>
        <div className="lg:col-span-1">
          <KPICard
            title="Total Penghuni"
            value={totalOccupants}
            icon={<Users className="text-purple-500" />}
          />
        </div>
        <div className="lg:col-span-1">
          <KPICard
            title="Kamar Tersedia"
            value={roomsLeft}
            icon={<CircleCheckBig className="text-green-500" />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <CalendarClock className="text-red-500" />
            <h2 className="text-xl font-bold text-gray-800">
              Tenant yang terlambat membayar
            </h2>
          </div>

          {overdueResidents.length > 0 ? (
            <Table columns={columns} data={overdueResidents} />
          ) : (
            <div className="text-center py-10 text-gray-400 italic">
              Tidak ada penghuni yang terlambat membayar bulan ini.
            </div>
          )}
        </div>
        {/* Quick Actions Section */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm w-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <Zap size={20} fill="currentColor" />
            </div>
            <h3 className="font-bold text-lg text-gray-800">Quick Actions</h3>
          </div>

          <div className="flex flex-row gap-3">
            <div className="flex flex-col gap-3 ">
            <button
              onClick={() => navigate(`/admin/dashboard/${staffId}/tambah-kamar`)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md group text-sm"
            >
              <HousePlus
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
              Tambah Kamar Baru
            </button>
            <button className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-black hover:text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md group text-sm">
              <BellRing
                // onClick={handleInvoiceNotif}
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
              Tagih Pembayaran
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
