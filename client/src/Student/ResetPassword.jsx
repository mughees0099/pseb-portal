import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export function ResetPasswordOtp() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [userEmail, setUerEmail] = useState("");
  const { cnic } = useParams();
  const navigate = useNavigate();

  const verifyOtp = async () => {
    setIsLoading(true);
    await axios

      .post(`${import.meta.env.VITE_API_URL}/resetOtp/${cnic}`, { otp })
      .then((res) => {
        setIsLoading(false);
        toast.success(res.data.message || "Password reset successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate(
            `/reset/4d1da864-3bab-433b-aca6-128fd69e0ccf/pa/4d1da864-3bab-433b-aca6-128fd69e0ccf/${cnic}/ss/4d1da864-3bab-433b-aca6-128fd69e0ccf`
          );
        }, 1000);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(
          err?.response?.data?.message || "Password reset successfully!",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      });
  };
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/user/${cnic}`).then((res) => {
      setUerEmail(res.data.email);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2">
          OTP Verification
        </h1>
        <p className="text-sm text-gray-600 text-center mb-4">
          Please enter the OTP sent to your email <br />
          <b>{userEmail.slice(0, 3)}********.com</b>
        </p>
        <div className="space-y-4">
          <form className="" onSubmit={(e) => e.preventDefault()}>
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
                   isLoading === true &&
                   "bg-gray-400 text-gray-700 hover:bg-gray-600 cursor-not-allowed"
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

export function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showcnfrmPassword, setShowcnfrmPassword] = useState(false);
  const { cnic } = useParams();
  const navigate = useNavigate();

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleUpdatePassword = () => {
    if (newPassword === confirmPassword) {
      axios
        .patch(`${import.meta.env.VITE_API_URL}/user/${cnic}`, {
          password: newPassword,
        })
        .then((res) => {
          toast.success(res.data.message || "Password updated successfully!", {
            position: "top-right",
            autoClose: 1000,
          });
          navigate(`/signin/4d1da864-3bab-433b-aca6-128fd69e0ccf`);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message || "Password update failed!",
            {
              position: "top-right",
              autoClose: 2000,
            }
          );
        });
    } else {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your new password and confirm it to update.
        </p>

        <div className="relative mb-3">
          <label
            htmlFor="newPassword"
            className="block text-gray-700 font-medium mb-2"
          >
            New Password
          </label>
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter new password"
            minLength={6}
            maxLength={13}
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          <button
            type="button"
            className="absolute right-3 top-[70%] -translate-y-1/2 text-gray-500"
          >
            {showNewPassword ? (
              <EyeOff
                size={24}
                onClick={() => setShowNewPassword(!showNewPassword)}
              />
            ) : (
              <Eye
                size={24}
                onClick={() => setShowNewPassword(!showNewPassword)}
              />
            )}
          </button>
        </div>

        <div className="relative mb-3">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-medium mb-2"
          >
            Confirm New Password
          </label>
          <input
            type={showcnfrmPassword ? "text" : "password"}
            id="confirmPassword"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Confirm new password"
            minLength={6}
            maxLength={13}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <button
            type="button"
            className="absolute right-3 top-[70%] -translate-y-1/2 text-gray-500"
          >
            {showcnfrmPassword ? (
              <EyeOff
                size={24}
                onClick={() => setShowcnfrmPassword(!showcnfrmPassword)}
              />
            ) : (
              <Eye
                size={24}
                onClick={() => setShowcnfrmPassword(!showcnfrmPassword)}
              />
            )}
          </button>
        </div>

        <button
          onClick={handleUpdatePassword}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
            newPassword.length >= 6 &&
            newPassword.length <= 13 &&
            newPassword.length >= 6 &&
            confirmPassword.length === newPassword.length
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={
            newPassword.length < 6 ||
            newPassword.length > 13 ||
            confirmPassword.length < 6 ||
            confirmPassword.length > 13
          }
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
