import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";
import { ChevronDown, ArrowRight, Menu, X, User } from "lucide-react"; // Menggunakan Lucide agar lebih konsisten
import { useAppContext } from "../../hook/useContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { userIsLoggedIn, userLogout, userData } = useAppContext();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Cari Kost", path: "/" },
    { name: "Tentang Kami", path: "/about" },
    { name: "Blogs", path: "/blogs" },
  ];

  const NavItem = ({ to, children }) => (
    <Link
      to={to}
      className="relative text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors duration-300 group py-2"
    >
      {children}
      {/* Garis Hover */}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
    </Link>
  );

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 border-b border-zinc-100 px-6 md:px-15 py-4 flex items-center justify-between z-[100]">
      <div className="flex items-center gap-16">
        <div onClick={()=>navigate('/')}>
          <Logo />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {/* Dropdown Menu */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-sm font-medium text-zinc-800 cursor-pointer py-2 hover:text-indigo-600 transition-colors">
              Bantuan
              <ChevronDown
                size={14}
                className="transition-transform group-hover:rotate-180"
              />
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-zinc-100 rounded-2xl shadow-xl py-3 z-50 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
              {["Cara Pesan", "Pusat Bantuan", "Syarat & Ketentuan"].map(
                (item) => (
                  <Link
                    key={item}
                    to="#"
                    className="block px-5 py-2 text-sm text-zinc-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    {item}
                  </Link>
                ),
              )}
            </div>
          </div>

          {navLinks.map((link) => (
            <NavItem key={link.name} to={link.path}>
              {link.name}
            </NavItem>
          ))}
        </div>
      </div>

      {/* Desktop Auth Button */}
      <div className="hidden md:flex items-center gap-4">
        {!userIsLoggedIn ? (
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
          >
            Login
          </button>
        ) : (
          <User />
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
        className={`absolute top-full left-0 w-full bg-white border-t border-zinc-100 p-6 flex flex-col gap-4 md:hidden shadow-2xl transition-all duration-300 origin-top ${menuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="text-lg font-semibold text-zinc-800 px-4 py-2 hover:bg-zinc-50 rounded-xl"
          >
            {link.name}
          </Link>
        ))}
        <hr className="border-zinc-100" />
        {userIsLoggedIn ? (
          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 bg-zinc-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
          >
            Login
          </button>
        ) : (
          <User />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
