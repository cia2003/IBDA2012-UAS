import { NavLink, Outlet } from "react-router-dom";
import { useAppContext } from "../../hook/useAppContext";
import { BedDouble, UsersRound, LayoutDashboard } from "lucide-react";

const StaffLayout = () => {
    const { staffData, logout } = useAppContext();

    const managerSidebarLinks = [
        { name: "Dashboard", path: "/dashboard/manager",icon: <LayoutDashboard /> 
        },
        { name: "Laporan", path: "/dashboard/manager/laporan",icon: <LayoutDashboard /> 
        },
        { name: "Tambah Kost", path: "/dashboard/manager/tambah-kost", icon: <LayoutDashboard /> 
        },
    ];

    const staffSidebarLinks =[
        { name: "Dashboard", path: `/dashboard/staff/${staffData?.id}`, icon: <LayoutDashboard />
        },
        { name: "Kamar", path: `/dashboard/staff/${staffData?.id}/kamar`, icon: <BedDouble />},
        { name: "Penghuni", path: `/dashboard/staff/${staffData?.id}/penghuni`, icon: <UsersRound />},
    ]

    const sidebarLinks = staffData?.role === "MANAGER" ? managerSidebarLinks : staffSidebarLinks
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* NAVBAR */}
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <img className="h-8" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/dummyLogoColored.svg" alt="logo" />
                </div>
                <div className="flex items-center gap-5 text-gray-500">
                    <p className="text-sm">Hi! <span className="font-semibold text-gray-800">{staffData?.name || 'StaffLayout'}</span></p>
                    <button 
                        onClick={logout}
                        className='border border-red-200 text-red-500 hover:bg-red-50 transition-colors rounded-full text-xs px-4 py-1.5'
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex flex-1">
                {/* SIDEBAR */}
                <div className="md:w-64 w-16 border-r min-h-[calc(100vh-65px)] bg-white border-gray-300 pt-4 flex flex-col transition-all duration-300 sticky top-[65px]">
                    {sidebarLinks.map((link)=>
                            <NavLink 
                                to={link.path} 
                                key={link.path}
                                end 
                                className={({ isActive }) => 
                                    `flex items-center py-3 px-4 gap-3 transition-all
                                    ${isActive 
                                        ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-500" 
                                        : "hover:bg-gray-100 text-gray-700 border-transparent"
                                    }`
                                }
                            >
                                {link.icon}
                                <p className="md:block hidden font-medium">{link.name}</p>
                            </NavLink>
                        )
                    }
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffLayout;