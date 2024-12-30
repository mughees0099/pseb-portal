/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KpiCard from "./Kpi/KpiCard";
import {
  faUsers,
  faLandmark,
  faMicrochip,
  faGraduationCap,
  faMale,
  faFemale,
} from "@fortawesome/free-solid-svg-icons";
import Table from "./StudentTable"; // Import the Table component

const TableWithFilters = ({ data = [] }) => {
  const [filters, setFilters] = useState({
    fullName: "",
    fatherName: "",
    gender: "",
    status: "",
    cnic: "",
  });
  const [selectedTrade, setSelectedTrade] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;
  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTradeChange = (e) => {
    setSelectedTrade(e.target.value);
  };

  // Calculate KPIs based on selected trade only
  const kpiData = data.filter(
    (record) =>
      selectedTrade === "" ||
      (record.trade &&
        record.trade.toLowerCase() === selectedTrade.toLowerCase())
  );

  const totalStudents = kpiData.length;
  const totalMales = kpiData.filter(
    (record) => record.gender?.toLowerCase() === "male"
  ).length;
  const totalFemales = kpiData.filter(
    (record) => record.gender?.toLowerCase() === "female"
  ).length;
  const totalGovtStudents = kpiData.filter(
    (record) => record.category === "Government-Employe"
  ).length;

  const totalIPProfessionals = kpiData.filter(
    (record) => record.category === "IT-Professional"
  ).length;

  const totalFirstGraduates = kpiData.filter(
    (record) => record.category === "Fresh-Graduate"
  ).length;

  // Filter Table Data Logic
  const filteredData = Array.isArray(data)
    ? data.filter((record) => {
        const tradeMatch =
          selectedTrade === "" ||
          (record.trade &&
            record.trade.toLowerCase() === selectedTrade.toLowerCase());
        const cnicMatch =
          filters.cnic === "" ||
          (record.cnic && record.cnic.includes(filters.cnic));
        const fullNameMatch =
          filters.fullName === "" ||
          (record.fullName &&
            record.fullName
              .toLowerCase()
              .includes(filters.fullName.toLowerCase()));
        const fatherNameMatch =
          filters.fatherName === "" ||
          (record.fatherName &&
            record.fatherName
              .toLowerCase()
              .includes(filters.fatherName.toLowerCase()));
        const genderMatch =
          filters.gender === "" ||
          (record.gender &&
            record.gender.toLowerCase() === filters.gender.toLowerCase());
        const statusMatch =
          filters.status === "" ||
          (record.status &&
            record.status.toLowerCase() === filters.status.toLowerCase());

        return (
          tradeMatch &&
          fullNameMatch &&
          fatherNameMatch &&
          genderMatch &&
          cnicMatch &&
          statusMatch
        );
      })
    : [];
  // Pagination
  const paginatedData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleEdit = (id, trade) => {
    navigate(`/admin/edit/${id}/${trade}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6">
      {/* Filters Section for KPIs */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Trade
          </label>
          <select
            value={selectedTrade}
            onChange={handleTradeChange}
            className="mt-1 p-2 border border-gray-300 rounded-lg shadow-sm w-full"
          >
            <option value="">All Trades</option>
            {Array.from(new Set(data.map((record) => record.trade))).map(
              (trade) => (
                <option key={trade} value={trade}>
                  {trade}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* KPIs Section */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          heading="Total Students"
          icon={faUsers}
          value={totalStudents}
          bgColor="#e5e7eb"
          bgCard="#fff"
          iconColor="#374151"
          headindCard="#1f2937"
          valueCard="#1f2937"
        />
        <KpiCard
          heading="Male Students"
          icon={faMale}
          value={totalMales}
          bgColor="#e5e7eb"
          bgCard="#fff"
          iconColor="#374151"
          headindCard="#1f2937"
          valueCard="#1f2937"
        />
        <KpiCard
          heading="Female Students"
          icon={faFemale}
          value={totalFemales}
          bgColor="#f3f4f6"
          bgCard="#fff"
          iconColor="#9ca3af"
          headindCard="#1f2937"
          valueCard="#1f2937"
        />
        <KpiCard
          heading="Govt. Students"
          icon={faLandmark}
          value={totalGovtStudents}
          bgColor="#d1d5db"
          bgCard="#fff"
          iconColor="#1f2937"
          headindCard="#1f2937"
          valueCard="#1f2937"
        />
        <KpiCard
          heading="IT Professionals"
          icon={faMicrochip}
          value={totalIPProfessionals}
          bgColor="#e2e8f0"
          bgCard="#fff"
          iconColor="#1e40af"
          headindCard="#1f2937"
          valueCard="#1f2937"
        />
        <KpiCard
          heading="First Graduates"
          icon={faGraduationCap}
          value={totalFirstGraduates}
          bgColor="#fef2f2"
          bgCard="#fff"
          iconColor="#991b1b"
          headindCard="#1f2937"
          valueCard="#1f2937"
        />
      </div>

      {/* Filters Section for Table */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="fullName"
            value={filters.fullName}
            onChange={handleFilterChange}
            className="mt-1 p-2 border border-gray-300 rounded-lg shadow-sm w-full"
            placeholder="Filter by name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            className="mt-1 p-2 border border-gray-300 rounded-lg shadow-sm w-full"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="mt-1 p-2 border border-gray-300 rounded-lg shadow-sm w-full"
          >
            <option value="">Any</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <Table
        data={paginatedData.map((record) => ({
          fullName: record.fullName,
          gender: record.gender,
          trade: record.trade,
          city: record.city || "N/A",
          cnic: record.cnic,
        }))}
        onEdit={handleEdit}
      />

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(filteredData.length / recordsPerPage) },
          (_, i) => i + 1
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`mx-1 px-3 py-1 rounded-lg shadow ${
              pageNumber === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TableWithFilters;
