import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppContext } from "../../hook/useContext";
import {
  BedDouble,
  UsersRound,
  LayoutDashboard,
  Building2,
  DoorOpen,
  UserCheck,
  ContactRound,
} from "lucide-react";
import Logo from "../../components/ui/Logo";

const Layout = () => {
  const { staffData, adminLogout, role } = useAppContext();
  const navigate = useNavigate()
  const staffLinks = [
    {
      id: 1,
      name: "Dashboard",
      path: `/admin/dashboard/${staffData?.id}`,
      icon: <LayoutDashboard />,
    },
    {
      id: 2,
      name: "Kamar",
      path: `/admin/dashboard/${staffData?.id}/kamar`,
      icon: <DoorOpen />,
    },
    {
      id: 3,
      name: "Penghuni",
      path: `/admin/dashboard/${staffData?.id}/penghuni`,
      icon: <UsersRound />,
    },
    {
      id: 4,
      name: "Daftar Penghuni Baru",
      path: `/admin/dashboard/${staffData?.id}/penghuni-baru`,
      icon: <UserCheck />,
    },
  ];

  const managerLinks = [
    { id: 1, name: "Dashboard", path:"/admin/dashboard/manager", icon: <LayoutDashboard /> },
    { id: 2, name: "Daftar Kost", path:"/admin/dashboard/manager/kost", icon: <Building2 /> },
    { id: 3, name: "Daftar Staff", path:"/admin/dashboard/manager/staff", icon: <ContactRound /> },
  ]

  const sidebarLinks = role === "manager" ? managerLinks : staffLinks

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* NAVBAR*/}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white z-20 shrink-0">
        <div onClick={()=>navigate('/')} className="flex items-center gap-2">
          <Logo />
        </div>
        <div className="flex items-center gap-5 text-gray-500">
          <p className="text-sm">
            Hi!{" "}
            <span className="font-semibold text-gray-800">
              {staffData?.name || "StaffLayout"}
            </span>
          </p>
          <button
            onClick={adminLogout}
            className="border border-red-200 text-red-500 hover:bg-red-50 transition-colors rounded-full text-xs px-4 py-1.5"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <div className="md:w-64 w-16 border-r bg-white border-gray-300 pt-4 flex flex-col transition-all duration-300 shrink-0 overflow-y-auto scrollbar-hide">
          {sidebarLinks.map((link) => (
            <NavLink
              to={link.path}
              key={link.path}
              end
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-3 transition-all
                        ${
                          isActive
                            ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-500"
                            : "hover:bg-gray-100 text-gray-700 border-transparent"
                        }`
              }
            >
              <div className="shrink-0">{link.icon}</div>
              <p className="md:block hidden font-medium truncate">
                {link.name}
              </p>
            </NavLink>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 md:p-10 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
