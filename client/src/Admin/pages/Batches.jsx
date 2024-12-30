import { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";

function Batches() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  // Example batch data (each batch with 25 students)
  const batches = [
    { id: 1, name: "Batch 1", students: 25 },
    { id: 2, name: "Batch 2", students: 25 },
    { id: 3, name: "Batch 3", students: 25 },
    { id: 4, name: "Batch 4", students: 25 },
    // Add more batches as needed
  ];

  return (
    <div className="flex h-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-5xl font-bold text-blue-950 mb-8">
              Student Batches
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg"
                >
                  <h2 className="text-xl font-semibold text-blue-900 mb-2">
                    {batch.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Total Students:</strong> {batch.students}
                  </p>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                    onClick={() => navigate(`/admin/batches/${batch.id}`)} // Pass batch ID
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Batches;
