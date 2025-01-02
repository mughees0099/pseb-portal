/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import PopUp from "./PopUp";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { validateFile } from "./utils/fileValidation.js";

export default function ProfileForm({ userData }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [degree, setDegree] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [currentQualification, setCurrentQualification] = useState({
    educationLevel: "",
    institute: "",
    percentage: "",
    isCompleted: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: userData.fullName || "",
    fatherName: userData.fatherName || "",
    gender: userData.gender || "",
    cnicPor: userData.cnic || "",
    mobile: userData.mobile || "",
    email: userData.email || "",
    cnicFrontUrl: "",
    cnicBackUrl: "",
    profileImageUrl: "",
    status: {
      "Government-Employe": false,
      "IT-Professional": false,
      "Fresh-Graduate": false,
    },
    degreeUrl: userData.degreeUrl || "",
    dateOfBirth: userData.dateOfBirth || "",
    address: userData.address || "",
    organization: userData.organization || "",
    designation: userData.designation || "",
  });

  useEffect(() => {
    if (userData.category) {
      const categoryStatus = { ...formData.status };
      categoryStatus[userData.category] = true;
      setFormData({ ...formData, status: categoryStatus });
    }
  }, [userData]);

  const uploadToCloudinary = (file, folder) => {
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    formDataToSend.append("upload_preset", "pseb_personal_data");
    formDataToSend.append("folder", folder);

    return axios.post(import.meta.env.VITE_CLOUDINARY_URL, formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const handleFileUpload = (file, setter, fieldName) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      setter(file);
    }
  };

  const handleAddQualification = () => {
    if (
      currentQualification.educationLevel &&
      currentQualification.institute &&
      currentQualification.percentage
    ) {
      setQualifications([...qualifications, currentQualification]);
      setCurrentQualification({
        educationLevel: "",
        institute: "",
        percentage: "",
        isCompleted: false,
      });
    }
  };

  const isFormComplete = () => {
    const { status, organization, designation } = formData;

    const isOrganizationRequired =
      status["Government-Employe"] || status["IT-Professional"];
    const isOrganizationFilled = organization && designation;
    return (
      formData.fullName &&
      formData.fatherName &&
      formData.gender &&
      formData.cnicPor &&
      formData.mobile &&
      formData.email &&
      formData.dateOfBirth &&
      formData.address &&
      cnicFront &&
      cnicBack &&
      profileImage &&
      qualifications.length > 0 &&
      qualifications[0]?.educationLevel &&
      qualifications[0]?.institute &&
      qualifications[0]?.percentage &&
      qualifications[0]?.isCompleted !== null &&
      degree &&
      (!isOrganizationRequired || isOrganizationFilled)
    );
  };

  const handleConfirmSave = () => {
    setIsPopupOpen(false);
    setIsLoading(true);

    const uploadPromises = [];
    if (cnicFront) uploadPromises.push(uploadToCloudinary(cnicFront, "CNIC"));
    if (cnicBack) uploadPromises.push(uploadToCloudinary(cnicBack, "CNIC"));
    if (profileImage)
      uploadPromises.push(uploadToCloudinary(profileImage, "Profile"));
    if (degree) uploadPromises.push(uploadToCloudinary(degree, "Degree"));
    const cnic = formData.cnicPor;
    const fatherName = formData.fatherName;
    const gender = formData.gender;
    const category = Object.keys(formData.status)
      .filter((key) => formData.status[key])
      .join(", ");
    const educationLevel = qualifications[0].educationLevel;
    const institute = qualifications[0].institute;
    const percentage = qualifications[0].percentage;
    const isCompleted = qualifications[0].isCompleted;

    Promise.all(uploadPromises)
      .then((responses) => {
        const cnicFrontUrl = responses[0]?.data.secure_url;
        const cnicBackUrl = responses[1]?.data.secure_url;
        const profileImageUrl = responses[2]?.data.secure_url;
        const degreeUrl = responses[3]?.data.secure_url;

        return axios.post(`${import.meta.env.VITE_API_URL}/user`, {
          cnic,
          fatherName,
          gender,
          category,
          cnicFrontUrl,
          cnicBackUrl,
          educationLevel,
          institute,
          percentage,
          isCompleted,
          degreeUrl,
          profileImageUrl,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          organization: formData.organization,
          designation: formData.designation,
        });
      })
      .then(() => {
        toast.success("Record saved successfully", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/");
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "An unexpected error occurred",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
        setIsLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormComplete()) {
      setIsPopupOpen(true);
    }
  };

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
      userData.isCompleted !== null &&
      userData.degreeUrl
    );
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6">Candidate Profile</h1>
      {isPopupOpen && (
        <PopUp
          onConfirm={handleConfirmSave}
          onCancel={() => setIsPopupOpen(false)}
          color="text-green-600"
          bgColor="bg-green-100"
          buttonColor="bg-green-600"
          onButtonHover="bg-green-700"
          title="Save Record"
          message="Are you sure you want to save this record? Once submitted, you cannot edit the data."
        />
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Instructions - ہدایات</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Enter your full name as per your CNIC/Passport.</li>
            <li>
              Make sure to provide valid and accessible phone No and email
              address for correspondence.
            </li>
            <li>
              Before filling the form please keep ready a picture of your CNIC
              (200kb Size), your picture (250 kb size), picture of your last
              degree/certificate (200kb size)
            </li>
          </ol>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">
              Basic Information - بنیادی معلومات
              <span className="block text-sm text-gray-500 font-normal">
                Please provide the required details - برائے مہربانی مطلوب
                معلومات درج کریں
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name - مکمل نام
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled
                  required
                />
              </div>

              {/* Father's Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {`Father's`} Name - والد کا نام{" "}
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) =>
                    setFormData({ ...formData, fatherName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={userData.fatherName}
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Gender - جنس
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={userData.gender}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* CNIC/POR No */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  CNIC/POR No - قومی شناختی کارڈ نمبر{" "}
                </label>
                <input
                  type="text"
                  value={formData.cnicPor}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled
                  required
                />
              </div>

              {/* Mobile No */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mobile No - موبائل نمبر{" "}
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email - ای میل
                </label>
                <input
                  type="email"
                  value={formData.email}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Birth - تاریخ پیدائش
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={userData.dateOfBirth}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address - پتہ
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="House No, Street, City"
                  required
                  disabled={userData.address}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Are you? - کیا آپ ہیں؟</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.keys(formData.status).map((key) => (
                <div key={key} className="flex items-center">
                  <input
                    type="radio"
                    id={key}
                    name="status"
                    checked={formData.status[key]}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        status: {
                          "Government-Employe": false,
                          "IT-Professional": false,
                          "Fresh-Graduate": false,
                          [key]: true,
                        },
                      })
                    }
                    className={`mr-2 custom-radio ${
                      formData.status[key] ? "checked-disabled" : ""
                    }`}
                    disabled={userData.category}
                  />
                  <label htmlFor={key} className="text-sm font-medium">
                    {key.replace(/-/g, " ")}
                  </label>
                </div>
              ))}
            </div>
            {(formData.status["IT-Professional"] ||
              formData.status["Government-Employe"]) && (
              <div className="grid grid-cols-1 md:grid-cols-2  gap-6 mt-10">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Organization/Department
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={userData.organization}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Designation/BPS
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={userData.designation}
                    required
                  />
                </div>
              </div>
            )}

            {/*  CNIC Upload */}
            <div className="my-8">
              <h3 className="text-lg font-medium ">Document Upload</h3>
              <p className="text-sm text-gray-500 mb-5">
                Please upload pictures of your <b>National Identity Card </b>{" "}
                and <b>Picture </b>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
                {/* CNIC Front */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <div className="mb-4">
                    <img
                      src={
                        userData.cnicFrontUrl
                          ? userData.cnicFrontUrl
                          : cnicFront
                          ? URL.createObjectURL(cnicFront)
                          : "/cnicFront.png"
                      }
                      alt="CNIC Front"
                      className="mx-auto w-40 h-28 bg-gray-200"
                    />
                  </div>
                  <input
                    type="file"
                    id="cnicFront"
                    onChange={(e) =>
                      handleFileUpload(
                        e.target.files[0],
                        setCnicFront,
                        "CNIC Front"
                      )
                    }
                    className="hidden"
                    required
                  />
                  <label
                    className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                    htmlFor="cnicFront"
                  >
                    {userData.cnicFrontUrl ? "" : "Upload CNIC Front"}
                  </label>
                </div>
                {/* CNIC Back */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <div className="mb-4">
                    <img
                      src={
                        userData.cnicBackUrl
                          ? userData.cnicBackUrl
                          : cnicBack
                          ? URL.createObjectURL(cnicBack)
                          : "/cnicBack.png"
                      }
                      alt="CNIC Back"
                      className="mx-auto w-40 h-28 bg-gray-200"
                    />
                  </div>

                  <input
                    type="file"
                    id="cnicBack"
                    onChange={(e) =>
                      handleFileUpload(
                        e.target.files[0],
                        setCnicBack,
                        "CNIC Back"
                      )
                    }
                    className="hidden"
                    required
                  />

                  <label
                    className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                    htmlFor="cnicBack"
                  >
                    {userData.cnicBackUrl ? "" : "Upload CNIC Back"}
                  </label>
                </div>
                {/* Profile Picture */}
                {!userData.profileImageUrl &&
                  userData.profileImageUrl !== "" && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <div className="mb-4">
                        <img
                          src={
                            userData.profileImageUrl
                              ? userData.profileImageUrl
                              : profileImage
                              ? URL.createObjectURL(profileImage)
                              : "/avatar-placeholder.gif"
                          }
                          alt="Profile Pic"
                          className="mx-auto w-40 h-28 bg-gray-200"
                        />
                      </div>
                      <input
                        type="file"
                        id="profileImage"
                        onChange={(e) =>
                          handleFileUpload(
                            e.target.files[0],
                            setProfileImage,
                            "Profile Image"
                          )
                        }
                        className="hidden"
                        required
                      />

                      <label
                        className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                        htmlFor="profileImage"
                      >
                        {userData.profileImageUrl ? "" : "Upload Your Picture "}
                      </label>
                    </div>
                  )}
              </div>
            </div>
          </div>
          {/* Qualification Details */}
          <div className="">
            <div className="mb-6">
              <h2 className="text-lg font-medium">
                Qualification Details - تعلیمی تفصیلات
              </h2>
              <p className="text-sm text-gray-500">
                Please provide your <b>Highest Qualification </b> details - براہ
                کرم اپنی <b>اعلیٰ ترین اہلیت</b> کی تفصیلات فراہم کریں۔
              </p>
            </div>
            {!isUserDataComplete() && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Qualification - تعلیمی قابلیت{" "}
                    </label>
                    <select
                      value={currentQualification.educationLevel}
                      onChange={(e) =>
                        setCurrentQualification({
                          ...currentQualification,
                          educationLevel: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                      disabled={qualifications.length > 0}
                    >
                      <option value="">Select Qualification</option>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Master">Master</option>
                      <option value="MPhil">MPhil</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Institute Name - ادارے کا نام{" "}
                    </label>
                    <input
                      type="text"
                      value={currentQualification.institute}
                      onChange={(e) =>
                        setCurrentQualification({
                          ...currentQualification,
                          institute: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                      disabled={qualifications.length > 0}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Percentage - فی صد
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={currentQualification.percentage}
                      onChange={(e) =>
                        setCurrentQualification({
                          ...currentQualification,
                          percentage: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                      disabled={qualifications.length > 0}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Completed- مکمل
                    </label>
                    <select
                      value={currentQualification.isCompleted ? "yes" : "no"}
                      onChange={(e) =>
                        setCurrentQualification({
                          ...currentQualification,
                          isCompleted: e.target.value === "yes",
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                      disabled={qualifications.length > 0}
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="mb-4">
                      <img
                        src={
                          userData.degreeUrl
                            ? userData.degreeUrl
                            : degree
                            ? URL.createObjectURL(degree)
                            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0Vi6F0QrCcIMyc76ioQ822-p2yqNPWn_Jcw&s"
                        }
                        alt="Degree"
                        className="mx-auto w-28 h-48 bg-gray-200"
                      />
                    </div>
                    <input
                      type="file"
                      id="degree"
                      onChange={(e) =>
                        handleFileUpload(e.target.files[0], setDegree, "Degree")
                      }
                      className="hidden"
                      required
                    />
                    <label
                      className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                      htmlFor="degree"
                    >
                      {userData.degreeUrl
                        ? ""
                        : "Upload Degree/Certificate/MarkSheet"}
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddQualification}
                  className={`px-6 py-2  text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-2 ${
                    !currentQualification.educationLevel ||
                    !currentQualification.institute ||
                    !currentQualification.percentage ||
                    currentQualification.isCompleted === null ||
                    degree === null
                      ? "bg-gray-500 text-gray-700 cursor-not-allowed hover:bg-gray-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  } ${qualifications.length > 0 ? "hidden" : ""}`}
                >
                  Add Qualification
                </button>
              </>
            )}

            {/* Qualifications from user */}
            {qualifications.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        EDUCATION LEVEL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        INSTITUTE
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PERCENTAGE
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {qualifications.map((qualification, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {qualification.educationLevel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {qualification.institute}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {qualification.percentage}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {qualification.isCompleted ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Qualifications from database */}
            {isUserDataComplete() && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        EDUCATION LEVEL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        INSTITUTE
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PERCENTAGE
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {userData.educationLevel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userData.institute}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userData.percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userData.isCompleted ? "Yes" : "No"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <div className="mb-4">
                    <img
                      src={
                        userData.degreeUrl
                          ? userData.degreeUrl
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0Vi6F0QrCcIMyc76ioQ822-p2yqNPWn_Jcw&s"
                      }
                      alt="Degree"
                      className="mx-auto w-28 h-48 bg-gray-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {!isUserDataComplete() && (
            <div className="flex justify-end">
              <button
                type="submit"
                className={`px-6 py-2  text-white rounded-md  focus:outline-none focus:ring-1  flex justify-center focus:ring-offset-2  ${
                  isFormComplete()
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : " text-gray-700 bg-gray-500 hover:bg-gray-600  cursor-not-allowed "
                } 
                 
                
                 `}
                disabled={!isFormComplete() && qualifications.length > 0}
              >
                {isLoading ? (
                  <Oval
                    height="26"
                    width="26"
                    color="white"
                    ariaLabel="loading"
                  />
                ) : (
                  "Save Record"
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
