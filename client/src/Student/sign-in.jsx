import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    const cnic = e.target[0].value;
    const password = e.target[1].value;
    axios
      .post(`${import.meta.env.VITE_API_URL}/signin`, { cnic, password })
      .then((res) => {
        localStorage.setItem("id", res.data.cnic);
        localStorage.setItem("user", JSON.stringify(res.data.token));
        setIsLoading(false);
        setTimeout(() => {
          window.location.href = "/candidate/profile/register";
        }, 1500);

        toast.success("Logged in successfully", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(
          err.response?.data?.message || "An unexpected error occurred",
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      });
  }
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Right Side - Welcome Content */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-green-500 via-green-900 to-green-500 text-white p-8 flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <h2 className="text-3xl font-bold mb-4">
            Welcome to PSEB Online Registration Portal
          </h2>

          <p className="text-gray-300 max-w-2xl">
            Selection of Participants for IT Trainings: Applications are invited
            from students, IT professionals, and public sector ICT departments.
          </p>

          <div className="text-gray-300 text-left">
            <h3 className="text-lg font-semibold">Eligibility Criteria:</h3>
            <ul className="list-disc list-inside">
              <li>
                <strong>IT Graduates:</strong> CNIC, max age 28, relevant
                qualifications, and pass IT test.
              </li>
              <li>
                <strong>IT Professionals:</strong> CNIC, max age 50, employer
                pays 10% fee, first-come basis.
              </li>
              <li>
                <strong>Public Sector:</strong> CNIC, employer recommendation,
                free training, max age 50.
              </li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">PMP Course:</h3>
            <ul className="list-disc list-inside">
              <li>40 IT professionals, 10 public sector professionals.</li>
              <li>
                Requirements: 5 years experience, 35 hours formal education,
                7,500 hours leading projects.
              </li>
              <li>
                IT professionals pay 50% fee; public sector free, first-come
                basis.
              </li>
              <li>Max age: 55 years.</li>
            </ul>
          </div>
          <p className="text-gray-300 max-w-2xl pt-8  font-bold">
            For any issue, contact us via WhatsApp or call us at 03186413893.
          </p>
        </div>
      </div>

      {/* Left Side - Sign In Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 min-h-screen">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-green-600">
            Sign in
          </h2>
          <p className="text-gray-700 mb-6 text-center leading-relaxed">
            Already have an account? Please sign in.
            <br />
            اگر آپ کے پاس اکاؤنٹ ہے تو براہ مہربانی سائن ان کریں
          </p>

          <form className="space-y-6" onSubmit={(e) => handleLogin(e)}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CNIC No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="1234512345671"
                minLength={13}
                maxLength={13}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  minLength={6}
                  maxLength={13}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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

            <div className="text-center">
              <label>
                Forgot Password?{" "}
                <Link
                  to={`/forgot/4d1da864-3bab-433b-aca6-128fd69e0ccf/password/4d1da864-3bab-433b-aca6-128fd69e0ccf`}
                >
                  <span className="text-purple-500 underline hover:text-purple-700 cursor-pointer">
                    Reset Password
                  </span>
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all flex justify-center items-center"
            >
              {isLoading ? (
                <Oval
                  height={20}
                  width={20}
                  color="white"
                  ariaLabel="loading"
                />
              ) : (
                "Sign in"
              )}
            </button>

            <div className="text-center">
              <Link
                to={`/register/4d1da864-3bab-433b-aca6-128fd69e0ccf/new/4d1da864-3bab-433b-aca6-128fd69e0ccf`}
              >
                <label>
                  Don&#39;t have an account?{" "}
                  <span className="text-purple-500 underline hover:text-purple-700 cursor-pointer">
                    Register here
                  </span>
                </label>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
