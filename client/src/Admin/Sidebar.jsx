/* eslint-disable react/prop-types */
import { Home, Users, BarChart2, X, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
// import Link from 'next/link'

export default function Sidebar({ open, setOpen }) {
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    window.location.href = `/signin/4d1da864-3bab-433b-aca6-128fd69e0ccf`;
  };
  return (
    <div
      className={`${
        open ? "block" : "hidden"
      } fixed inset-y-0 left-0 z-50 w-28 bg-gray-800 overflow-y-auto transition duration-300 ease-in-out transform md:relative md:translate-x-0 md:block`}
    >
      <div className="flex items-center justify-end px-4 py-3">
        {" "}
        {/* <div className="flex-shrink-0 ">
          <img className="w-20" src="../../src/assets/logo.png" alt="Logo" />
        </div> */}
        <button onClick={() => setOpen(false)} className="md:hidden">
          <X className="h-6 w-6 text-white" />
        </button>
      </div>
      <nav className="mt-5 px-2 ">
        <Link
          to="/admin"
          className="group flex items-center justify-center text-base font-medium rounded-md text-white bg-gray-900 p-4 mb-2"
        >
          <Home className=" h-6 w-6 m-auto" />
          {/* Dashboard */}
        </Link>
        <Link
          to="/admin/std"
          className="group flex items-center justify-center text-base font-medium rounded-md text-white bg-gray-900 p-4 mb-2"
        >
          <Users className=" h-6 w-6 m-auto" />
          {/* Students */}
        </Link>
        {/* <Link
          to="/admin/reports"
          className="group flex items-center justify-center text-base font-medium rounded-md text-white bg-gray-900 p-4 mb-2"
        >
          <BarChart2 className=" h-6 w-6 m-auto" />
        
        </Link> */}
        <Link
          className="group flex items-center justify-center text-base font-medium rounded-md text-white bg-gray-900 p-4 mb-2"
          onClick={handleLogout}
        >
          <LogOut className=" h-6 w-6 m-auto" />
          {/* logout */}
        </Link>
      </nav>
    </div>
  );
}
