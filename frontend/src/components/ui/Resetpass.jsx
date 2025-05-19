import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";
function ResetPasswordForm() {
  const [focusedInput, setFocusedInput] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    mode: 'onChange' // This will trigger validation on change
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const token = window.location.pathname.split("/").at(-1);
    try {
      const response = await axios.post("http://localhost:3002/api/auth/reset-password", {
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
        token,
      });
      console.log("Password reset response:", response.data);
      if (response.data.success) {
        navigate('/login');
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred. Please try again.");
    }
    finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (e) => {
    if (!isValid) {
      e.preventDefault();
      toast.error("Please check your credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-2">
          Reset your Password
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter a new password
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center mb-4">
            <img
              src="/password.png"
              alt="Lock_icon"
              className="h-5 w-5 mr-2"
            />
            <input
              {...register("newPassword", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum length should be 8" },
              })}
              type={showNewPassword ? "text" : "password"}
              placeholder="Password [Min 8 characters]"
              onFocus={() => setFocusedInput("newPassword")}
              onBlur={() => setFocusedInput(null)}
              className={`border-b-2 w-full py-2 outline-none transition-colors text-lg font-semibold  ${focusedInput === "newPassword" ? "border-blue-500" : "border-gray-300"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="ml-2 text-sm text-gray-600 cursor-pointer"
            >
              <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
            </button>
          </div>
          {/* {errors.newPassword && (
            <p className="text-red-500">{errors.newPassword.message}</p>
          )} */}
          <div className="flex items-center mb-4">
            <img
              src="/password.png"
              alt="Lock_icon"
              className="h-5 w-5 mr-2"
            />
            <input
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              onFocus={() => setFocusedInput("confirmPassword")}
              onBlur={() => setFocusedInput(null)}
              className={`border-b-2 w-full py-2 outline-none transition-colors text-lg font-semibold  ${focusedInput === "confirmPassword" ? "border-blue-500" : "border-gray-300"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="ml-2 text-sm text-gray-600 cursor-pointer"
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
            </button>
          </div>
          {/* {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )} */}
          <button
            type="submit"
            onClick={handleButtonClick}
            className={`py-2 px-8 mt-4 font-bold text-white cursor-pointer transform transition-transform duration-200 active:scale-105 mx-auto block rounded-full flex items-center justify-center
             ${isValid ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gray-400'}`}
             style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "CHANGE PASSWORD"
            )}

          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordForm;