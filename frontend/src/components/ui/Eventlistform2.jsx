import React, { useState, useRef, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSwipeable } from "react-swipeable";
import Stepper from "../../pages/add-event/Stepper2";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import GooglePayButton from "@google-pay/button-react";
import { Button } from "./button";

function OtherDetails() {
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const [isGooglePayLoaded, setIsGooglePayLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [venueImage, setVenueImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [formData, setFormData] = useState({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    description: "",
    file: null,
    agree: false,
  });

  const [focusedInput, setFocusedInput] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { venue, formData: venueFormData } = location.state || {};

  console.log(venue, "venue ❤️❤️❤️");

  useEffect(() => {
    const isValid =
      formData.startDate.trim() !== "" &&
      formData.startTime.trim() !== "" &&
      formData.endDate.trim() !== "" &&
      formData.endTime.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.agree &&
      selectedFile !== undefined;

    setIsFormValid(isValid);
  }, [formData, selectedFile]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : "");
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setVenueImage(imageUrl);
    } else {
      setVenueImage(null);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const dataToSend = new FormData();
    dataToSend.append("startDate", formData.startDate);
    dataToSend.append("startTime", formData.startTime);
    dataToSend.append("endDate", formData.endDate);
    dataToSend.append("endTime", formData.endTime);
    dataToSend.append("description", formData.description);
    dataToSend.append("venue", venue._id);
    dataToSend.append("file", selectedFile);
    Object.keys(venueFormData).forEach((key) => {
      dataToSend.append(key, venueFormData[key]);
    });

    try {
      console.log("Data being sent:", Object.fromEntries(dataToSend.entries()));
      const response = await axios.post(
        "http://localhost:3002/api/event/add-event",
        dataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = await response.data;
      console.log(data.message);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: () => {
      formRef.current.scrollBy({ top: 100, behavior: "smooth" });
    },
    onSwipedDown: () => {
      formRef.current.scrollBy({ top: -100, behavior: "smooth" });
    },
  });
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <br></br>
      <Stepper currentStep={3} />
      <div
        ref={formRef}
        className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full mt-4 overflow-y-auto"
        style={{ maxHeight: "500px" }}
        {...handlers}
      >
        <h2 className="text-2xl font-bold mb-6">Other Details</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                name="startDate"
                className={`border w-full py-2 px-3 rounded outline-none transition-colors ${
                  focusedInput === "startDate"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onChange={handleInputChange}
                onFocus={() => setFocusedInput("startDate")}
                onBlur={() => setFocusedInput("")}
              />
              <input
                type="time"
                name="startTime"
                className={`border w-full py-2 px-3 rounded outline-none transition-colors ${
                  focusedInput === "startTime"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onChange={handleInputChange}
                onFocus={() => setFocusedInput("startTime")}
                onBlur={() => setFocusedInput("")}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                name="endDate"
                className={`border w-full py-2 px-3 rounded outline-none transition-colors ${
                  focusedInput === "endDate"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onChange={handleInputChange}
                onFocus={() => setFocusedInput("endDate")}
                onBlur={() => setFocusedInput("")}
              />
              <input
                type="time"
                name="endTime"
                className={`border w-full py-2 px-3 rounded outline-none transition-colors ${
                  focusedInput === "endTime"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onChange={handleInputChange}
                onFocus={() => setFocusedInput("endTime")}
                onBlur={() => setFocusedInput("")}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span> (Minimum 150
              Words)
            </label>
            <textarea
              name="description"
              className={`border w-full py-2 px-3 rounded outline-none transition-colors ${
                focusedInput === "description"
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
              rows="4"
              onChange={handleInputChange}
              onFocus={() => setFocusedInput("description")}
              onBlur={() => setFocusedInput("")}
            ></textarea>
          </div>

          <div className="mb-4 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Photo <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-dashed border-2 p-6 text-center rounded-md bg-gray-50 w-[60%] ${
                focusedInput === "uploadPhoto"
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
              onFocus={() => setFocusedInput("uploadPhoto")}
              onBlur={() => setFocusedInput("")}
              tabIndex={0}
            >
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              <label className="cursor-pointer" onClick={handleBrowseClick}>
                <p>Drag and drop to upload your files</p>
                <button
                  type="button"
                  className="bg-blue-500 text-white py-1 px-3 rounded mt-2"
                >
                  Browse Files
                </button>
              </label>
              {fileName && (
                <p className="mt-2 text-sm text-gray-600">{fileName}</p>
              )}
            </div>
          </div>

          <div className="venueImage mb-4 flex justify-start">
            {venueImage && (
              <img
                src={venueImage}
                alt="Selected Venue"
                className="w-[60%] h-auto object-cover rounded-md"
              />
            )}
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="agree"
                className="mr-2"
                onChange={handleInputChange}
              />
              By signing you agree to your{" "}
              <a href="#" className="text-blue-500 underline ml-1">
                Terms and conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-500 underline ml-1">
                Privacy policy
              </a>
              .
            </label>
          </div>

          {isFormValid && !paymentDone && (
            <GooglePayButton
              environment="TEST"
              buttonType="pay"
              paymentRequest={{
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [
                  {
                    type: "CARD",
                    parameters: {
                      allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                      allowedCardNetworks: ["MASTERCARD", "VISA"],
                    },
                    tokenizationSpecification: {
                      type: "PAYMENT_GATEWAY",
                      parameters: {
                        gateway: "example",
                        gatewayMerchantId: "exampleGatewayMerchantId",
                      },
                    },
                  },
                ],
                merchantInfo: {
                  merchantId: "12345678901234567890",
                  merchantName: "Demo Merchant",
                },
                transactionInfo: {
                  totalPriceStatus: "FINAL",
                  totalPriceLabel: "Total",
                  totalPrice: `${venue.price}`,
                  currencyCode: "INR",
                  countryCode: "IN",
                },
                shippingAddressRequired: true,
                callbackIntents: ["SHIPPING_ADDRESS", "PAYMENT_AUTHORIZATION"],
              }}
              onLoadPaymentData={(paymentRequest) => {
                console.log("Success", paymentRequest);
                setIsGooglePayLoaded(true);
              }}
              onReadyToPayChange={({ isReadyToPay }) => {
                if (isReadyToPay) setIsGooglePayLoaded(true);
              }}
              onPaymentAuthorized={(paymentData) => {
                console.log("Payment Authorised Success", paymentData);
                setPaymentDone(true); // Hide the button after successful payment
                return { transactionState: "SUCCESS" };
              }}
              onPaymentDataChanged={(paymentData) => {
                console.log("On Payment Data Changed", paymentData);
                return {};
              }}
              existingPaymentMethodRequired="false"
              buttonColor="black"
            />
          )}

          {isFormValid && paymentDone && (
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

export default OtherDetails;
