/* eslint-disable react/prop-types */

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Header from "./Header";
import Sidebar from "./Sidebar";

import KpiCard from "./Kpi/KpiCard";

import {
  faUsers,
  faLandmark,
  faMicrochip,
  faGraduationCap,
  faLocationDot,
  faServer,
  faGamepad,
  faChartLine,
  faMobileAlt,
  faAtom,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import EnrollmentBarChart from "./EnrollmentBarChart .jsx/EnrollmentBarChart ";

import StudentTable from "./StudentTable";
import GenderDonutChart from "./GenderDonutChart/GenderDonutChart";
import StudentStatus from "./StudentStatus";

const queryClient = new QueryClient();

export default function AdminDashboard({
  data,
  usersData,
  uniqueData,
  tableData,
  enrollmentData,
  courses,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const maleCount = usersData.filter((user) => user.gender === "male").length;
  const femaleCount = usersData.filter(
    (user) => user.gender === "female"
  ).length;
  const totalCount = maleCount + femaleCount;
  const malePercentage = totalCount ? (maleCount / totalCount) * 100 : 0;
  const femalePercentage = totalCount ? (femaleCount / totalCount) * 100 : 0;
  const dataForHome = tableData
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen ">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100">
            <div className="container grid grid-cols-12 gap-10 mx-auto px-6 py-8 ">
              <h1 className=" text-5xl font-bold text-blue-950 ">Dashboad</h1>
              <StudentStatus data={uniqueData} courses={courses} />
              <div className="grid xl:grid-cols-4 md:grid-cols-2 col-span-12 sm:grid-cols-1 gap-10">
                <KpiCard
                  heading="Total Student"
                  icon={faUsers}
                  value={uniqueData.length}
                  bgColor="#D81159"
                  iconColor="#fff"
                />
                <KpiCard
                  heading="Government Employees"
                  icon={faLandmark}
                  value={
                    usersData.filter(
                      (user) => user.category === "Government-Employe"
                    ).length
                  }
                  bgColor="#FFBC42"
                  iconColor="#fff"
                />
                <KpiCard
                  heading="IT Professionals"
                  icon={faMicrochip}
                  value={
                    usersData.filter(
                      (user) => user.category === "IT-Professional"
                    ).length
                  }
                  bgColor="#0496FF"
                  iconColor="#fff"
                />
                <KpiCard
                  heading="Fresh Graduates"
                  icon={faGraduationCap}
                  value={
                    usersData.filter(
                      (user) => user.category === "Fresh-Graduate"
                    ).length
                  }
                  bgColor="#91cb3e"
                  iconColor="#fff"
                />
              </div>
              <div className="col-span-8 ">
                <EnrollmentBarChart data={enrollmentData} />
              </div>
              <div className="bg-white rounded-lg col-span-4">
                <GenderDonutChart
                  malePercentage={malePercentage}
                  femalePercentage={femalePercentage}
                />
              </div>
              <div className="col-span-5 bg-white rounded-lg p-4 ">
                <StudentTable data={dataForHome} />
              </div>
              {/* Cities KPI */}
              <div className="col-span-7 grid grid-cols-3 gap-10 bg-white rounded-lg p-4">
                <KpiCard
                  heading="Peshawar"
                  icon={faLocationDot}
                  value={
                    data.filter((student) => student.city === "Peshawar").length
                  }
                  bgColor="#D81159"
                  iconColor="#fff"
                />
                <KpiCard
                  heading="Karachi"
                  icon={faLocationDot}
                  value={
                    data.filter((student) => student.city === "Karachi").length
                  }
                  bgColor="#FFBC42"
                  iconColor="#fff"
                />
                <KpiCard
                  heading="Islamabad"
                  icon={faLocationDot}
                  value={
                    data.filter((student) => student.city === "Islamabad")
                      .length
                  }
                  bgColor="#0496FF"
                  iconColor="#fff"
                />
                <KpiCard
                  heading="Lahore"
                  icon={faLocationDot}
                  value={
                    data.filter((student) => student.city === "Lahore").length
                  }
                  bgColor="#91cb3e"
                  iconColor="#fff"
                />
                <KpiCard
                  heading="Quetta"
                  icon={faLocationDot}
                  value={
                    data.filter((student) => student.city === "Quetta").length
                  }
                  bgColor="#91cb3e"
                  iconColor="#fff"
                />

                <KpiCard
                  heading="Rawalpindi"
                  icon={faLocationDot}
                  value={
                    data.filter((student) => student.city === "Rawalpindi")
                      .length
                  }
                  bgColor="#91cb3e"
                  iconColor="#fff"
                />
              </div>
              {/* Trade KPI */}
              <div className="col-span-12 grid grid-cols-3 gap-10">
                <KpiCard
                  heading="AWS"
                  icon={faServer}
                  value={
                    data.filter((user) => user.trade === "AWS Cloud Computing")
                      .length
                  }
                  bgColor="#ff9900"
                  iconColor="#fff"
                />
                <KpiCard
                  heading="Game Development"
                  icon={faGamepad}
                  value={
                    data.filter((user) => user.trade === "Game Development")
                      .length
                  }
                  bgColor="#D81159"
                  iconColor="#fff"
                />
                <KpiCard
                  heading="Digital Markiting"
                  icon={faChartLine}
                  value={
                    data.filter((user) => user.trade === "Digital Marketing")
                      .length
                  }
                  bgColor="#1877f2"
                  iconColor="#fff"
                />
                <KpiCard
                  heading="App Development"
                  icon={faMobileAlt}
                  value={
                    data.filter((user) => user.trade === "Mobile Development")
                      .length
                  }
                  bgColor="#D81159"
                  iconColor="#fff"
                />
                <KpiCard
                  heading="MERN"
                  icon={faAtom}
                  MERN
                  Stack
                  Development
                  value={
                    data.filter(
                      (user) => user.trade === "MERN Stack Development"
                    ).length
                  }
                  bgColor="#D81159"
                  iconColor="#fff"
                />
                <KpiCard
                  heading="PMP"
                  icon={faChartBar}
                  PMP
                  Certification
                  value={
                    data.filter((user) => user.trade === "PMP Certification")
                      .length
                  }
                  bgColor="#D81159"
                  iconColor="#fff"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
