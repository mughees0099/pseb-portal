import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import axios from "axios";

export default function AccountVerification() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const email = location.state?.email || "";

  const verifyOtp = () => {
    setIsLoading(true);
    axios
      .post(`http://localhost:4000/verify-otp/${email}`, { otp })
      .then(() => {
        setIsLoading(false);
        toast.success("Account verified successfully!", {
          position: "top-right",
          autoClose: 2000,
        });

        navigate(`/signin/${crypto.randomUUID()}`);
      })

      .catch((err) => {
        setTimeout(() => {
          setIsLoading(false);
          setOtp("");
        }, 1500);

        toast.error(
          err.response?.data?.message || "Invalid OTP. Please try again.",
          { position: "top-right", autoClose: 1000 }
        );
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2">
          Account Verification
        </h1>
        <p className="text-sm text-gray-600 text-center mb-4">
          Please enter the OTP sent to your email: <strong>{email}</strong>
        </p>
        <div className="space-y-4">
          <form className="">
            <div>
              <label className="block text-sm font-medium mb-1">OTP</label>
              <input
                type="text"
                value={otp}
                minLength={6}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 mb-4"
                placeholder="Enter OTP"
                required
              />
            </div>
            <button
              type="button"
              onClick={verifyOtp}
              className={`w-full py-3 px-4 rounded-md text-white flex justify-center
                 ${
                   isLoading === true
                     ? "bg-gray-400 text-gray-700 hover:bg-gray-600 cursor-not-allowed"
                     : "bg-green-500 text-white hover:bg-green-600"
                 }  
                ${
                  otp.length > 5
                    ? "bg-green-500  hover:bg-green-600 cursor-pointer"
                    : " bg-gray-500  hover:bg-gray-600 cursor-not-allowed"
                }
                `}
              disabled={otp.length <= 5}
            >
              {isLoading ? (
                <Oval
                  height="26"
                  width="26"
                  color="white"
                  ariaLabel="loading"
                />
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
