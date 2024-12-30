import { useState } from "react";

function StudentsTable() {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample student data
  const students = [
    { id: 1, name: "John Doe", course: "Game Development" },
    { id: 2, name: "Jane Smith", course: "PMP" },
    { id: 3, name: "Samuel Green", course: "Digital Marketing" },
    { id: 4, name: "Lisa Brown", course: "MERN" },
  ];

  // Filtered student data based on the search term
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-5xl font-bold text-blue-950 mb-8">Students</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="p-2 border border-gray-300 rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-4">ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">Course</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id} className="border-t">
              <td className="p-4">{student.id}</td>
              <td className="p-4">{student.name}</td>
              <td className="p-4">{student.course}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentsTable;
