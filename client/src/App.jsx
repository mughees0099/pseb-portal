// /* eslint-disable react/prop-types */
// import { useEffect, useMemo, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import AdminDashboard from "./Admin/page";
// import Sidebar from "./Student/Sidebar";
// import CandidateProfilePage from "./Student/Candidate";
// import SignIn from "./Student/sign-in";
// import CandidateRegistration from "./Student/candidate-registration";
// import StudentDashboard from "./Student/Dashboard";
// import Navbar from "./Student/Navbar";
// import StudentDetail from "./Admin/StudentDetail";
// import Courses, { CourseDetail } from "./Student/Courses";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import AccountVerification from "./Student/AccountVerifcation";
// import ForgotPassword from "./Student/ForgotPassword";
// import { ResetPasswordOtp, ResetPassword } from "./Student/ResetPassword";
// import Students from "./Admin/pages/Students";
// import TableWithFilters from "./Admin/TableWithFilters";
// import mockData from "./Admin/mockData";
// import Reports from "./Admin/pages/Reports";
// import CandidatesTable from "./Admin/pages/CandidatesTable";
// import Batches from "./Admin/pages/Batches";
// import BatchDetails from "./Admin/pages/BatchDetails";
// import MarkAttendance from "./Admin/MarkAttendance";

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState("");
//   const [userData, setUserData] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [adminData, setAdminData] = useState([]);
//   const [usersData, setUsersData] = useState([]);
//   const [userInfo, setUserInfo] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [isAdmin, setIsAdmin] = useState(null);

//   const uniqueData = useMemo(() => {
//     return adminData.filter(
//       (student, index, self) =>
//         index === self.findIndex((s) => s.cnic === student.cnic)
//     );
//   }, [adminData]);

//   const weekdays = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];

//   const enrollmentData = useMemo(() => {
//     const groupedData = adminData.reduce((acc, item) => {
//       const date = new Date(item.createdAt);
//       const day = weekdays[date.getDay()];
//       if (!acc[day]) {
//         acc[day] = 0;
//       }
//       acc[day] += 1;
//       return acc;
//     }, {});

//     const result = weekdays.map((day) => ({
//       day,
//       enrolled: groupedData[day] || 0,
//     }));

//     return result;
//   }, [adminData]);

//   const tableData = userInfo.flatMap((user) =>
//     user.courses.map((course) => ({
//       fullName: user.fullName,
//       gender: user.gender,
//       trade: course.trade,
//       city: course.city,
//       createdAt: course.createdAt,
//       status: course.status,
//       category: user.category,
//       cnic: user.cnic,
//     }))
//   );

//   useEffect(() => {
//     const fetchData = async () => {
//       await axios
//         .get("http://localhost:5000/users")
//         .then((res) => setUserInfo(res.data));

//       await axios
//         .get("http://localhost:5000/courses")
//         .then((res) => setCourses(res.data));
//       const results = await Promise.all(
//         uniqueData.map((student) =>
//           axios
//             .get(`http://localhost:5000/user/${student.cnic}`)
//             .then((res) => res.data)
//             .catch(() => {
//               return null;
//             })
//         )
//       );

//       setUsersData(results.filter((res) => res !== null));
//     };
//     fetchData();
//   }, [uniqueData]);

