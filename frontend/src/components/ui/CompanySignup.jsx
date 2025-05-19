import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CompanySignup() {
  const [focusedInput, setFocusedInput] = useState(null);
  const [accountType, setAccountType] = useState('company');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm({
    mode: 'onChange' // This will trigger validation on change
  });
  const navigate = useNavigate();

  async function onSubmit(data) {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3002/api/auth/sendotp', {
        email: data.repEmail,
      });
      console.log('Response:', response.data);
      navigate("/otpverify-company", {
        state: {
          name: data.companyName,
          Rname: data.repName,
          email: data.repEmail,
          Rno: data.companyRegNo,
          password: data.password,
          accountType: 'company'
        }
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handletypechange = (type) => {
    setAccountType(type);
    if (type === 'user') {
      navigate('/register');
    }
  }

  const handleButtonClick = (e) => {
    if (!isValid) {
      e.preventDefault();
      toast.error("Please check your credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
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
              Join us today to secure the ideal tender for your needs!
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
                  Company Name
                </label>
                <input
                  {...register('companyName', { required: true })}
                  type="text"
                  placeholder="Company Name"
                  onFocus={() => setFocusedInput('companyName')}
                  onBlur={() => setFocusedInput(null)}
                  className={`border w-full py-2 px-3 rounded outline-none transition-colors ${focusedInput === 'companyName' ? 'border-blue-500' : 'border-gray-300'
                    }`}
                />
              </div>
              <div className="mb-4 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Representative Name
                </label>
                <input
                  {...register('repName', { required: true })}
                  type="text"
                  placeholder="Representative Name"
                  onFocus={() => setFocusedInput('repName')}
                  onBlur={() => setFocusedInput(null)}
                  className={`border w-full py-2 px-3 rounded outline-none transition-colors ${focusedInput === 'repName' ? 'border-blue-500' : 'border-gray-300'
                    }`}
                />
              </div>
              <div className="mb-4 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Representative Email
                </label>
                <input
                  {...register('repEmail', { required: true })}
                  type="email"
                  placeholder="Representative Email"
                  onFocus={() => setFocusedInput('repEmail')}
                  onBlur={() => setFocusedInput(null)}
                  className={`border w-full py-2 px-3 rounded outline-none transition-colors ${focusedInput === 'repEmail' ? 'border-blue-500' : 'border-gray-300'
                    }`}
                />
              </div>
              <div className="mb-4 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Reg.No
                </label>
                <input
                  {...register('companyRegNo', { required: true })}
                  type="text"
                  placeholder="Company Reg.No"
                  onFocus={() => setFocusedInput('companyRegNo')}
                  onBlur={() => setFocusedInput(null)}
                  className={`border w-full py-2 px-3 rounded outline-none transition-colors ${focusedInput === 'companyRegNo' ? 'border-blue-500' : 'border-gray-300'
                    }`}
                />
              </div>
              <div className="mb-4 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div
                  className={`flex items-center border w-full py-2 px-3 rounded transition-colors ${focusedInput === 'password' ? 'border-blue-500' : 'border-gray-300'
                    }`}
                >
                  <input
                    {...register('password', { required: true, minLength: 8 })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password [Min 8 characters]"
                    onFocus={() => setFocusedInput('password')}
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
              </div>
              <div className="mb-4 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div
                  className={`flex items-center border w-full py-2 px-3 rounded transition-colors ${focusedInput === 'confirmPassword' ? 'border-blue-500' : 'border-gray-300'
                    }`}
                >
                  <input
                    {...register('confirmPassword', {
                      required: true, minLength: 8,
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    onFocus={() => setFocusedInput('confirmPassword')}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-2 text-sm text-gray-600 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                  </button>
                </div>
              </div>
            
              <button
                type="submit"
                onClick={handleButtonClick}
                className={`py-2 px-8 mt-4 font-bold text-white cursor-pointer transform transition-transform duration-200 active:scale-105 mx-auto block rounded-full flex items-center justify-center ${isValid ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gray-400'
                  }`}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanySignup;