/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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

import Reports from "./Admin/pages/Reports";
import CandidatesTable from "./Admin/pages/CandidatesTable";
import Batches from "./Admin/pages/Batches";
import BatchDetails from "./Admin/pages/BatchDetails";
import MarkAttendance from "./Admin/MarkAttendance";
import TitleLayout from "./TitleLayout.jsx";
import { Oval } from "react-loader-spinner";
import Footer from "./Student/Footer.jsx";
import NotFound from "./NotFound.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [user, setUser] = useState("");
  const [userData, setUserData] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();

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
    try {
      setDataLoading(true);
      setLoading(true);
      const fetchData = async () => {
        await axios
          .get(`${import.meta.env.VITE_API_URL}/users`)
          .then((res) => setUserInfo(res.data));

        await axios
          .get(`${import.meta.env.VITE_API_URL}/courses`)
          .then((res) => setCourses(res.data));
        const results = await Promise.all(
          uniqueData.map((student) =>
            axios
              .get(`${import.meta.env.VITE_API_URL}/user/${student.cnic}`)
              .then((res) => res.data)
              .catch(() => {
                return null;
              })
          )
        );

        setUsersData(results.filter((res) => res !== null));
      };

      fetchData();
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setDataLoading(false);
      setLoading(false);
    }
  }, [uniqueData]);

  // Check if user is logged in
  useEffect(() => {
    try {
      setDataLoading(true);
      setLoading(true);
      const token = localStorage.getItem("user");
      const user = localStorage.getItem("id");
      if (token) {
        setIsAuthenticated(true);
        setUser(user);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setDataLoading(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      setDataLoading(true);
      setLoading(true);
      if (isAuthenticated) {
        axios
          .get(`${import.meta.env.VITE_API_URL}/user/${user}`)
          .then((res) => {
            setUserData(res.data);
            setIsAdmin(res.data.isAdmin);
          })
          .catch(() => {
            setUserData({});
            setIsAdmin(false);
          });
        axios.get(`${import.meta.env.VITE_API_URL}/admin`).then((res) => {
          setAdminData(res.data);
        });
      } else {
        setUserData({});
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setDataLoading(false);
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    setIsAuthenticated(false);
    setUser("");
    setUserData(null);
    setIsAdmin(null);
    navigate("/");
  };

  // Protect authenticated routes
  const PrivateRoute = ({ children }) => {
    if (loading || dataLoading) {
      return <div>Loading...</div>;
    }

    if (isAdmin === true) {
      return <Navigate to="/admin" />;
    }
    return isAuthenticated && isAdmin === false ? (
      children
    ) : (
      <Navigate to={`/signin/4d1da864-3bab-433b-aca6-128fd69e0ccf`} />
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
    setDataLoading(true);
    setLoading(true);
    if (
      isAuthenticated &&
      isAdmin === false &&
      window.location.pathname.startsWith("/admin")
    ) {
      navigate("/");
    }
    setDataLoading(false);
    setLoading(false);
  }, [isAuthenticated, isAdmin]);
  if (dataLoading && loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Oval color="#00FF00" height={100} width={100} />;
      </div>
    );
  }

  return (
    <div>
      {!loading &&
        isAuthenticated &&
        !window.location.pathname.startsWith("/admin") && (
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}
      <div className="flex h-full bg-gray-100 ">
        {!loading &&
          isAuthenticated &&
          isAdmin === false &&
          !window.document.title.startsWith("Not Found") &&
          !window.location.pathname.startsWith("/admin") && (
            <Sidebar
              open={sidebarOpen}
              setOpen={setSidebarOpen}
              handleLogout={handleLogout}
            />
          )}
        {/* one */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto bg-gray-100">
          <Routes>
            {/* Public Routes */}
            <Route element={<TitleLayout title="Sign In " />}>
              <Route
                path="/signin/:id"
                element={
                  <PublicRoute>
                    <SignIn />
                  </PublicRoute>
                }
              />
            </Route>
            <Route element={<TitleLayout title="Candidate Registration " />}>
              <Route
                path="/register/:id/new/:id"
                element={
                  <PublicRoute>
                    <CandidateRegistration />
                  </PublicRoute>
                }
              />
            </Route>
            <Route element={<TitleLayout title="Forgot Password " />}>
              <Route
                path="/forgot/:id/password/:id"
                element={
                  <PublicRoute>
                    <ForgotPassword />
                  </PublicRoute>
                }
              />
            </Route>
            <Route element={<TitleLayout title="Account Verification " />}>
              <Route
                path="/:id/account/:id/verification/:id"
                element={
                  <PublicRoute>
                    <AccountVerification />
                  </PublicRoute>
                }
              />
            </Route>
            <Route element={<TitleLayout title="Reset Password OTP " />}>
              <Route
                path="/:id/otp/:id/:cnic/verification/:id"
                element={
                  <PublicRoute>
                    <ResetPasswordOtp />
                  </PublicRoute>
                }
              />
            </Route>
            <Route element={<TitleLayout title="Reset Password " />}>
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
            <Route element={<TitleLayout title="Student Dashboard " />}>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <StudentDashboard userData={userData} />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route element={<TitleLayout title="Candidate Profile " />}>
              <Route
                path="/candidate/profile/register"
                element={
                  <PrivateRoute>
                    <CandidateProfilePage userData={userData} />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route element={<TitleLayout title="Student Detail " />}>
              <Route
                path="/students/:id"
                element={
                  <PrivateRoute>
                    <StudentDetail userData={userData} />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route element={<TitleLayout title="Courses " />}>
              <Route
                path="/courses"
                element={
                  <PrivateRoute>
                    <Courses userData={userData} />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route element={<TitleLayout title="Course Detail " />}>
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
            <Route element={<TitleLayout title="Admin Dashboard " />}>
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
            <Route element={<TitleLayout title="Students " />}>
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
            <Route path="/" element={<TableWithFilters />} />
            <Route element={<TitleLayout title="Edit Student " />}>
              <Route
                path="/admin/edit/:cnic/:trade"
                element={isAdmin === true && <StudentDetail />}
              />
            </Route>
            <Route element={<TitleLayout title="Reports " />}>
              <Route
                path="/admin/reports"
                element={isAdmin === true && <Reports />}
              />
            </Route>
            <Route element={<TitleLayout title="Candidates " />}>
              <Route
                path="/admin/candidates"
                element={isAdmin === true && <CandidatesTable />}
              />
            </Route>
            <Route element={<TitleLayout title="Batches " />}>
              <Route
                path="/admin/batches"
                element={isAdmin === true && <Batches />}
              />
            </Route>
            <Route element={<TitleLayout title="Batch Details " />}>
              <Route
                path="/admin/batches/:batchId"
                element={isAdmin === true && <BatchDetails />}
              />
            </Route>
            <Route element={<TitleLayout title="Mark Attendance " />}>
              <Route
                path="/admin/batch/:batchId/mark-attendance"
                element={isAdmin === true && <MarkAttendance />}
              />
            </Route>
            <Route element={<TitleLayout title="Not Found " />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          {!loading &&
            isAuthenticated &&
            isAdmin === false &&
            !window.document.title.startsWith("Not Found") &&
            !window.location.pathname.startsWith("/admin") && (
              <Footer
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            )}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
