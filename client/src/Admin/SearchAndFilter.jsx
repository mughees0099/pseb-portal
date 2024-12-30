import { Search } from "lucide-react";

export default function SearchAndFilter() {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <select className="border rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500">
            <option value="All">All Courses</option>
            <option value="mobile-dev">Mobile App Development</option>
            <option value="game-dev">Game Development</option>
            <option value="digital-marketing">Digital Marketing</option>
            <option value="mern-stack">Mern Stack</option>
            <option value="aws">AWS</option>
            <option value="pmp">PMP</option>
          </select>
          {/* <select className="border rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500">
            <option>All Departments</option>
            <option>Science</option>
            <option>Arts</option>
            <option>Commerce</option>
          </select> */}
        </div>
      </div>
    </div>
  );
}
