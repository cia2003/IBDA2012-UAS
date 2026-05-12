import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { 
  kostData as initialKostData, 
  newTenant as initialNewTenantDummy 
} from "../assets/assets";
import toast from "react-hot-toast";
import api, { formDataApi } from "../api/api";
import { AppContext } from "./AppContext";

export const StaffContext = createContext();

export const StaffContextProvider = ({ children }) => {
  const { staffData } = useContext(AppContext)
  
  const [newTenantList, setNewTenantList] = useState([]);
  const [managedKost, setManagedKost] = useState(null);
  const [tenantData, setTenantData] = useState(null);

  // --- GET KOST DATA BY STAFF ID ---
  const getKostDataByStaffId = useCallback(async (staffId) => {
    if (!staffId) return;
    try {
      // -- MODE BACKEND --
      const response = await api.get(`employees/${staffId}/`);
      if(response.data){
        const kostId = response.data.kost; // Asumsikan response mengandung field kost yang merupakan ID kost yang dikelola
        const kostResponse = await api.get(`kosts/${kostId}/`); // Ambil data kost berdasarkan ID

        if (kostResponse.data) {
          setManagedKost(kostResponse.data);
        }
        return response.data;
      }

      // -- MODE DUMMY --
      // const data = initialKostData.find((t) => String(t.staffId) === String(staffId));
      // if (data) {
      //   setManagedKost(data);
      // }
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- UPDATE ROOM STATUS ---
  const updateRoomStatus = useCallback(async (roomId, status) => {
    try {
      // -- MODE BACKEND --
      const response = await api.put(`rooms/${roomId}/`, { status });
      if(response.data) toast.success('Status kamar diperbaharui');

      // -- MODE DUMMY --
      // toast.success(`Kamar ${roomId} kini ${status} (Dummy)`);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- ADD ROOM ---
  const addRoom = useCallback(async (roomForm) => {
    try {
      // -- MODE BACKEND --
      console.log(managedKost.id);

      const formData = new FormData();
      formData.append('kost', managedKost.id); // Asumsikan managedKost sudah memiliki ID kost yang dikelola
      formData.append('room_type', roomForm.category);
      formData.append('name', roomForm.roomNumber);
      formData.append('image', roomForm.image);
      formData.append('is_available', true); // Set default status kamar menjadi tersedia
      
      const response = await formDataApi.post("rooms/", formData);
      if(response.data) {
        toast.success("Kamar berhasil ditambahkan");
      };
    } catch (error) {
      console.error(error.message);
    }
  }, [managedKost]);

  // Get Room Details by ID (untuk edit)
  const getRoomById = useCallback(async (roomId) => {
    try {
      // -- MODE BACKEND --
      const response = await api.get(`rooms/${roomId}/`);
      return response.data;
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // Get All Room 
  const getAllRoomsByKostId = useCallback(async (kostId) => {
    try {
      // -- MODE BACKEND --
      const response = await api.get(`rooms/`);
      const { rooms } = response.data; // Asumsikan response mengandung field rooms yang merupakan array semua kamar

      const filteredRooms = rooms.filter((room) => String(room.kost) === String(kostId)); // Filter kamar berdasarkan kostId
      return filteredRooms;
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- ACCEPTED LEASE ---
  const getAcceptedLeases = useCallback(async (kostId) => {
    try {
      // -- MODE BACKEND --
      const response = await api.get(`leases/`); // Asumsikan endpoint ini mengembalikan semua lease
      const { leases } = response.data; // Asumsikan response mengandung field leases yang merupakan array semua lease

      return leases
        .filter((lease) => lease.status === 'accepted'); // Filter lease berdasarkan kostId dan status accepted
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- PENDING LEASE ---
  const getPendingLeases = useCallback(async (kostId) => {
    try {
      // -- MODE BACKEND --
      const response = await api.get(`leases/`); // Asumsikan endpoint ini mengembalikan semua lease
      const { leases } = response.data; // Asumsikan response mengandung field leases yang merupakan array semua lease
      const pendingLeases = leases.filter((lease) => String(lease.room.kost) === String(kostId) && lease.status === 'pending');
      return pendingLeases;
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- EDIT TENANT ---
  const editTenant = useCallback(async (tenantId, formData) => {
    try {
      // -- MODE BACKEND --
      await api.put(`tenants/${tenantId}/`, formData);

      // toast.success("Data penghuni diperbaharui");
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- DELETE TENANT ---
  const deleteTenant = useCallback(async (tenantId) => {
    try {
      // -- MODE BACKEND --
      await api.delete(`tenants/${tenantId}/`);

      // toast.success("Penghuni Berhasil Dihapus");
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- GET ALL TENANT ---
  const getAllTenants = useCallback(async () => { 
    try {
      // -- MODE BACKEND --
      const response = await api.get(`tenants/`); // Asumsikan endpoint ini mengembalikan semua tenant
      const { tenants } = response.data; // Asumsikan response mengandung field tenants yang merupakan array semua tenant
      return tenants;
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- GET NEW TENANT LIST (ANTRIAN) ---
  const getNewTenantList = useCallback(async (kostId) => {
    if (!kostId) return;
    try {
    // id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    // tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    // room = models.ForeignKey(Room, on_delete=models.CASCADE)
    // status = models.CharField(
    //     max_length=20, 
    //     choices=[
    //         ('pending', 'Pending'),
    //         ('accepted', 'Accepted'),
    //         ('rejected', 'Rejected')
    //     ],
    //     default='pending'
    // )
    // is_validated = models.BooleanField(default=False)
    // start_date = models.DateField()
    // end_date = models.DateField()

    // created_at = models.DateTimeField(auto_now_add=True)
    // updated_at = models.DateTimeField(auto_now=True)
      // -- MODE BACKEND --
      const leaseResponse = await api.get('leases/'); // Asumsikan endpoint ini mengembalikan semua lease
      const { leases } = leaseResponse.data; // Asumsikan response mengandung field leases yang merupakan array semua lease

      const filteredLeases = leases.filter((lease) => String(lease.room.kost) === String(kostId) && lease.status === 'pending'); // Filter lease berdasarkan kostId dan status pending
      setNewTenantList(filteredLeases);
      // const response = await api.get(`tenants/${kostId}/`);
      // setNewTenantList(response.data || []);

      // -- MODE DUMMY --
      // const data = initialNewTenantDummy.filter((t) => String(t.requestedKostId) === String(kostId));
      // setNewTenantList(data);
      return filteredLeases;
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- ACCEPT TENANT ---
  const acceptTenant = useCallback(async (tenantId) => {
    try {
      // -- MODE BACKEND --
      // await api.post(`/accept-tenant/${tenantId}`);

      toast.success("Permintaan diterima");
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- REJECT TENANT ---
  const rejectTenant = useCallback(async (tenantId) => {
    try {
      // -- MODE BACKEND --
      // await api.delete(`/reject-tenant/${tenantId}`);

      toast.success("Permintaan ditolak");
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // --- GET TENANT BY ID ---
  const getTenantById = useCallback(async (id) => {
    try {
      // -- MODE BACKEND --
      // const response = await api.get(`/tenant/${id}`);
      // return response.data;

      // -- MODE DUMMY --
      for (const kost of initialKostData) {
        for (const room of kost.rooms ?? []) {
          const occupant = room.resident?.find((p) => String(p.id) === String(id));
          if (occupant) {
            return { ...occupant, roomNumber: room.roomNumber, kostName: kost.name };
          }
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // -- NOTIFIKASI TAGIHAN PEMBAYARAN
  // const notifTenantsInvoice = useCallback(async()=>{
  //   try {
  //     const {data} = await api.post('tagih-pembayaran', staffData.idKost) // Dianggap bahwa login sukse mengembalikan data staff berupa id kost tempat ia bekerja
  //     if(data){
  //       toast.success("Notifikasi tagihan pembayaran berhasil dikirimkan")
  //     }else{
  //       toast.error("Tidak ada tenant yang memiliki tagihan pembayaran")
  //     }
  //   } catch (error) {
  //     console.error(error.message)
  //   }
  // })

  // OTOMATIS FETCH DATA SAAT STAFF LOGIN
  useEffect(() => {
    if (staffData && staffData.role === "staff") {
      getKostDataByStaffId(staffData.id);
    }
  }, [staffData, getKostDataByStaffId]);

  // OTOMATIS FETCH ANTRIAN JIKA KOST SUDAH DIDAPAT
  useEffect(() => {
    if (managedKost?.id) {
      getNewTenantList(managedKost.id);
    }
  }, [managedKost, getNewTenantList]);

  const value = useMemo(
    () => ({
      newTenantList,
      managedKost,
      tenantData,
      getAllRoomsByKostId,
      getAcceptedLeases,
      getPendingLeases,
      getRoomById,
      deleteTenant,
      getKostDataByStaffId,
      editTenant,
      updateRoomStatus,
      acceptTenant,
      rejectTenant,
      getNewTenantList,
      getTenantById,
      addRoom,
      // notifTenantsInvoice
    }),
    [newTenantList, managedKost, tenantData, deleteTenant, getKostDataByStaffId, editTenant, updateRoomStatus, acceptTenant, rejectTenant, getNewTenantList, getTenantById, addRoom]
  );

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
};