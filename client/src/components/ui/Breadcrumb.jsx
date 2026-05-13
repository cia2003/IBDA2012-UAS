// Breadcrumb.jsx
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useManagerContext } from "../../hook/useContext";
import { useEffect, useState } from "react";

// Definisikan pola ID kost di satu tempat agar mudah diubah
// const KOST_ID_REGEX = /^K\d+$/i;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function Breadcrumb() {
  const location = useLocation();
  const { getKostById, getTipeById } = useManagerContext();
  const pathnames = location.pathname.split("/").filter(Boolean);
  const [dynamicLabels, setDynamicLabels] = useState({});

  useEffect(() => {
    const fetchLabels = async () => {
      const routeFetchers = {
        kost: getKostById, 
        roomtype: getTipeById
      }

      const entries = await Promise.all(
        pathnames.map(async (value, index) => {
          if (!UUID_REGEX.test(value) || dynamicLabels[value]) {
            return null;
          }

          const resource = pathnames[index - 1];
          const fetcher = routeFetchers[resource];

          if (!fetcher) return null;

          try {
            const data = await fetcher(value);

            return data?.name
              ? [value, data.name]
              : null;
          } catch (error) {
            console.error(error);
            return null
          }
        })
      );

      const newLabels = Object.fromEntries(entries.filter(Boolean));

      if (Object.keys(newLabels).length > 0) {
        setDynamicLabels((prev) => ({ ...prev, ...newLabels }));
      }
    };

    fetchLabels();

  }, [location.pathname, getKostById]);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 font-medium py-4">
      <Link to="/" className="hover:text-indigo-600 transition-colors flex items-center">
        <Home size={18} />
      </Link>

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        const displayName = UUID_REGEX.test(value)
          ? dynamicLabels[value] || "Detail"
          : value
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
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