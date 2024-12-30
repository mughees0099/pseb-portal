import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import axios from "axios";

export default function CandidateRegistration() {
  const [formData, setFormData] = useState({
    fullName: "",
    cnic: "",
    email: "",
    mobile: "",
    userName: "",
    password: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { fullName, cnic, email, mobile, userName, password } = formData;
    setIsFormValid(
      fullName &&
        cnic.length === 13 &&
        email &&
        mobile.length === 11 &&
        userName &&
        password.length >= 6
    );
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "cnic" ? { userName: value } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/register`, formData)
      .then(() => {
        setIsLoading(false);
        navigate(
          `/${crypto.randomUUID()}/account/${crypto.randomUUID()}/verification/${crypto.randomUUID()}`,
          { state: { email: formData.email } }
        );
        toast.success(
          "Account created successfully. Please verify your email.",
          { position: "top-right", autoClose: 2000 }
        );
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "An unexpected error occurred",
          { position: "top-right", autoClose: 2000 }
        );
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2">
          Candidate Registration
        </h1>

        <div className="text-sm text-gray-600 text-center mb-8">
          Already have an account?{" "}
          <Link
            to={`/signin/${crypto.randomUUID()}`}
            className="text-purple-600 underline"
          >
            Sign in
          </Link>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs">(As per CNIC)</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                CNIC No. <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs">
                  (13 Characters without any dashes)
                </span>
              </label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleInputChange}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="1234512345671"
                minLength={13}
                maxLength={13}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="john@abc.xyz"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Mobile No <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="03000000000"
                minLength={11}
                maxLength={11}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                User Name <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs">
                  (Your CNIC is your User Name)
                </span>
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                required
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  minLength={6}
                  maxLength={13}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff
                      size={24}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <Eye
                      size={24}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-md transition-colors font-medium flex justify-center ${
              isFormValid
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-200 text-gray-700 cursor-not-allowed hover:bg-gray-600"
            }  ${
              isLoading === true
                ? "bg-gray-400 text-gray-700 hover:bg-gray-600 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }  `}
            disabled={!isFormValid || isLoading == true}
          >
            {isLoading ? (
              <Oval height="26" width="26" color="white" ariaLabel="loading" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
