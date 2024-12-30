import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "../Header";
import Sidebar from "../Sidebar";

function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const cardData = [
    {
      title: "Game Development",
      category: "High-Tech (IT)",
      duration: "3 Months",
      candidates: 352,
      qualification: "Bachelors in IT/CS/SE/MIS/Maths/Stats",
    },
    {
      title: "PMP",
      category: "High-Tech (IT)",
      duration: "3 Months",
      candidates: 560,
      qualification: "Bachelors in IT/CS/SE/MIS/Maths/Stats",
    },
    // Add more data...
  ];

  return (
    <div className="flex h-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-5xl font-bold text-blue-950 mb-8">Reports</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cardData.map((card, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg"
                >
                  <h2 className="text-xl font-semibold text-blue-900 mb-2">
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">{card.category}</p>
                  <p className="text-sm text-gray-600">
                    <strong>Duration:</strong> {card.duration}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Candidates:</strong> {card.candidates}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Required Qualification:</strong>{" "}
                    {card.qualification}
                  </p>
                  <div className="flex space-x-4">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                      onClick={() => navigate("/admin/candidates")} // Redirect on button click
                    >
                      Candidates
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700"
                      onClick={() => navigate("/admin/batches")} // Redirect to the Batches page
                    >
                      Batches
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Reports;
