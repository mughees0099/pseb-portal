import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";

const MarkAttendance = () => {
  const { batchId, date } = useParams(); // Get batch ID and date from URL
  const navigate = useNavigate();

  // Sample data for demonstration
  const students = [
    {
      id: 1,
      name: "Muhammad Farooq Shah",
      fatherName: "Nasir Shah",
      cnic: "1730146884153",
    },
    {
      id: 2,
      name: "Waqas Ahmed",
      fatherName: "Kashmir Khan",
      cnic: "1720172784279",
    },
    {
      id: 3,
      name: "Aizaz Ali",
      fatherName: "Muhammad Usman",
      cnic: "1730178827153",
    },
    {
      id: 4,
      name: "Haseeb Ahmad Khalil",
      fatherName: "Sabir Hassan",
      cnic: "1730126499247",
    },
    // Add more students as needed
  ];

  // Manage attendance for each student
  const [attendance, setAttendance] = useState(
    students.map((student) => ({ ...student, status: "Present" }))
  );

  // Handle attendance status change for individual students
  const handleStatusChange = (id, status) => {
    setAttendance((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status } : student
      )
    );
  };

  // Bulk actions for all students
  const markAllAs = (status) => {
    setAttendance((prev) => prev.map((student) => ({ ...student, status })));
  };

  const handleSaveAttendance = () => {
    console.log("Attendance Data:", attendance);
    // Perform save operation here (e.g., API call)
    navigate(`/batch/${batchId}`);
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-5xl font-bold text-blue-950 mb-8">
              Marking Attendance of {date} - Batch {batchId}
            </h1>
            <div className="bg-slate-50 min-h-screen">
              {/* Header Section */}

              <div className="container mx-auto px-6 py-8">
                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mb-4">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    onClick={() => markAllAs("Absent")}
                  >
                    Mark All as Absent
                  </button>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    onClick={() => markAllAs("Present")}
                  >
                    Mark All as Present
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    onClick={() => markAllAs("Holiday")}
                  >
                    Mark as Public Holiday
                  </button>
                </div>

                {/* Attendance Table */}
                <table className="w-full text-left border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-3 border">Name</th>
                      <th className="p-3 border">Father Name</th>
                      <th className="p-3 border">CNIC</th>
                      <th className="p-3 border">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="p-3 border">{student.name}</td>
                        <td className="p-3 border">{student.fatherName}</td>
                        <td className="p-3 border">{student.cnic}</td>
                        <td className="p-3 border">
                          <div className="flex items-center space-x-4">
                            <label>
                              <input
                                type="radio"
                                name={`status-${student.id}`}
                                value="Present"
                                checked={student.status === "Present"}
                                onChange={() =>
                                  handleStatusChange(student.id, "Present")
                                }
                              />
                              <span className="ml-2">Present</span>
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={`status-${student.id}`}
                                value="Absent"
                                checked={student.status === "Absent"}
                                onChange={() =>
                                  handleStatusChange(student.id, "Absent")
                                }
                              />
                              <span className="ml-2">Absent</span>
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={`status-${student.id}`}
                                value="Leave"
                                checked={student.status === "Leave"}
                                onChange={() =>
                                  handleStatusChange(student.id, "Leave")
                                }
                              />
                              <span className="ml-2">Leave</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Save and Cancel Buttons */}
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    onClick={handleSaveAttendance}
                  >
                    Save Attendance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MarkAttendance;
