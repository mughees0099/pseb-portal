import { useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
const BatchDetails = () => {
  const { batchId } = useParams(); // Retrieve batch ID from URL
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("candidates"); // Control the active tab
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items to show per page
  const navigate = useNavigate();
  // Sample data for demonstration
  const data = [
    {
      code: "CND-01312694",
      name: "Abbas Ali",
      fatherName: "Feroz Shah",
      contact: "034531972095",
      cnic: "1710202534235",
    },
    {
      code: "CND-01294969",
      name: "abc",
      fatherName: "abc",
      contact: "123456789461",
      cnic: "7846325961236",
    },
    {
      code: "CND-01332912",
      name: "Abdul Basit",
      fatherName: "Miraj Muhammad",
      contact: "03360179732",
      cnic: "1730184278723",
    },
    {
      code: "CND-01374429",
      name: "Abdul Basit",
      fatherName: "Niazmeen",
      contact: "03149117051",
      cnic: "1730181714337",
    },
    {
      code: "CND-01382720",
      name: "Abdul Faiq",
      fatherName: "Asghar Hayat",
      contact: "03401946061",
      cnic: "1420203647647",
    },
  ];

  // Attendance data
  const [attendanceData, setAttendanceData] = useState([
    { day: "Monday", date: "15 Jul, 2024", present: 0, absent: 0, onLeave: 0 },
    { day: "Tuesday", date: "16 Jul, 2024", present: 0, absent: 0, onLeave: 0 },
    {
      day: "Wednesday",
      date: "17 Jul, 2024",
      present: 0,
      absent: 0,
      onLeave: 0,
    },
    {
      day: "Thursday",
      date: "18 Jul, 2024",
      present: 0,
      absent: 0,
      onLeave: 0,
    },
    { day: "Friday", date: "19 Jul, 2024", present: 0, absent: 0, onLeave: 0 },
  ]);

  // Filter data based on search term
  const filteredData = data.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.cnic.includes(searchTerm)
  );

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Handle previous and next page
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Export to Excel
  const exportToExcel = () => {
    const headers = [["Code", "Name", "Father Name", "Contact", "CNIC"]];
    const rows = data.map((candidate) => [
      candidate.code,
      candidate.name,
      candidate.fatherName,
      candidate.contact,
      candidate.cnic,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
    XLSX.writeFile(workbook, "Candidates.xlsx");
  };

  // Function to mark attendance
  const markAttendance = (index) => {
    const updatedData = [...attendanceData];
    const candidates = prompt(
      "Enter attendance in format (present,absent,onLeave), e.g., 20,5,2"
    );

    if (candidates) {
      const [present, absent, onLeave] = candidates.split(",").map(Number);
      updatedData[index].present = present || 0;
      updatedData[index].absent = absent || 0;
      updatedData[index].onLeave = onLeave || 0;
      setAttendanceData(updatedData);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-5xl font-bold text-blue-950 mb-8">
              Batch {batchId} Details
            </h1>

            {/* Tabs */}
            <div className="flex space-x-4 border-b mb-6">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "candidates"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("candidates")}
              >
                Candidates
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "attendance"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("attendance")}
              >
                Attendance
              </button>
            </div>

            {/* Content */}
            {activeTab === "candidates" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-blue-900">
                    Candidates Table
                  </h2>
                  <button
                    onClick={exportToExcel}
                    className="bg-green-700 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
                  >
                    Export .xlsx
                  </button>
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search by Name or CNIC"
                    className="w-72 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <table className="w-full text-left border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-3 border">Code</th>
                      <th className="p-3 border">Name</th>
                      <th className="p-3 border">Father Name</th>
                      <th className="p-3 border">Contact</th>
                      <th className="p-3 border">CNIC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((candidate, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100`}
                      >
                        <td className="p-3 border">{candidate.code}</td>
                        <td className="p-3 border">{candidate.name}</td>
                        <td className="p-3 border">{candidate.fatherName}</td>
                        <td className="p-3 border">{candidate.contact}</td>
                        <td className="p-3 border">{candidate.cnic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <p className="text-gray-600">
                    Showing {currentData.length} of {filteredData.length} items
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 border rounded-lg ${
                        currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-gray-700 font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 border rounded-lg ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "attendance" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {attendanceData.map((day, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-red-100 text-red-600 rounded-full w-10 h-10 flex justify-center items-center">
                        <i className="fas fa-user-times"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-semibold text-gray-900">
                          {day.day}
                        </p>
                        <p className="text-sm text-gray-500">{day.date}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      <p>✅ Candidates Present: {day.present}</p>
                      <p>❌ Candidates Absent: {day.absent}</p>
                      <p>💬 Candidates On-Leave: {day.onLeave}</p>
                    </div>
                    <button
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700"
                      onClick={() =>
                        navigate(
                          `/admin/batch/${batchId}/mark-attendance?date=${day.date}`
                        )
                      }
                    >
                      Mark Attendance
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BatchDetails;