//   // Check if user is logged in
//   useEffect(() => {
//     const token = localStorage.getItem("user");
//     const user = localStorage.getItem("id");
//     if (token) {
//       setIsAuthenticated(true);
//       setUser(user);
//     }
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     if (isAuthenticated) {
//       axios
//         .get(`http://localhost:5000/user/${user}`)
//         .then((res) => {
//           setUserData(res.data);
//           setIsAdmin(res.data.isAdmin);
//         })
//         .catch(() => {
//           setUserData({});
//           setIsAdmin(false);
//         });
//       axios.get("http://localhost:5000/admin").then((res) => {
//         setAdminData(res.data);
//       });
//     } else {
//       setUserData({});
//       setIsAdmin(false);
//     }
//   }, [user, isAuthenticated]);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("id");
//     setIsAuthenticated(false);
//     setUser("");
//     setUserData(null);
//     setIsAdmin(null);
//     window.location.href = `/signin/${crypto.randomUUID()}`;
//   };

//   // Protect authenticated routes
//   const PrivateRoute = ({ children }) => {
//     if (loading) {
//       return <div>Loading...</div>;
//     }

//     if (isAdmin === true) {
//       return <Navigate to="/admin" />;
//     }
//     return isAuthenticated && isAdmin === false ? (
//       children
//     ) : (
//       <Navigate to={`/signin/${crypto.randomUUID()}`} />
//     );
//   };
//   // Protect public routes
//   const PublicRoute = ({ children }) => {
//     if (loading) {
//       return <div>Loading...</div>;
//     }
//     return !isAuthenticated ? children : <Navigate to="/" />;
//   };
//   useEffect(() => {
//     if (
//       isAuthenticated &&
//       isAdmin === false &&
//       window.location.pathname.startsWith("/admin")
//     ) {
//       window.location.href = "/";
//     }
//   }, [isAuthenticated, isAdmin]);

//   return (
//     <>
//       <Router>
//         {!loading &&
//           isAuthenticated &&
//           !window.location.pathname.startsWith("/admin") && (
//             <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//           )}
//         <div className="flex h-screen bg-gray-100">
//           {!loading &&
//             isAuthenticated &&
//             isAdmin === false &&
//             !window.location.pathname.startsWith("/admin") && (
//               <Sidebar
//                 open={sidebarOpen}
//                 setOpen={setSidebarOpen}
//                 handleLogout={handleLogout}
//               />
//             )}
//           <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
//             <Routes>
//               {/* Public Routes */}
//               <Route
//                 path="/signin/:id"
//                 element={
//                   <PublicRoute>
//                     <SignIn />
//                   </PublicRoute>
//                 }
//               />
//               <Route
//                 path="/register/:id/new/:id"
//                 element={
//                   <PublicRoute>
//                     <CandidateRegistration />
//                   </PublicRoute>
//                 }
//               />
//               <Route
//                 path="/forgot/:id/password/:id"
//                 element={
//                   <PublicRoute>
//                     <ForgotPassword />
//                   </PublicRoute>
//                 }
//               />
//               <Route
//                 path="/:id/account/:id/verification/:id"
//                 element={
//                   <PublicRoute>
//                     <AccountVerification />
//                   </PublicRoute>
//                 }
//               />
//               <Route
//                 path="/:id/otp/:id/:cnic/verification/:id"
//                 element={
//                   <PublicRoute>
//                     <ResetPasswordOtp />
//                   </PublicRoute>
//                 }
//               />
//               <Route
//                 path="/reset/:id/pa/:id/:cnic/ss/:id"
//                 element={
//                   <PublicRoute>
//                     <ResetPassword />
//                   </PublicRoute>
//                 }
//               />
//               {/* Private Routes */}
//               <Route
//                 path="/"
//                 element={
//                   <PrivateRoute>
//                     <StudentDashboard userData={userData} />
//                   </PrivateRoute>
//                 }
//               />
//               <Route
//                 path="/candidate/profile/register"
//                 element={
//                   <PrivateRoute>
//                     <CandidateProfilePage userData={userData} />
//                   </PrivateRoute>
//                 }
//               />
//               <Route
//                 path="/students/:id"
//                 element={
//                   <PrivateRoute>
//                     <StudentDetail userData={userData} />
//                   </PrivateRoute>
//                 }
//               />
//               <Route
//                 path="/courses"
//                 element={
//                   <PrivateRoute>
//                     <Courses userData={userData} />
//                   </PrivateRoute>
//                 }
//               />
//               <Route
//                 path="/course/:courseId/:city"
//                 element={
//                   <PrivateRoute>
//                     <CourseDetail userData={userData} />
//                   </PrivateRoute>
//                 }
//               />
//               {/* Admin Route */}
//               <Route
//                 path="/admin"
//                 element={
//                   isAdmin === true && (
//                     <AdminDashboard
//                       data={adminData}
//                       usersData={usersData}
//                       uniqueData={uniqueData}
//                       tableData={tableData}
//                       enrollmentData={enrollmentData}
//                       courses={courses}
//                     />
//                   )
//                 }
//               />
//               <Route
//                 path="/admin/Std"
//                 element={
//                   isAdmin === true && (
//                     <Students
//                       data={adminData}
//                       usersData={usersData}
//                       uniqueData={uniqueData}
//                       tableData={tableData}
//                       enrollmentData={enrollmentData}
//                       userInfo={userInfo}
//                       courses={courses}
//                     />
//                   )
//                 }
//               />
//               <Route path="/" element={<TableWithFilters data={mockData} />} />
//               <Route
//                 path="/admin/edit/:cnic/:trade"
//                 element={isAdmin === true && <StudentDetail />}
//               />
//               <Route
//                 path="/admin/reports"
//                 element={isAdmin === true && <Reports />}
//               />
//               <Route
//                 path="/admin/candidates"
//                 element={isAdmin === true && <CandidatesTable />}
//               />
//               <Route
//                 path="/admin/batches"
//                 element={isAdmin === true && <Batches />}
//               />
//               <Route
//                 path="/admin/batches/:batchId"
//                 element={isAdmin === true && <BatchDetails />}
//               />{" "}
//               <Route
//                 path="/admin/batch/:batchId/mark-attendance"
//                 element={isAdmin === true && <MarkAttendance />}
//               />
//               <Route path="*" element={<h1>Not found</h1>} />
//             </Routes>
//           </main>
//         </div>
//       </Router>

//       <ToastContainer />
//     </>
//   );
// }

// export default App;
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminDashboard from "./Admin/page";
import Sidebar from "./Student/Sidebar";
import CandidateProfilePage from "./Student/Candidate";
import SignIn from "./Student/sign-in";
import CandidateRegistration from "./Student/candidate-registration";
import StudentDashboard from "./Student/Dashboard";
import Navbar from "./Student/Navbar";
import StudentDetail from "./Admin/StudentDetail";
import Courses, { CourseDetail } from "./Student/Courses";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AccountVerification from "./Student/AccountVerifcation";
import ForgotPassword from "./Student/ForgotPassword";
import { ResetPasswordOtp, ResetPassword } from "./Student/ResetPassword";
import Students from "./Admin/pages/Students";
import TableWithFilters from "./Admin/TableWithFilters";
import mockData from "./Admin/mockData";
import Reports from "./Admin/pages/Reports";
import CandidatesTable from "./Admin/pages/CandidatesTable";
import Batches from "./Admin/pages/Batches";
import BatchDetails from "./Admin/pages/BatchDetails";
import MarkAttendance from "./Admin/MarkAttendance";
import TitleLayout from "./TitleLayout.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [userData, setUserData] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);

  const uniqueData = useMemo(() => {
    return adminData.filter(
      (student, index, self) =>
        index === self.findIndex((s) => s.cnic === student.cnic)
    );
  }, [adminData]);

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const enrollmentData = useMemo(() => {
    const groupedData = adminData.reduce((acc, item) => {
      const date = new Date(item.createdAt);
      const day = weekdays[date.getDay()];
      if (!acc[day]) {
        acc[day] = 0;
      }
      acc[day] += 1;
      return acc;
    }, {});

    const result = weekdays.map((day) => ({
      day,
      enrolled: groupedData[day] || 0,
    }));

    return result;
  }, [adminData]);

  const tableData = userInfo.flatMap((user) =>
    user.courses.map((course) => ({
      fullName: user.fullName,
      gender: user.gender,
      trade: course.trade,
      city: course.city,
      createdAt: course.createdAt,
      status: course.status,
      category: user.category,
      cnic: user.cnic,
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("http://localhost:5000/users")
        .then((res) => setUserInfo(res.data));

      await axios
        .get("http://localhost:5000/courses")
        .then((res) => setCourses(res.data));
      const results = await Promise.all(
        uniqueData.map((student) =>
          axios
            .get(`http://localhost:5000/user/${student.cnic}`)
            .then((res) => res.data)
            .catch(() => {
              return null;
            })
        )
      );

      setUsersData(results.filter((res) => res !== null));
    };
    fetchData();
  }, [uniqueData]);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("user");
    const user = localStorage.getItem("id");
    if (token) {
      setIsAuthenticated(true);
      setUser(user);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get(`http://localhost:5000/user/${user}`)
        .then((res) => {
          setUserData(res.data);
          setIsAdmin(res.data.isAdmin);
        })
        .catch(() => {
          setUserData({});
          setIsAdmin(false);
        });
      axios.get("http://localhost:5000/admin").then((res) => {
        setAdminData(res.data);
      });
    } else {
      setUserData({});
      setIsAdmin(false);
    }
  }, [user, isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    setIsAuthenticated(false);
    setUser("");
    setUserData(null);
    setIsAdmin(null);
    window.location.href = `/signin/${crypto.randomUUID()}`;
  };

  // Protect authenticated routes
  const PrivateRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (isAdmin === true) {
      return <Navigate to="/admin" />;
    }
    return isAuthenticated && isAdmin === false ? (
      children
    ) : (
      <Navigate to={`/signin/${crypto.randomUUID()}`} />
    );
  };

  // Protect public routes
  const PublicRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return !isAuthenticated ? children : <Navigate to="/" />;
  };

  useEffect(() => {
    if (
      isAuthenticated &&
      isAdmin === false &&
      window.location.pathname.startsWith("/admin")
    ) {
      window.location.href = "/";
    }
  }, [isAuthenticated, isAdmin]);

  return (
    <>
      <Router>
        {!loading &&
          isAuthenticated &&
          !window.location.pathname.startsWith("/admin") && (
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
        <div className="flex h-screen bg-gray-100">
          {!loading &&
            isAuthenticated &&
            isAdmin === false &&
            !window.location.pathname.startsWith("/admin") && (
              <Sidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
                handleLogout={handleLogout}
              />
            )}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <Routes>
              {/* Public Routes */}
              <Route element={<TitleLayout title="Sign In | PSEB" />}>
                <Route
                  path="/signin/:id"
                  element={
                    <PublicRoute>
                      <SignIn />
                    </PublicRoute>
                  }
                />
              </Route>
              <Route
                element={<TitleLayout title="Candidate Registration | PSEB" />}
              >
                <Route
                  path="/register/:id/new/:id"
                  element={
                    <PublicRoute>
                      <CandidateRegistration />
                    </PublicRoute>
                  }
                />
              </Route>
              <Route element={<TitleLayout title="Forgot Password | PSEB" />}>
                <Route
                  path="/forgot/:id/password/:id"
                  element={
                    <PublicRoute>
                      <ForgotPassword />
                    </PublicRoute>
                  }
                />
              </Route>
              <Route
                element={<TitleLayout title="Account Verification | PSEB" />}
              >
                <Route
                  path="/:id/account/:id/verification/:id"
                  element={
                    <PublicRoute>
                      <AccountVerification />
                    </PublicRoute>
                  }
                />
              </Route>
              <Route
                element={<TitleLayout title="Reset Password OTP | PSEB" />}
              >
                <Route
                  path="/:id/otp/:id/:cnic/verification/:id"
                  element={
                    <PublicRoute>
                      <ResetPasswordOtp />
                    </PublicRoute>
                  }
                />
              </Route>
              <Route element={<TitleLayout title="Reset Password | PSEB" />}>
                <Route
                  path="/reset/:id/pa/:id/:cnic/ss/:id"
                  element={
                    <PublicRoute>
                      <ResetPassword />
                    </PublicRoute>
                  }
                />
              </Route>
              {/* Private Routes */}
              <Route element={<TitleLayout title="Student Dashboard | PSEB" />}>
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <StudentDashboard userData={userData} />
                    </PrivateRoute>
                  }
                />
              </Route>
              <Route element={<TitleLayout title="Candidate Profile | PSEB" />}>
                <Route
                  path="/candidate/profile/register"
                  element={
                    <PrivateRoute>
                      <CandidateProfilePage userData={userData} />
                    </PrivateRoute>
                  }
                />
              </Route>
              <Route element={<TitleLayout title="Student Detail | PSEB" />}>
                <Route
                  path="/students/:id"
                  element={
                    <PrivateRoute>
                      <StudentDetail userData={userData} />
                    </PrivateRoute>
                  }
                />
              </Route>
              <Route element={<TitleLayout title="Courses | PSEB" />}>
                <Route
                  path="/courses"
                  element={
                    <PrivateRoute>
                      <Courses userData={userData} />
                    </PrivateRoute>
                  }
                />
              </Route>
              <Route element={<TitleLayout title="Course Detail | PSEB" />}>
                <Route
                  path="/course/:courseId/:city"
                  element={
                    <PrivateRoute>
                      <CourseDetail userData={userData} />
                    </PrivateRoute>
                  }
                />
              </Route>
              {/* Admin Routes */}
              <Route element={<TitleLayout title="Admin Dashboard | PSEB" />}>
                <Route
                  path="/admin"
                  element={
                    isAdmin === true && (
                      <AdminDashboard
                        data={adminData}
                        usersData={usersData}
                        uniqueData={uniqueData}
                        tableData={tableData}
                        enrollmentData={enrollmentData}
                        courses={courses}
                      />
                    )
                  }
                />
              </Route>
              <Route element={<TitleLayout title="Students | PSEB" />}>
                <Route
                  path="/admin/Std"
                  element={
                    isAdmin === true && (
                      <Students
                        data={adminData}
                        usersData={usersData}
                        uniqueData={uniqueData}
                        tableData={tableData}
                        enrollmentData={enrollmentData}
                        userInfo={userInfo}
                        courses={courses}
                      />
                    )
                  }
                />
              </Route>
              <Route path="/" element={<TableWithFilters data={mockData} />} />
              <Route element={<TitleLayout title="Edit Student | PSEB" />}>
                <Route
                  path="/admin/edit/:cnic/:trade"
                  element={isAdmin === true && <StudentDetail />}
                />
              </Route>
              <Route element={<TitleLayout title="Reports | PSEB" />}>
                <Route
                  path="/admin/reports"
                  element={isAdmin === true && <Reports />}
                />
              </Route>
              <Route element={<TitleLayout title="Candidates | PSEB" />}>
                <Route
                  path="/admin/candidates"
                  element={isAdmin === true && <CandidatesTable />}
                />
              </Route>
              <Route element={<TitleLayout title="Batches | PSEB" />}>
                <Route
                  path="/admin/batches"
                  element={isAdmin === true && <Batches />}
                />
              </Route>
              <Route element={<TitleLayout title="Batch Details | PSEB" />}>
                <Route
                  path="/admin/batches/:batchId"
                  element={isAdmin === true && <BatchDetails />}
                />
              </Route>
              <Route element={<TitleLayout title="Mark Attendance | PSEB" />}>
                <Route
                  path="/admin/batch/:batchId/mark-attendance"
                  element={isAdmin === true && <MarkAttendance />}
                />
              </Route>
              <Route path="*" element={<h1>Not found</h1>} />
            </Routes>
          </main>
        </div>
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
