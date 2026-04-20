// Definisi Role
export const ROLES = {
    MANAGER: 'MANAGER',
    STAFF: 'STAFF'
};

// Master Data Tipe Kamar (Sesuai Deskripsi Bisnis)
export const ROOM_TYPES = {
    TIPE_1: {
        name: 'Tipe 1',
        size: '2,5 m × 2,5 m',
        facilities: ['Kipas Angin', 'Kamar Mandi Luar'],
        price: 750000
    },
    TIPE_2: {
        name: 'Tipe 2',
        size: '3 m × 3 m',
        facilities: ['Kamar Mandi Dalam'],
        price: 1250000
    },
    TIPE_3: {
        name: 'Tipe 3',
        size: '4 m × 4 m',
        facilities: ['AC', 'Kamar Mandi Dalam', 'TV', 'Dispenser'],
        price: 2250000
    },
    TIPE_4: {
        name: 'Tipe 4',
        size: '5 m × 5 m',
        facilities: ['AC', 'TV', 'Mini Pantry', 'Dispenser', 'Kulkas', 'Kamar Mandi Dalam', 'Parkir Mobil'],
        price: 3750000
    }
};

export const staff = [
    { 
        id: 1, 
        name: 'Joshua', 
        role: ROLES.MANAGER, 
        assignedKost: null, 
        email: 'manager@email.com',
        password: 'manager123' 
    },
    { 
        id: 2, 
        name: 'Emily', 
        role: ROLES.STAFF, 
        assignedKost: 'K01',
        email: 'staff1@email.com',
        password: 'stafkos1' 
    },
    { 
        id: 3, 
        name: 'Michael', 
        role: ROLES.STAFF, 
        assignedKost: 'K02', 
        email: 'michael@email.com',
        password: 'stafkos2' 
    },
    { 
        id: 4, 
        name: 'Sarah', 
        role: ROLES.STAFF, 
        assignedKost: 'K03', 
        email: 'sarah@email.com',
        password: 'stafkost3' 
    },
];

export const kostData = [
    { 
        id: 'K01', 
        name: 'IBDA Kost A', 
        address: 'Jl. Merdeka No. 1', 
        rooms: [
            { id: 'A01', roomNumber: '101', ...ROOM_TYPES.TIPE_1, status: 'Available', resident: null },
            { id: 'A02', roomNumber: '102', ...ROOM_TYPES.TIPE_2, status: 'Available', resident: null },
        ],
        staffId: 2 
    },
    { 
        id: 'K02', 
        name: 'IBDA Kost B', 
        address: 'Jl. Sudirman No. 12', 
        rooms: [
            { id: 'B01', roomNumber: '201', ...ROOM_TYPES.TIPE_1, status: 'Available', resident: null },
            { id: 'B02', roomNumber: '202', ...ROOM_TYPES.TIPE_2, status: 'Occupied', 
              resident: [
                { id: 'P02', name: 'Andi', contact: '081222333444', checkInDate: '2026-02-01' }
            ] 
            },
        ],
        staffId: 3 
    },
    { 
        id: 'K03', 
        name: 'IBDA Kost C', 
        address: 'Jl. Thamrin No. 5', 
        rooms: [
            { id: 'C01', roomNumber: '301', ...ROOM_TYPES.TIPE_3, status: 'Occupied', 
              resident: [
                { id: 'P01', name: 'Budi', contact: '081234567891', email: 'budi@email.com', checkInDate: '2026-01-01' },
                { id: 'P03', name: 'Ujang', contact: '081234567891', email: 'ujang@email.com', checkInDate: '2026-01-01' }
            ]
            },
            { id: 'C02', roomNumber: '302', ...ROOM_TYPES.TIPE_4, status: 'Available', resident: null },
        ],
        staffId: 4
    },
];