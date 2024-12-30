/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";
import { Home, Users, FileText, X, LogOut } from "lucide-react";
import PopUp from "./PopUp";
import { useState } from "react";

export default function Sidebar({ open, setOpen, handleLogout }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const location = useLocation().pathname;

  return (
    <div
      className={`${
        open ? "block" : "hidden"
      } fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white md:block md:static md:translate-x-0 transition-transform transform`}
    >
      {isPopupOpen && (
        <PopUp
          onConfirm={handleLogout}
          onCancel={() => setIsPopupOpen(false)}
          color="text-red-600"
          bgColor="bg-red-100"
          buttonColor="bg-red-600"
          onButtonHover="bg-red-700"
          title="Logout"
          message="Are you sure you want to logout?"
        />
      )}
      {/* Sidebar Header */}
      <div className="flex items-center justify-end px-4 py-3">
        <button
          onClick={() => setOpen(false)}
          className="md:hidden text-gray-400 hover:text-white focus:outline-none"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar Links */}
      <nav className="mt-5 px-2 space-y-2">
        <Link
          to="/"
          className={`group flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-gray-700 hover:text-white ${
            location == "/" && "bg-gray-500 text-white"
          }`}
          onClick={() => setOpen(false)}
        >
          <Home className="mr-3 h-6 w-6" />
          Home
        </Link>
        <Link
          to="/candidate/profile/register"
          className={`group flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-gray-700 hover:text-white ${
            location == "/candidate/profile/register" &&
            "bg-gray-500 text-white"
          }`}
          onClick={() => setOpen(false)}
        >
          <Users className="mr-3 h-6 w-6" />
          Personal Info
        </Link>
        <Link
          to="/courses"
          className={`group flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-gray-700 hover:text-white ${
            location == "/courses" && "bg-gray-500 text-white"
          }`}
          onClick={() => setOpen(false)}
        >
          <FileText className="mr-3 h-6 w-6" />
          Courses (
          <span className="mx-1 text-center text-xs apply-now">Apply Now</span>)
        </Link>

        <Link
          className="group flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-gray-700 hover:text-white"
          onClick={() => {
            setIsPopupOpen(true);
            setOpen(false);
          }}
        >
          <LogOut className="mr-3 h-6 w-6" />
          logout
        </Link>
      </nav>
    </div>
  );
}
