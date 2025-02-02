import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import KpiCard from "./Kpi/KpiCard"; // Assuming you have a KPI component
import Table from "./StudentTable"; // Your table component
import {
  faUsers,
  faLandmark,
  faMicrochip,
  faGraduationCap,
  faMale,
  faFemale,
} from "@fortawesome/free-solid-svg-icons";

const TableWithFilters = ({ data = [] }) => {
  const [filters, setFilters] = useState({
    fullName: "",
    gender: "",
    status: "",
    cnic: "",
  });
  const [selectedTrade, setSelectedTrade] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;
  const navigate = useNavigate();

  // Handle filter updates
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTradeChange = (e) => {
    setSelectedTrade(e.target.value);
  };

  // Recompute filtered data dynamically
  useEffect(() => {
    const newFilteredData = data.filter((record) => {
      const tradeMatch =
        selectedTrade === "" ||
        (record.trade &&
          record.trade.toLowerCase() === selectedTrade.toLowerCase());
      const fullNameMatch =
        filters.fullName === "" ||
        (record.fullName &&
          record.fullName
            .toLowerCase()
            .includes(filters.fullName.toLowerCase()));
      const genderMatch =
        filters.gender === "" ||
        (record.gender &&
          record.gender.toLowerCase() === filters.gender.toLowerCase());
      const statusMatch =
        filters.status === "" ||
        (record.status &&
          record.status.toLowerCase() === filters.status.toLowerCase());

      return tradeMatch && fullNameMatch && genderMatch && statusMatch;
    });

    setFilteredData(newFilteredData);
  }, [filters, selectedTrade, data]);

  // Paginate data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (id, trade) => {
    navigate(`/admin/edit/${id}/${trade}`);
  };
  console.log(data);

  return (
    <div className="p-6">
      {/* Filters Section for Trade */}
      <div className="mb-6">
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

      {/* KPIs Section */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          heading="Total Students"
          icon={faUsers}
          value={filteredData.length}
        />
        <KpiCard
          heading="Male Students"
          icon={faMale}
          value={
            filteredData.filter((record) => record.gender === "male").length
          }
        />
        <KpiCard
          heading="Female Students"
          icon={faFemale}
          value={
            filteredData.filter((record) => record.gender === "female").length
          }
        />
        <KpiCard
          heading="Govt. Employees"
          icon={faLandmark}
          value={
            filteredData.filter(
              (record) => record.category === "Government-Employe"
            ).length
          }
        />
        <KpiCard
          heading="IT Professionals"
          icon={faMicrochip}
          value={
            filteredData.filter(
              (record) => record.category === "IT-Professional"
            ).length
          }
        />
        <KpiCard
          heading="First Graduates"
          icon={faGraduationCap}
          value={
            filteredData.filter(
              (record) => record.category === "Fresh-Graduate"
            ).length
          }
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
          onEdit: () => handleEdit(record.cnic, record.trade), // Pass onEdit as a function
        }))}
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
