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
      .post("http://localhost:5000/signin", { cnic, password })
      .then((res) => {
        localStorage.setItem("id", res.data.cnic);
        localStorage.setItem("user", JSON.stringify(res.data.token));
        setIsLoading(false);
        setTimeout(() => {
          window.location.href = "/";
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
    <div className="flex h-screen  justify-center">
      {/* Left Side - Sign In Form */}
      {/* <div className=" w-full  flex flex-col items-center justify-center p-8 bg-white ">
        <h1 className="text-3xl font-bold mb-2 text-center">Sign in</h1>
        <p className="text-gray-600 mb-8 text-center">
          Already have an account. Please Sign in
          <br />
          اگر آپ کے پاس اکاؤنٹ ہے تو براہ مہربانی سائن ان کریں
        </p>

        <form
          className="w-full max-w-md space-y-4"
          onSubmit={(e) => handleLogin(e)}
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              CNIC No <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
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
            <label className="block text-sm font-medium mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
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
          <div className=" text-center">
            <label>
              Forgot Password?{" "}
              <Link
                to={`/forgot/${crypto.randomUUID()}/password/${crypto.randomUUID()}`}
              >
                <span className="text-purple-500 underline cursor-pointer">
                  Reset Password
                </span>{" "}
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex justify-center"
          >
            {isLoading ? (
              <Oval height={26} width={26} color="white" ariaLabel="loading" />
            ) : (
              "Sign in"
            )}
          </button>
          <div className=" text-center">
            <Link
              to={`/register/${crypto.randomUUID()}/new/${crypto.randomUUID()}`}
            >
              <label>
                {`Don't`} have an account?{" "}
                <span className="text-purple-500 underline cursor-pointer">
                  Register here
                </span>{" "}
              </label>
            </Link>
          </div>
        </form>
      </div> */}
      <div className="w-full flex flex-col items-center justify-center p-8 min-h-screen">
        <h1 className="text-4xl text-green-600 font-extrabold mb-6 animate-fade-in">
          Welcome to PEB Online Registration Portal
        </h1>

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
                  to={`/forgot/${crypto.randomUUID()}/password/${crypto.randomUUID()}`}
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
                to={`/register/${crypto.randomUUID()}/new/${crypto.randomUUID()}`}
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

      {/* Right Side - Welcome Content */}
      {/* <div className="w-1/2 bg-gradient-to-b hidden md:flex from-green-500 via-green-900 to-green-500 text-white p-8  flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <h2 className="text-3xl font-bold mb-4">
            Welcome to PSEB Online Registration Portal
          </h2>

          <p className="text-gray-300 max-w-2xl">
            Our mission is to provide direction, support and an enabling
            environment to the public and private sectors to implement training
            for skills development in order to enhance social and economic
            profile.
          </p>

          <p className="text-gray-300">
            For details and Technical Assistance please call us on Navttc Toll
            Free number 0800-88866 From 8:30AM to 4:30PM (Monday - Friday)
          </p>

          <div className="w-full max-w-3xl space-y-4 mt-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black bg-opacity-50 p-4 rounded-lg flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  📹
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Candidate Registration</h3>
                  <p className="text-sm text-gray-300">
                    نوجوان کے لیے رجسٹریشن کا طریقہ کار
                  </p>
                </div>
              </div>
              <div className="bg-black bg-opacity-50 p-4 rounded-lg flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  📹
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Institute Registration</h3>
                  <p className="text-sm text-gray-300">
                    انسٹی ٹیوٹ رجسٹریشن کا طریقہ کار
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
