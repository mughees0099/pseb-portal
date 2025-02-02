/* eslint-disable react/prop-types */
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

const course = [
  {
    id: 1,
    title: "AWS Cloud Computing",
    description: "Learn cloud computing with Amazon Web Services",
    status: "Open",
    cities: ["Karachi"],
  },
  {
    id: 2,
    title: "PMP Certification",
    description: "Project Management Professional certification course",
    status: "Open",
    cities: [
      "Quetta",
      "Lahore",
      "Karachi",
      "Peshawar",
      "Islamabad",
      "Rawalpindi",
    ],
  },
  {
    id: 3,
    title: "MERN Stack Development",
    description:
      "Full stack development with MongoDB, Express, React, and Node.js",
    status: "Open",
    cities: ["Quetta"],
  },
  {
    id: 4,
    title: "Mobile App Development",
    description: "Learn mobile app development for iOS and Android",
    status: "Open",
    cities: ["Quetta"],
  },
  {
    id: 5,
    title: "Game Development",
    description: "Create games using modern game development tools",
    status: "Open",
    cities: ["Quetta"],
  },
  {
    id: 6,
    title: "Digital Marketing",
    description: "Master digital marketing strategies and tools",
    status: "Open",
    cities: ["Quetta"],
  },
];

const cities = ["Lahore", "Karachi", "Rawalpindi", "Peshawar", "Islamabad"];

export default function Courses({ userData }) {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("Quetta");
  const [filteredCourses, setFilteredCourses] = useState([]);

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    const filtered = course.filter((course) => course.cities.includes(city));
    setFilteredCourses(filtered);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}/${selectedCity}`);
  };
  useEffect(() => {
    const filtered = course.filter((course) =>
      course.cities.includes("Quetta")
    );
    setFilteredCourses(filtered);
  }, []);
  const isUserDataComplete = () => {
    return (
      userData.fullName &&
      userData.fatherName &&
      userData.gender &&
      userData.cnic &&
      userData.mobile &&
      userData.email &&
      userData.cnicFrontUrl &&
      userData.cnicBackUrl &&
      userData.educationLevel &&
      userData.institute &&
      userData.percentage &&
      userData.isCompleted !== null
    );
  };
  if (!isUserDataComplete()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Complete your profile</h1>
        <p className="text-gray-600 mb-4">
          Please complete your profile before applying for any course.
        </p>
        <button
          onClick={() => navigate("/candidate/profile/register")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Complete Profile
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-3xl font-bold mb-8">Choose Program</h1>
      <p className="text-red-500 mb-4">
        You {"can't"} apply for more than 2 courses
      </p>

      <div className="mb-6 container mx-auto w-1/3">
        <label className="block mb-2">Select City</label>
        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="w-full p-2 border rounded"
        >
          <option value="Quetta">Quetta</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            onClick={() => handleCourseClick(course.id)}
            className="bg-green-300 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex items-center">
              <span className="text-gray-700">Registration: </span>
              <span className="ml-2 text-red-700 font-medium">
                {course.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const courses = [
  {
    id: 1,
    title: "AWS Cloud Computing",
    description: "Learn cloud computing with Amazon Web Services",
    status: "Open",
    cities: ["Lahore", "Karachi", "Peshawar"],
  },
  {
    id: 2,
    title: "PMP Certification",
    description: "Project Management Professional certification course",
    status: "Open",
    cities: ["Lahore", "Quetta"],
  },
  {
    id: 3,
    title: "MERN Stack Development",
    description:
      "Full stack development with MongoDB, Express, React, and Node.js",
    status: "Open",
    cities: ["Karachi", "Rawalpindi"],
  },
  {
    id: 4,
    title: "Mobile Development",
    description: "Learn mobile app development for iOS and Android",
    status: "Open",
    cities: ["Faisalabad", "Hyderabad"],
  },
  {
    id: 5,
    title: "Game Development",
    description: "Create games using modern game development tools",
    status: "Open",
    cities: ["Lahore", "Peshawar"],
  },
  {
    id: 6,
    title: "Digital Marketing",
    description: "Master digital marketing strategies and tools",
    status: "Open",
    cities: ["Karachi", "Quetta"],
  },
];

export function CourseDetail({ userData }) {
  const { courseId, city } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const selectedCourse = courses.find(
      (course) => course.id === parseInt(courseId)
    );
    setCourse(selectedCourse);
  }, [courseId]);

  const handleApplyClick = (courseId) => {
    setLoading(true);
    const selectedCourse = courses.find((course) => course.id === courseId);
    if (!selectedCourse) return;
    const cnic = userData.cnic;
    const trade = selectedCourse.title;
    const program = "PSEB";
    const status = "Pending";
    const category = userData.category;
    axios
      .post(`${import.meta.env.VITE_API_URL}/course`, {
        cnic,
        trade,
        program,
        city,
        status,
        category,
      })
      .then(() => {
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data.message);
      });
  };

  if (!course || !userData) return <div>Loading...</div>;

  return (
    <div className="container mx-auto  px-4 py-8 md:h-screen h-full">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center mb-4">
          <span className="text-gray-700">Registration: </span>
          <span className="ml-2 text-green-500 font-medium">
            {course.status}
          </span>
        </div>
        <button
          onClick={() => handleApplyClick(course.id)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? (
            <Oval height="26" width="26" color="white" ariaLabel="loading" />
          ) : (
            "Apply Now"
          )}
        </button>
      </div>
    </div>
  );
}
