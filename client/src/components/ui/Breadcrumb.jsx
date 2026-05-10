// Breadcrumb.jsx
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useManagerContext } from "../../hook/useContext";
import { useEffect, useState } from "react";

// Definisikan pola ID kost di satu tempat agar mudah diubah
const KOST_ID_REGEX = /^K\d+$/i;

export default function Breadcrumb() {
  const location = useLocation();
  const { getKostById } = useManagerContext();
  const pathnames = location.pathname.split("/").filter(Boolean);
  const [dynamicLabels, setDynamicLabels] = useState({});

  useEffect(() => {
    const fetchLabels = async () => {
      // Filter hanya segment yang belum ada labelnya dan cocok pola ID kost
      const toFetch = pathnames.filter(
        (value) => KOST_ID_REGEX.test(value) && !dynamicLabels[value]
      );

      if (toFetch.length === 0) return;

      const entries = await Promise.all(
        toFetch.map(async (value) => {
          const data = await getKostById(value);
          return data?.name ? [value, data.name] : null;
        })
      );

      const newLabels = Object.fromEntries(entries.filter(Boolean));

      if (Object.keys(newLabels).length > 0) {
        setDynamicLabels((prev) => ({ ...prev, ...newLabels }));
      }
    };

    fetchLabels();
  }, [location.pathname]);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 font-medium py-4">
      <Link to="/" className="hover:text-indigo-600 transition-colors flex items-center">
        <Home size={18} />
      </Link>

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        const displayName =
          dynamicLabels[value] ||
          value.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <div key={to} className="flex items-center space-x-2">
            <ChevronRight size={16} className="text-gray-300" />
            {last ? (
              <span className="text-indigo-600 font-bold truncate max-w-[150px] md:max-w-none">
                {displayName}
              </span>
            ) : (
              <Link to={to} className="hover:text-zinc-800 transition-colors">
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}