import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@/context/userContext";
import NavSidebar from "@/components/ui/HomeNavbarandSidebar";

function SignupForm() {
  const navigate = useNavigate();
  const [focusedInput, setFocusedInput] = useState(null);
  const [accountType, setAccountType] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const { login } = useUser();

  const name = watch("name");
  const email = watch("email");
  const pass = watch("pass");
  const confpass = watch("confpass");

  const isFormValid =
    name?.length >= 3 &&
    email &&
    pass?.length >= 8 &&
    confpass === pass;

  async function onSubmit(data) {
    setLoading(true);
    console.log("Submitting the form", data);
    try {
      const response = await axios.post(
        "http://localhost:3002/api/auth/sendotp",
        {
          email: data.email,
        }
      );
      console.log("OTP Request Response:", response.data);
      console.log("accountType in signupform ", accountType);
      if (response.data.success) {
        navigate("/otpverify", {
          state: {
            name: data.name,
            email: data.email,
            password: data.pass,
            accountType,
          },
        });
      } else {
        toast.error("Check your email");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const responseGoogle = async (authResult) => {
    try {
      console.log(authResult);
      if (authResult.code) {
        const result = await axios.post(
          "http://localhost:3002/api/auth/googleLogin",
          {
            code: authResult.code,
            accountType: "user",
          }
        );
        const user = result.data.user;
        const token = result.data.token;
        login(user, token)
      }
    } catch (err) {
      console.error("Error while requesting code", err);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  const handletypechange = (type) => {
    setAccountType(type);
    if (type === "company") {
      navigate("/companyregister");
    }
  };

  const handleFormSubmit = (e) => {
    if (!isFormValid) {
      e.preventDefault();
      toast.error("Please check your credentials");
    }
  };

  return (
    <div>
      <NavSidebar/>
    <div className="flex justify-center items-center min-h-screen bg-gray-100 mt-15">
      <div className="flex bg-white rounded-lg shadow-lg max-w-screen-xl w-full mx-4">
      <div className="w-1/2 relative">
        <img
          src="loginpage5.jpg"
          alt="Event Management"
          className="w-full h-full object-cover"
        />
        </div>
        <div className="w-1/2 flex justify-center items-center p-8">
          <div className="max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-blue-500 mb-2">
              SAVE YOUR ACCOUNT NOW
            </h2>
            <span className="block text-gray-500 text-sm mb-6">
              Sign up today to start planning your perfect event!
            </span>
            <div className="mb-6">
              <button
                className={`mr-8 py-2 px-8 rounded-full text-sm font-bold cursor-pointer ${accountType === "user"
                    ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                    : "text-gray-700"
                  }`}
                onClick={() => handletypechange("user")}
              >
                USER ACCOUNT
              </button>
              <button
                className={`py-2 px-8 rounded-full text-sm font-bold cursor-pointer ${accountType === "company"
                    ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                    : "text-gray-700"
                  }`}
                onClick={() => handletypechange("company")}
              >
                COMPANY ACCOUNT
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  {...register("name", {
                    required: true,
                    maxLength: 20,
                    minLength: { value: 3, message: "Minimum length should be 3" },
                  })}
                  type="text"
                  placeholder="Name"
                  onFocus={() => setFocusedInput("name")}
                  onBlur={() => setFocusedInput(null)}
                  className={`border w-full py-2 px-3 rounded outline-none transition-colors ${focusedInput === "name" ? "border-blue-500" : "border-gray-300"
                    }`}
                />
              </div>
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
              <div className="mb-4 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="Email"
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                  className={`border w-full py-2 px-3 rounded outline-none transition-colors ${focusedInput === "email" ? "border-blue-500" : "border-gray-300"
                    }`}
                />
              </div>
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              <div className="mb-4 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div
                  className={`flex items-center border w-full py-2 px-3 rounded transition-colors ${focusedInput === "password" ? "border-blue-500" : "border-gray-300"
                    }`}
                >
                  <input
                    {...register("pass", {
                      required: true,
                      maxLength: 20,
                      minLength: { value: 8 },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password [Min 8 characters]"
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-sm text-gray-600 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
              {errors.pass && <p className="text-red-500">{errors.pass.message}</p>}
              <div className="mb-4 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div
                  className={`flex items-center border w-full py-2 px-3 rounded transition-colors ${focusedInput === "confirmPassword" ? "border-blue-500" : "border-gray-300"
                    }`}
                >
                  <input
                    {...register("confpass", {
                      required: true,
                      maxLength: 20,
                      minLength: { value: 8 },
                      validate: (value) =>
                        value === watch("pass") || "Passwords do not match",
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    onFocus={() => setFocusedInput("confirmPassword")}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-2 text-sm text-gray-600 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                onClick={handleFormSubmit}
                className={`${isFormValid ? "bg-gradient-to-r from-blue-400 to-blue-600" : "bg-gray-400"
                  } py-2 px-8 mt-4 font-bold text-white cursor-pointer transform transition-transform duration-200 active:scale-105 mx-auto block rounded-full flex items-center justify-center`}
                style={{ width: '100%' }} // Set width to 100% to match input fields
              >
                {loading ? (
                  <>
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                    Signing Up
                  </>
                ) : (
                  "SIGNUP"
                )}
              </button>
            </form>
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <Button variant="link" className="p-0 ml-1">
                <Link to="/login" className="text-blue-500 text-lg font-medium">
                  Log in
                </Link>
              </Button>
            </p>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-2 text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <button
              className="flex items-center justify-center border border-blue-500 text-blue-500 py-2 px-4 w-full cursor-pointer rounded-full"
              onClick={googleLogin}
            >
              <img src="/google.png" alt="Google_icon" className="h-5 w-5 mr-2" />
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default SignupForm;