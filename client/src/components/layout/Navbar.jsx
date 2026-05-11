import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";
import { ChevronDown, Menu, X, User, Heart, LogOut, Settings } from "lucide-react";
import { useAppContext } from "../../hook/useContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { userIsLoggedIn, userLogout, userData } = useAppContext();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Menutup dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Cari Kost", path: "/" },
    { name: "Tentang Kami", path: "/about" },
    { name: "Blogs", path: "/blogs" },
  ];

  const handleLogout = () => {
    userLogout();
    setUserDropdownOpen(false);
    navigate("/");
  };

  const NavItem = ({ to, children }) => (
    <Link
      to={to}
      className="relative text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors duration-300 group py-2"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
    </Link>
  );

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 border-b border-zinc-100 px-6 md:px-15 py-4 flex items-center justify-between z-[100]">
      <div className="flex items-center gap-16">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <Logo />
        </div>

        {/* Desktop Menu Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-sm font-medium text-zinc-800 cursor-pointer py-2 hover:text-indigo-600 transition-colors">
              Bantuan
              <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-zinc-100 rounded-2xl shadow-xl py-3 z-50 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
              {["Cara Pesan", "Pusat Bantuan", "Syarat & Ketentuan"].map((item) => (
                <Link
                  key={item}
                  to="#"
                  className="block px-5 py-2 text-sm text-zinc-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {navLinks.map((link) => (
            <NavItem key={link.name} to={link.path}>
              {link.name}
            </NavItem>
          ))}
        </div>
      </div>

      {/* Desktop Auth Section */}
      <div className="hidden md:flex items-center gap-4">
        {!userIsLoggedIn ? (
          <button
            onClick={() => navigate("/login")}
            className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all active:scale-95"
          >
            Login
          </button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 pr-3 bg-zinc-50 border border-zinc-200 rounded-full hover:bg-zinc-100 transition-all"
            >
              <div className="bg-indigo-600 p-2 rounded-full text-white">
                <User size={18} />
              </div>
              <span className="text-sm font-bold text-zinc-700">{userData?.name?.split('')[0] || "User"}</span>
              <ChevronDown size={14} className={`text-zinc-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-zinc-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-3 border-b border-zinc-50">
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Akun Saya</p>
                  <p className="text-sm font-bold text-zinc-800 truncate">{userData?.email}</p>
                </div>
                
                <Link 
                  to="/wishlist" 
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <Heart size={16} /> Wishlist Favorit
                </Link>

                <hr className="my-1 border-zinc-100" />
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold"
                >
                  <LogOut size={16} /> Keluar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`absolute top-full left-0 w-full bg-white border-t border-zinc-100 p-6 flex flex-col gap-4 md:hidden shadow-2xl transition-all duration-300 origin-top ${
          menuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => setMenuOpen(false)}
            className="text-lg font-semibold text-zinc-800 px-4 py-2 hover:bg-zinc-50 rounded-xl transition-colors"
          >
            {link.name}
          </Link>
        ))}
        
        <hr className="border-zinc-100" />

        {!userIsLoggedIn ? (
          <button
            onClick={() => { navigate("/login"); setMenuOpen(false); }}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
          >
            Login
          </button>
        ) : (
          <div className="space-y-2">
            <Link 
              to="/wishlist" 
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 w-full p-4 bg-zinc-50 text-zinc-700 font-bold rounded-2xl"
            >
              <Heart size={20} className="text-red-500" /> Wishlist Saya
            </Link>
            <button
              onClick={handleLogout}
              className="w-full py-4 border-2 border-red-100 text-red-500 font-bold rounded-2xl flex items-center justify-center gap-2"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;