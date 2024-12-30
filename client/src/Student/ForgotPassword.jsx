import axios from "axios";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

export default function ForgotPassword() {
  const [cnic, setCnic] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleCnicChange = (e) => {
    setCnic(e.target.value);
  };
  function handleForgotPassword() {
    setIsLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/forgot-password`, { cnic })
      .then(() => {
        toast.success("OTP sent to email.", {
          position: "top-right",
          autoClose: 2000,
        });

        setIsLoading(false);
        setTimeout(() => {
          navigate(
            `/${crypto.randomUUID()}/otp/${crypto.randomUUID()}/${cnic}/verification/${crypto.randomUUID()}`
          );
        }, 1000);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(
          err.response.data?.message || "An error occurred. Please try again.",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your CNIC number to receive a password reset email.
        </p>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label
              htmlFor="cnic"
              className="block text-gray-700 font-medium mb-2"
            >
              CNIC Number (13 digits)
            </label>
            <input
              type="text"
              id="cnic"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your CNIC number"
              maxLength={13}
              minLength={13}
              value={cnic}
              onChange={handleCnicChange}
            />
          </div>

          <button
            className={`w-full py-2 px-4 rounded-md text-white font-semibold flex justify-center ${
              isLoading === true &&
              "bg-gray-400 text-gray-700 hover:bg-gray-600 cursor-not-allowed"
            }   ${
              cnic.length >= 13
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 text-gray-700 hover:bg-gray-600 cursor-not-allowed"
            }`}
            disabled={cnic.length < 13}
            onClick={handleForgotPassword}
          >
            {isLoading ? (
              <Oval height="26" width="26" color="white" ariaLabel="loading" />
            ) : (
              "  Send Email"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
