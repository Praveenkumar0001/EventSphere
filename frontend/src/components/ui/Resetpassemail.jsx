import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";

function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [focusedInput, setFocusedInput] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange' // This will trigger validation on change
  });

  const onSubmit = async (data) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post("http://localhost:3002/api/auth/reset-password-token", {
        email: data.email,
      });
      console.log("Password reset response:", response.data);
      setMessage("Password reset email sent successfully!");
      if (response.data.success) {
        navigate('/emailsentsuccess');
      } else {
        toast.error("Check your Email");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
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
        <img
          src="resetpassemail.jpg" // Replace with your image link
          alt="Illustration"
          className="mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-center mb-2">
          Forgot your Password?
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your Email and we'll help you reset your password
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center mb-4">
            <img
              src="/email.png" // Replace with your icon link
              alt="Email_icon"
              className="h-5 w-5 mr-2"
            />
            <input
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="Email"
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
              className={`border-b-2 w-full py-2 outline-none transition-colors text-lg font-semibold  ${focusedInput === "email" ? "border-blue-500" : "border-gray-300"
                }`}
            />
          </div>
          {/* {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )} */}
          {message && (
            <p className="text-center text-green-500 mb-4">{message}</p>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              onClick={handleButtonClick}
              className={`py-2 px-8 mt-4 font-bold text-white cursor-pointer transform transition-transform duration-200 active:scale-105 mx-auto block rounded-full flex items-center justify-center 
                ${isValid ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gray-400'} text-white`}
              style={{ width: '100%' }}
            >
              {loading ? (
                <>
                  <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "CONTINUE"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;