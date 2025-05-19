import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";

function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const { name, email, password, accountType } = location.state || {};

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleChange = (value, index) => {
    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input box
      if (value !== "" && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const otpCode = otp.join("");
    console.log("OTP Submitted:", otpCode);
    console.log(accountType, "accountType");
    
    try {
      const response = await axios.post(
        "http://localhost:3002/api/auth/signup",
        {
          email,
          otp: otpCode,
          name,
          password,
          accountType,
        }
      );

      console.log("Verification Response:", response.data);

      if (response.data.success) {
        navigate("/login");
      } else {
        toast.error('Invalid OTP');
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      console.log("email", email)
      const response = await axios.post(
        "http://localhost:3002/api/auth/resendotp",
        { email }
      );
      console.log("Resend OTP Response:", response.data);
      toast.success("OTP has been resent.");
      setTimer(300); // Reset timer to 5 minutes
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="flex bg-white rounded-lg shadow-lg max-w-4xl w-full h-full">
        <div className="w-1/2 p-16">
          <img
            src="/otpverify.png"
            alt="Event"
            className="w-full h-full rounded-lg"
          />
        </div>
        <div className="w-1/2 p-16 border-l border-blue-200 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-center">
            OTP Verification
          </h2>
          <p className="mb-8 text-center">
            Enter OTP Code sent to{" "}
            {email ? email : "your email"}
          </p>
          <form onSubmit={handleSubmit} className="text-center">
            <div className="flex justify-center mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  className="w-16 h-16 text-center border border-gray-300 rounded mx-2 text-2xl bg-gray-100 focus:border-pink-500"
                />
              ))}
            </div>
            <p className="text-sm mb-8">
              Didn't receive OTP code?{" "}
              {timer > 0 ? (
                <span className="text-blue-500">{formatTime(timer)}</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-blue-500"
                >
                  Resend OTP
                </button>
              )}
            </p>
            <button
              type="submit"
              className={`${isOtpComplete ? "bg-gradient-to-r from-blue-400 to-blue-600" : "bg-gray-400"
                } py-2 px-8 mt-4 font-bold text-white cursor-pointer transform transition-transform duration-200 active:scale-105 mx-auto block rounded-full flex items-center justify-center`}
              disabled={!isOtpComplete}
              style={{ width: '100%' }}
            >
              {loading ? (
                <>
                  <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  Verifying
                </>
              ) : (
                "VERIFY AND PROCEED"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;