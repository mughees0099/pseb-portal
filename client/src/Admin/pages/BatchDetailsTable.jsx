import { useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Sidebar from "../Sidebar";
import Header from "../Header";

const CandidatesTable = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Set the number of items to show per page

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
    {
      code: "CND-01325261",
      name: "Abdul Muheed",
      fatherName: "Muhammad Bilal",
      contact: "03150519274",
      cnic: "1730130145817",
    },
    {
      code: "CND-01230294",
      name: "Abdul Nawaz",
      fatherName: "Madad Khan",
      contact: "03569916437",
      cnic: "2120350639611",
    },
    {
      code: "CND-01323983",
      name: "Abdul Qadeer",
      fatherName: "Fazal Ghani",
      contact: "03139662099",
      cnic: "1730187814983",
    },
    {
      code: "CND-01313154",
      name: "Abdul Wahab",
      fatherName: "Alif Shah",
      contact: "03130416155",
      cnic: "1730158331879",
    },
    {
      code: "CND-01233318",
      name: "Abdullah",
      fatherName: "Wazir Khan",
      contact: "03422849706",
      cnic: "1540218592215",
    },
  ];

  // Filter data based on search term
  const filteredData = data.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.cnic.includes(searchTerm)
  );

  // Calculate pagination
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

  return (
    <div className="flex h-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-5xl font-bold text-blue-950 mb-8">Reports</h1>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-50 min-h-screen p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-semibold text-gray-800">
                    Candidates: Cyber Security (CEH, CHFI)
                  </h1>
                  <button
                    onClick={exportToExcel}
                    className="bg-green-700 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
                  >
                    Export .xlsx
                  </button>
                </div>

                {/* Search Bar */}
                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search by Name or CNIC"
                    className="w-72 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
                    Search
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
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
                      {currentData.length > 0 ? (
                        currentData.map((candidate, index) => (
                          <tr
                            key={index}
                            className={`${
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } hover:bg-gray-100`}
                          >
                            <td className="p-3 border">{candidate.code}</td>
                            <td className="p-3 border">{candidate.name}</td>
                            <td className="p-3 border">
                              {candidate.fatherName}
                            </td>
                            <td className="p-3 border">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {candidate.contact}
                              </span>
                            </td>
                            <td className="p-3 border">{candidate.cnic}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center text-gray-500 p-3 font-medium"
                          >
                            No candidates found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidatesTable;
