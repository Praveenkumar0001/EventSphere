import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@/context/userContext";
import NavSidebar from "@/components/ui/HomeNavbarandSidebar";
import { useGoogleLogin } from "@react-oauth/google";
function LoginForm() {
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const email = watch("email");
  const password = watch("password");
  const navigate = useNavigate();
  const { login, isLoggedIn } = useUser();
  const isFormValid = email && password.length >= 8;

  useEffect(() => {
    console.log(isLoggedIn, 'isLoggedIn');
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  async function onSubmit(data) {
    if (!isFormValid) {
      toast.error("Please check your credentials");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3002/api/auth/login",
        data,
        { withCredentials: true }
      );

      const responseData = response.data;
      console.log(responseData, 'login response');
      login(responseData.user, responseData.token);
      return responseData;
    } catch (error) {
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
        console.log("nvoksnvoksdvnoas",result, 'google login result');
        if (result.data.success) {
        const user = result.data.user;
        const token = result.data.token;
        login(user, token)
      }
    } 
  }
  catch (err) {
      console.error("Error while requesting code", err);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 mt-10">
    <NavSidebar />
    <div className="flex bg-white rounded-lg shadow-lg max-w-screen-xl w-full mx-4 overflow-hidden" style={{ height: '600px' }}>
      <div className="w-1/1.5 relative">
        <img
          src="loginpage5.jpg"
          alt="Event Management"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 h-full w-8 bg-white">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 C50,100 50,0 100,100 L100,0 L0,0 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center p-8">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#4f1c55' }}>
            WELCOME BACK
          </h2>
          <span className="block text-gray-500 text-sm mb-6">
            Log in to continue planning your perfect event!
          </span>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                })}
                type="email"
                placeholder="Email"
                autoComplete="email"
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                className={`border w-full py-2 px-3 rounded outline-none transition-colors ${
                  focusedInput === "email"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div
                className={`flex items-center border w-full py-2 px-3 rounded transition-colors ${
                  focusedInput === "password"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password [Min 8 characters]"
                  autoComplete="current-password"
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-sm text-gray-600 cursor-pointer"
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="text-right mb-4">
              <Button variant="link">
                <Link to="/update-passwordemail" className="text-blue-500">
                  Forget Password?
                </Link>
              </Button>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`py-2 px-8 mt-4 font-bold text-white cursor-pointer transform transition-transform duration-200 active:scale-105 mx-auto block rounded-full flex items-center justify-center ${
                isFormValid
                  ? "bg-gradient-to-r from-blue-400 to-blue-600"
                  : "bg-gray-400"
              }`}
              style={{ width: "100%" }}
            >
              {loading ? (
                <>
                  <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  Logging In
                </>
              ) : (
                "LOGIN"
              )}
            </button>
          </form>
          <p className="mt-4 text-center">
            Don’t have an account?{" "}
            <Button variant="link" className="p-0 ml-1">
              <Link
                to="/register"
                className="text-blue-500 text-lg font-medium" 
              >
                Sign up
              </Link>
            </Button>
          </p>
          <button
              className="flex items-center justify-center border border-blue-500 text-blue-500 py-2 px-4 w-full cursor-pointer rounded-full"
              onClick={googleLogin}
            >
              <img src="/google.png" alt="Google_icon" className="h-5 w-5 mr-2" />
              Continue with Google
            </button>
        </div>
      </div>
    </div>
  </div>
  );
}

export default LoginForm;
