/* eslint-disable react/prop-types */
import { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import StudentStatus from "../StudentStatus";
import TableWithFilters from "../TableWithFilters";

// const mockData = [
//   {
//     id: 1,
//     name: "John Doe",
//     fatherName: "Michael Doe",
//     gender: "Male",
//     number: "1234567890",
//     trade: "Plumber",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     fatherName: "Robert Smith",
//     gender: "Female",
//     number: "0987654321",
//     trade: "Electrician",
//   },
//   {
//     id: 3,
//     name: "Alice Johnson",
//     fatherName: "David Johnson",
//     gender: "Female",
//     number: "1122334455",
//     trade: "Carpenter",
//   },
//   {
//     id: 4,
//     name: "Bob Williams",
//     fatherName: "James Williams",
//     gender: "Male",
//     number: "5566778899",
//     trade: "Welder",
//   },
//   {
//     id: 5,
//     name: "Charlie Brown",
//     fatherName: "Henry Brown",
//     gender: "Male",
//     number: "6677889900",
//     trade: "Mechanic",
//   },
//   {
//     id: 6,
//     name: "Diana Miller",
//     fatherName: "Paul Miller",
//     gender: "Female",
//     number: "7788990011",
//     trade: "Technician",
//   },
//   {
//     id: 7,
//     name: "Edward Wilson",
//     fatherName: "Mark Wilson",
//     gender: "Male",
//     number: "8899001122",
//     trade: "Electrician",
//   },
//   {
//     id: 8,
//     name: "Fiona Davis",
//     fatherName: "Peter Davis",
//     gender: "Female",
//     number: "9900112233",
//     trade: "Engineer",
//   },
//   {
//     id: 9,
//     name: "George Clark",
//     fatherName: "Samuel Clark",
//     gender: "Male",
//     number: "1011121314",
//     trade: "Plumber",
//   },
//   {
//     id: 10,
//     name: "Hannah Lewis",
//     fatherName: "Benjamin Lewis",
//     gender: "Female",
//     number: "1213141516",
//     trade: "Carpenter",
//   },
//   {
//     id: 11,
//     name: "Isaac Walker",
//     fatherName: "William Walker",
//     gender: "Male",
//     number: "1415161718",
//     trade: "Welder",
//   },
//   {
//     id: 12,
//     name: "Jessica Hall",
//     fatherName: "Arthur Hall",
//     gender: "Female",
//     number: "1516171819",
//     trade: "Technician",
//   },
//   {
//     id: 13,
//     name: "Kevin Allen",
//     fatherName: "Thomas Allen",
//     gender: "Male",
//     number: "1617181920",
//     trade: "Mechanic",
//   },
//   {
//     id: 14,
//     name: "Laura Young",
//     fatherName: "Richard Young",
//     gender: "Female",
//     number: "1718192021",
//     trade: "Engineer",
//   },
//   {
//     id: 15,
//     name: "Michael King",
//     fatherName: "Daniel King",
//     gender: "Male",
//     number: "1819202122",
//     trade: "Electrician",
//   },
//   {
//     id: 16,
//     name: "Natalie Wright",
//     fatherName: "Anthony Wright",
//     gender: "Female",
//     number: "1920212223",
//     trade: "Carpenter",
//   },
//   {
//     id: 17,
//     name: "Oliver Scott",
//     fatherName: "Patrick Scott",
//     gender: "Male",
//     number: "2021222324",
//     trade: "Welder",
//   },
//   {
//     id: 18,
//     name: "Penelope Baker",
//     fatherName: "Stephen Baker",
//     gender: "Female",
//     number: "2122232425",
//     trade: "Technician",
//   },
//   {
//     id: 19,
//     name: "Quentin Green",
//     fatherName: "Jonathan Green",
//     gender: "Male",
//     number: "2223242526",
//     trade: "Engineer",
//   },
//   {
//     id: 20,
//     name: "Rachel Adams",
//     fatherName: "Charles Adams",
//     gender: "Female",
//     number: "2324252627",
//     trade: "Plumber",
//   },
// ];

function Students({ uniqueData, tableData, userInfo, courses }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen ">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100">
          <div className="container grid grid-cols-12 gap-10 mx-auto px-6 py-8 ">
            <h1 className=" text-5xl font-bold text-blue-950 ">Student</h1>
            <StudentStatus data={uniqueData} courses={courses} />
            <div className="grid col-span-12">
              <TableWithFilters data={tableData} userInfo={userInfo} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Students;
