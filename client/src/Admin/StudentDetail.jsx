"use client";

import { useState, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowBigLeftDash, Download, Save } from "lucide-react";
import { Oval } from "react-loader-spinner";

export default function StudentDetail() {
  const [studentData, setStudentData] = useState({
    fullName: "",
    fatherName: "",
    gender: "",
    cnic: "",
    mobile: "",
    email: "",
    dateOfBirth: "",
    address: "",
    category: "",
    educationLevel: "",
    institute: "",
    percentage: "",
    isCompleted: false,
    organization: "",
    designation: "",
  });

  const [studentTrade, setStudentTrade] = useState([]);
  const [ProfilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);
  const [cnicFront, setCnicFront] = useState("");
  const [cnicBack, setCnicBack] = useState("");
  const [degree, setDegree] = useState("");
  const { cnic, trade } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/user/${cnic}`).then((res) => {
      setStudentData(res.data);
      setProfilePic(res.data.profileImageUrl);
      setCnicFront(res.data.cnicFrontUrl);
      setCnicBack(res.data.cnicBackUrl);
      setDegree(res.data.degreeUrl);
    });

    axios.get(`${import.meta.env.VITE_API_URL}/course/${cnic}`).then((res) => {
      setStudentTrade(res.data);
    });
  }, [cnic]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePic(previewUrl);
    }
  };

  const handleCnicFrontChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCnicFront(previewUrl);
    }
  };

  const handleCnicBackChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCnicBack(previewUrl);
    }
  };

  const handleDegreeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setDegree(previewUrl);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "status") {
      setStudentTrade((prev) =>
        prev.map((t) => (t.trade === trade ? { ...t, status: value } : t))
      );
    } else if (name === "isCompleted") {
      setStudentData((prev) => ({
        ...prev,
        isCompleted: value,
      }));
    } else {
      setStudentData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const uploadToCloudinary = async (blobUrl, folder) => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      const file = new File([blob], "upload.jpg", { type: blob.type });

      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("upload_preset", "pseb_personal_data");
      formDataToSend.append("folder", folder);

      const cloudinaryResponse = await axios.post(
        import.meta.env.VITE_CLOUDINARY_URL,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return cloudinaryResponse.data;
    } catch (err) {
      console.error(
        "Cloudinary upload error:",
        err.response?.data || err.message
      );
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fullName = e.target.fullName.value;
    const fatherName = e.target.fatherName.value;
    const gender = e.target.gender.value;
    const cnic = e.target.cnic.value;
    const mobile = e.target.mobile.value;
    const email = e.target.email.value;
    const category = e.target.category.value;
    const status =
      studentTrade.find((t) => t.trade === trade)?.status || "Pending";
    const educationLevel = e.target.educationLevel.value;
    const institute = e.target.institute.value;
    const percentage = e.target.percentage.value;
    const isCompleted = studentData.isCompleted;
    const dateOfBirth = e.target.dateOfBirth.value;
    const address = e.target.address.value;

    const promises = [];

    if (ProfilePic.startsWith("blob")) {
      promises.push(
        uploadToCloudinary(ProfilePic, "Profile").then((res) => {
          setProfilePic(res.secure_url);
          return { field: "profileImageUrl", url: res.secure_url };
        })
      );
    }
    if (cnicFront.startsWith("blob")) {
      promises.push(
        uploadToCloudinary(cnicFront, "CNIC").then((res) => {
          setCnicFront(res.secure_url);
          return { field: "cnicFrontUrl", url: res.secure_url };
        })
      );
    }
    if (cnicBack.startsWith("blob")) {
      promises.push(
        uploadToCloudinary(cnicBack, "CNIC").then((res) => {
          setCnicBack(res.secure_url);
          return { field: "cnicBackUrl", url: res.secure_url };
        })
      );
    }
    if (degree.startsWith("blob")) {
      promises.push(
        uploadToCloudinary(degree, "Degree").then((res) => {
          setDegree(res.secure_url);
          return { field: "degreeUrl", url: res.secure_url };
        })
      );
    }

    // Wait for all uploads to finish
    const uploadedData = await Promise.all(promises);

    // Update studentData with secure URLs
    const updatedData = { ...studentData };
    uploadedData.forEach(({ field, url }) => {
      updatedData[field] = url;
    });

    setStudentData(updatedData);

    await axios
      .patch(`${import.meta.env.VITE_API_URL}/user/${cnic}/${trade}`, {
        ...updatedData,
        fullName,
        fatherName,
        gender,
        cnic,
        mobile,
        email,
        category,
        status,
        educationLevel,
        institute,
        percentage,
        isCompleted,
        dateOfBirth,
        address,
      })
      .then(() => {
        toast.success("Profile updated successfully,", {
          position: "top-right",
          autoClose: 1000,
        });
        setLoading(false);
        navigate(-1);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
      });
  };

  // const generatePDF = useCallback(() => {
  //   const doc = new jsPDF();
  //   const lineHeight = 5;
  //   let yPos = 20;

  //   // Add Profile Image and Name
  //   doc.setFontSize(22);
  //   doc.setTextColor(0, 102, 204); // Set heading color
  //   doc.text("User Profile", 105, yPos, { align: "center" });
  //   yPos += lineHeight * 2;

  //   if (ProfilePic) {
  //     doc.addImage(ProfilePic, "JPEG", 80, yPos, 50, 50); // Reduced size of profile image
  //     yPos += 40;
  //   }

  //   doc.setFontSize(16);
  //   doc.setTextColor(0, 0, 0);

  //   const drawHeading = (text) => {
  //     doc.setFontSize(14);
  //     doc.setTextColor(0, 102, 204);
  //     doc.text(text, 20, yPos);
  //     yPos += lineHeight;
  //     doc.setFontSize(12);
  //     doc.setTextColor(0, 0, 0);
  //   };

  //   const addTable = (headers, data) => {
  //     const tableX = 20;
  //     const colWidths = [50, 130];
  //     const rowHeight = 10;
  //     let currentY = yPos;

  //     // Draw table headers
  //     doc.setFillColor(200, 200, 200);
  //     doc.rect(tableX, currentY, colWidths[0], rowHeight, "F");
  //     doc.rect(tableX + colWidths[0], currentY, colWidths[1], rowHeight, "F");
  //     doc.setTextColor(0, 0, 0);
  //     doc.text(headers[0], tableX + 5, currentY + 7);
  //     doc.text(headers[1], tableX + colWidths[0] + 5, currentY + 7);
  //     currentY += rowHeight;

  //     // Draw table rows
  //     data.forEach((row) => {
  //       const lines = doc.splitTextToSize(row[1], colWidths[1] - 10);
  //       const cellHeight = Math.max(rowHeight, lines.length * 7);

  //       doc.rect(tableX, currentY, colWidths[0], cellHeight);
  //       doc.rect(tableX + colWidths[0], currentY, colWidths[1], cellHeight);
  //       doc.text(row[0], tableX + 5, currentY + 7);
  //       doc.text(lines, tableX + colWidths[0] + 5, currentY + 7);
  //       currentY += cellHeight;
  //     });

  //     yPos = currentY + 10; // Update yPos for next section
  //   };
  //   const age = studentData.dateOfBirth
  //     ? new Date().getFullYear() -
  //       new Date(studentData.dateOfBirth).getFullYear()
  //     : "N/A";

  //   drawHeading("Personal Details");
  //   addTable(
  //     ["Field", "Value"],
  //     [
  //       ["Full Name", studentData.fullName || "N/A"],
  //       ["Father's Name", studentData.fatherName || "N/A"],
  //       ["Gender", studentData.gender || "N/A"],
  //       ["CNIC No", studentData.cnic || "N/A"],
  //       ["Mobile No", studentData.mobile || "N/A"],
  //       ["Email", studentData.email || "N/A"],

  //       ["Category", studentData.category || "N/A"],
  //       studentData.category === "Government-Employe" ||
  //         (studentData.category === "IT-Professional" && [
  //           "Organization",
  //           studentData.organization || "N/A",
  //         ]),
  //       studentData.category === "Government-Employe" ||
  //         (studentData.category === "IT-Professional" && [
  //           "Designation",
  //           studentData.designation || "N/A",
  //         ]),
  //       ["Trade", trade || "N/A"],
  //       [
  //         "Application Status",
  //         studentTrade.find((t) => t.trade === trade)?.status || "Pending",
  //       ],
  //       ["Age", age || "N/A"],
  //       ["Address", studentData.address || "N/A"],
  //     ]
  //   );

  //   // Check if we need to add a new page
  //   if (yPos > 250) {
  //     doc.addPage();
  //     yPos = 20;
  //   }

  //   drawHeading("Education Details");
  //   addTable(
  //     ["Field", "Value"],
  //     [
  //       ["Level", studentData.educationLevel || "N/A"],
  //       ["Institute", studentData.institute || "N/A"],
  //       ["Percentage", studentData.percentage || "N/A"],
  //       ["Completed", studentData.isCompleted ? "Yes" : "No"],
  //     ]
  //   );

  //   // Start a new page for each document image
  //   const addImagePage = (image, label) => {
  //     if (image) {
  //       doc.addPage();
  //       doc.setFontSize(16);
  //       doc.setTextColor(0, 102, 204);
  //       doc.text(label, 105, 20, { align: "center" });
  //       doc.addImage(image, "JPEG", 15, 40, 180, 160);
  //     }
  //   };

  //   addImagePage(cnicFront, "CNIC Front");
  //   addImagePage(cnicBack, "CNIC Back");
  //   addImagePage(degree, "Degree");

  //   // Save the PDF
  //   doc.save("user_profile.pdf");
  // }, [
  //   studentData,
  //   studentTrade,
  //   trade,
  //   ProfilePic,
  //   cnicFront,
  //   cnicBack,
  //   degree,
  // ]);

  const generatePDF = useCallback(() => {
    const doc = new jsPDF();
    const lineHeight = 5;
    let yPos = 20;

    // Add Profile Image and Name
    doc.setFontSize(22);
    doc.setTextColor(0, 102, 204); // Set heading color
    doc.text("User Profile", 105, yPos, { align: "center" });
    yPos += lineHeight * 2;

    if (ProfilePic) {
      doc.addImage(ProfilePic, "JPEG", 80, yPos, 50, 50); // Adjust size as needed
      yPos += 50;
    }

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);

    const drawHeading = (text) => {
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text(text, 20, yPos);
      yPos += lineHeight;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
    };

    const addTable = (headers, data) => {
      const tableX = 20;
      const colWidths = [50, 130];
      const rowHeight = 10;
      let currentY = yPos;

      // Draw table headers
      doc.setFillColor(200, 200, 200);
      doc.rect(tableX, currentY, colWidths[0], rowHeight, "F");
      doc.rect(tableX + colWidths[0], currentY, colWidths[1], rowHeight, "F");
      doc.setTextColor(0, 0, 0);
      doc.text(headers[0], tableX + 5, currentY + 7);
      doc.text(headers[1], tableX + colWidths[0] + 5, currentY + 7);
      currentY += rowHeight;

      // Draw table rows
      data.forEach((row) => {
        if (row) {
          const lines = doc.splitTextToSize(row[1] || "N/A", colWidths[1] - 10);
          const cellHeight = Math.max(rowHeight, lines.length * 7);

          doc.rect(tableX, currentY, colWidths[0], cellHeight);
          doc.rect(tableX + colWidths[0], currentY, colWidths[1], cellHeight);
          doc.text(row[0] || "N/A", tableX + 5, currentY + 7);
          doc.text(lines, tableX + colWidths[0] + 5, currentY + 7);
          currentY += cellHeight;
        }
      });

      yPos = currentY + 10; // Update yPos for next section
    };

    const age = studentData.dateOfBirth
      ? new Date().getFullYear() -
        new Date(studentData.dateOfBirth).getFullYear()
      : "N/A";

    drawHeading("Personal Details");

    const personalDetails = [
      ["Full Name", studentData.fullName || "N/A"],
      ["Father's Name", studentData.fatherName || "N/A"],
      ["Gender", studentData.gender || "N/A"],
      ["CNIC No", studentData.cnic || "N/A"],
      ["Mobile No", studentData.mobile || "N/A"],
      ["Email", studentData.email || "N/A"],
      ["Category", studentData.category || "N/A"],
    ];

    // Conditionally add Organization and Designation
    if (
      studentData.category === "Government-Employe" ||
      studentData.category === "IT-Professional"
    ) {
      personalDetails.push(
        ["Organization", studentData.organization || "N/A"],
        ["Designation", studentData.designation || "N/A"]
      );
    }

    personalDetails.push(
      ["Trade", trade || "N/A"],
      [
        "Application Status",
        studentTrade.find((t) => t.trade === trade)?.status || "Pending",
      ],
      ["Age", age || "N/A"],
      ["Address", studentData.address || "N/A"]
    );

    addTable(["Field", "Value"], personalDetails);

    // Check if we need to add a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    drawHeading("Education Details");
    addTable(
      ["Field", "Value"],
      [
        ["Level", studentData.educationLevel || "N/A"],
        ["Institute", studentData.institute || "N/A"],
        ["Percentage", studentData.percentage || "N/A"],
        ["Completed", studentData.isCompleted ? "Yes" : "No"],
      ]
    );

    // Add document images
    const addImagePage = (image, label) => {
      if (image) {
        doc.addPage();
        doc.setFontSize(16);
        doc.setTextColor(0, 102, 204);
        doc.text(label, 105, 20, { align: "center" });
        doc.addImage(image, "JPEG", 15, 40, 180, 160);
      }
    };

    addImagePage(cnicFront, "CNIC Front");
    addImagePage(cnicBack, "CNIC Back");
    addImagePage(degree, "Degree");

    // Save the PDF
    doc.save("user_profile.pdf");
  }, [
    studentData,
    studentTrade,
    trade,
    ProfilePic,
    cnicFront,
    cnicBack,
    degree,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-6 border-b flex justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Student Profile
              </h1>
              <p className="text-sm text-gray-500">
                Manage Student profile information
              </p>
            </div>
            <button
              type="button"
              onClick={generatePDF}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 ml-4 flex items-center gap-3"
            >
              <Download />
              Save to PDF
            </button>
          </div>

          <div className="p-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <img
                  src={ProfilePic}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <input
                    id="profile-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                  />
                </label>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={studentData.fullName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {"Father's Name"}
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={studentData.fatherName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={studentData.gender}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNIC No
                </label>
                <input
                  type="text"
                  name="cnic"
                  value={studentData.cnic}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile No
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={studentData.mobile}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={studentData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={studentData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={studentData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={studentData.category || ""}
                  onChange={(e) =>
                    setStudentData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select a category</option>
                  <option value="Government-Employe">
                    Government Employee
                  </option>
                  <option value="IT-Professional">IT Professional</option>
                  <option value="Fresh-Graduate">Fresh Graduate</option>
                </select>
              </div>
              {(studentData.category === "Government-Employe" ||
                studentData.category === "IT-Professional") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={studentData.organization || ""}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={studentData.designation || ""}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              )}

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Status
                </label>
                <select
                  name="status"
                  value={
                    studentTrade.find((t) => t.trade === trade)?.status ||
                    "Pending"
                  }
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-opacity-75"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Qualification Details */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Qualification Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education Level
                  </label>
                  <select
                    name="educationLevel"
                    value={studentData.educationLevel}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="MPhil">MPhil</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institute Name
                  </label>
                  <input
                    type="text"
                    name="institute"
                    value={studentData.institute}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Percentage
                  </label>

                  <input
                    type="text"
                    maxLength={2}
                    name="percentage"
                    value={studentData.percentage}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completed
                  </label>
                  <select
                    name="isCompleted"
                    value={studentData.isCompleted ? "Yes" : "No"}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNIC Front
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center max-h-40 min-h-40">
                      <img src={cnicFront} className=" max-h-36 min-h-36" />

                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="cnic-front"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="cnic-front"
                            name="cnic-front"
                            type="file"
                            className="sr-only"
                            onChange={handleCnicFrontChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNIC Back
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center max-h-40 min-h-40">
                      <img src={cnicBack} className=" max-h-36 min-h-36" />

                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="cnic-back"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="cnic-back"
                            name="cnic-back"
                            type="file"
                            className="sr-only"
                            onChange={handleCnicBackChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center max-h-40 min-h-40">
                      <img src={degree} className=" max-h-36 min-h-36" />

                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="degree"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="degree"
                            name="degree"
                            type="file"
                            className="sr-only"
                            onChange={handleDegreeChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-3"
                onClick={() => navigate(-1)}
              >
                <ArrowBigLeftDash />
                Go Back
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 "
              >
                {loading ? (
                  <Oval
                    height={20}
                    width={20}
                    color="white"
                    ariaLabel="loading"
                  />
                ) : (
                  <p className="flex items-center gap-3">
                    <Save />
                    Save Changes
                  </p>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
