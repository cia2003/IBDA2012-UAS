import { NavLink, Outlet } from "react-router-dom";
import { useAppContext } from "../../hook/useAppContext";
import { House, UserRound } from "lucide-react";

const StaffLayout = () => {
    const { staffData, logout } = useAppContext();

    const dashboardicon = (
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z" />
        </svg>
    );

    const managerSidebarLinks = [
        { name: "Dashboard", path: "/dashboard/manager",icon: dashboardicon 
        },
        { name: "Laporan", path: "/dashboard/manager/laporan",icon: dashboardicon 
        },
        { name: "Tambah Kost", path: "/dashboard/manager/tambah-kost", icon: dashboardicon 
        },
    ];

    const staffSidebarLinks =[
        { name: "Dashboard", path: `/dashboard/staff/${staffData?.id}`, icon: dashboardicon 
        },
        { name: "Kamar", path: `/dashboard/staff/${staffData?.id}/kamar`, icon: <House />},
        { name: "Penghuni", path: `/dashboard/staff/${staffData?.id}/penghuni`, icon: <UserRound />},
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