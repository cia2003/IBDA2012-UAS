// Layout menampilkan user page

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Breadcrumb from "../../components/ui/BreadCrumb";

function User() {
  const location = useLocation()
  const hiddenCrumbs = location.pathname.includes('/registration')
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8">
        {!hiddenCrumbs && <Breadcrumb />}
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default User;
