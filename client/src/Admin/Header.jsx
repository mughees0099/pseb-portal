/* eslint-disable react/prop-types */
import { Menu, Bell, User } from "lucide-react";

export default function Header({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="bg-white opacity-80 shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <h2 className="h-8 w-auto font-serif text-2xl">PSEB</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* <div className="flex items-center">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="ml-3 relative">
              <div>
                <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">Open user menu</span>
                  <User className="h-8 w-8 rounded-full" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </header>
  );
}
