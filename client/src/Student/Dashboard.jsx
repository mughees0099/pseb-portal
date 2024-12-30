/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";

export default function StudentDashboard({ userData }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <WelcomeHeader
        username={userData.fullName}
        profileImage={userData.profileImageUrl}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ApplicationsTable cnic={userData.cnic} />
      </div>
    </div>
  );
}

function WelcomeHeader({
  username = "User",
  profileImage = "/avatar-placeholder.gif",
}) {
  return (
    <div className="flex items-center gap-4 p-6">
      <div className="w-16 h-16 rounded-full bg-slate-300 overflow-hidden">
        <img
          src={profileImage}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-2xl font-semibold">Welcome, {username} </h1>
    </div>
  );
}

function ApplicationsTable({ cnic }) {
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/course/${cnic}`).then((res) => {
      setSelectedCourses(res.data);
    });
  }, [cnic]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Applications</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 hidden lg:table">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Program
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {selectedCourses.map((course) => (
              <tr key={course._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {course.trade}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {course.program}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {course.city}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    course.status === "Pending"
                      ? "text-blue-500"
                      : course.status === "Approved"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {course.status === "Pending"
                    ? "Pending"
                    : course.status === "Approved"
                    ? "Approved"
                    : "Rejected"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedCourses.map((course) => (
            <div
              key={course._id}
              className="p-4 mb-4 bg-white rounded-lg shadow"
            >
              <div className="text-sm text-gray-500">
                <strong>Trade:</strong> {course.trade}
              </div>
              <div className="text-sm text-gray-500">
                <strong>Program:</strong> {course.program}
              </div>
              <div className="text-sm text-gray-500">
                <strong>City:</strong> {course.city}
              </div>
              <div
                className={`text-sm ${
                  course.status === "Pending"
                    ? "text-blue-500"
                    : course.status === "Approved"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                <strong>Status:</strong>{" "}
                {course.status === "Pending"
                  ? "Pending"
                  : course.status === "Approved"
                  ? "Approved"
                  : "Rejected"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
