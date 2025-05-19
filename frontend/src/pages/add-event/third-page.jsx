import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  CalendarIcon, 
  ImageIcon, 
  ClockIcon, 
  TicketIcon, 
  CheckCircleIcon, 
  ArrowLeftIcon,
  AlertCircleIcon 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import GooglePaymentButton from "../../components/ui/google-payment-button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ThirdPage = ({ formData, setFormData, handlePageChange }) => {
  const [formValid, setFormValid] = useState(false);
  const [image, setImage] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isValid =
      formData.startDate.trim() !== "" &&
      formData.startTime.trim() !== "" &&
      formData.endDate.trim() !== "" &&
      formData.endTime.trim() !== "" &&
      formData.agree &&
      formData.file &&
      formData.ticketPrice.trim() !== 0;

    setFormValid(isValid);
  }, [formData, paymentDone]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, file });
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    } else {
      setImage(null);
    }
  };

  const checkForOverlappingEvents = async () => {
    try {
      const existingEvents = await Promise.all(
        formData.venue.bookings.map(async (eventId) => {
          const response = await axios.get(
            `http://localhost:3002/api/event/get-event-by-id/${eventId}`
          );
          return response.data;
        })
      );

      const newEventStart = new Date(
        `${formData.startDate}T${formData.startTime}`
      );
      const newEventEnd = new Date(`${formData.endDate}T${formData.endTime}`);

      for (const event of existingEvents) {
        const existingEventStart = new Date(event.start);
        const existingEventEnd = new Date(event.end);

        if (
          (newEventStart >= existingEventStart &&
            newEventStart < existingEventEnd) ||
          (newEventEnd > existingEventStart &&
            newEventEnd <= existingEventEnd) ||
          (newEventStart <= existingEventStart &&
            newEventEnd >= existingEventEnd)
        ) {
          toast.error(
            "Another event already exists at this time. Check Prior Booking",
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Error checking for overlapping events:", error);
      toast.error("Error checking for overlapping events.");
      return false;
    }
  };

  const handleCheckAvailability = async (e) => {
    e.preventDefault();
    setCheckingAvailability(true);
    
    setTimeout(async () => {
      const noOverlap = await checkForOverlappingEvents();
      setCheckingAvailability(false);
      
      if (noOverlap) {
        setAvailabilityChecked(true);
        toast.success("Great news! The venue is available for your selected time.", {
          position: "top-center",
          icon: "🎉",
        });
      } else {
        setAvailabilityChecked(false);
      }
    }, 1000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === "venue") formDataToSend.append(key, formData[key]._id);
      else formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        "http://localhost:3002/api/event/add-event",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = await response.data;
      toast.success(data.message, {
        position: "top-center",
        icon: "🎊"
      });
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-4xl mx-auto border shadow-lg rounded-xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            Event Schedule
          </CardTitle>
          <CardDescription className="text-blue-100 mt-1">
            Set your event timeline and add visuals to attract attendees
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 pt-8">
          <form className="space-y-8" onSubmit={handleFormSubmit}>
            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
                <div className="h-1 w-12 bg-blue-600"></div>
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
                <div className="h-1 w-12 bg-blue-600"></div>
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</div>
              </div>
            </div>

            {/* Event Schedule Section */}
            <div className="bg-blue-50 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Event Timeline</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <Label className="font-medium text-gray-700 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-blue-500" />
                      Start Date
                    </Label>
                    <Input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="h-10 mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <Label className="font-medium text-gray-700 flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-blue-500" />
                      Start Time
                    </Label>
                    <Input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="h-10 mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <Label className="font-medium text-gray-700 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-blue-500" />
                      End Date
                    </Label>
                    <Input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="h-10 mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <Label className="font-medium text-gray-700 flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-blue-500" />
                      End Time
                    </Label>
                    <Input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="h-10 mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Price Input */}
            <div className="bg-purple-50 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <TicketIcon className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">Ticket Information</h3>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Label className="font-medium text-gray-700 flex items-center gap-2">
                  <TicketIcon className="h-4 w-4 text-purple-500" />
                  Ticket Price ($)
                </Label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <Input
                    type="number"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleInputChange}
                    className="h-10 pl-8 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-green-50 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Event Visual</h3>
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <Label className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                  <ImageIcon className="h-4 w-4 text-green-500" />
                  Upload Event Banner Image
                </Label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors cursor-pointer">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {!image ? (
                      <div className="py-6">
                        <ImageIcon className="h-10 w-10 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    ) : (
                      <div className="py-1">
                        <img
                          src={image}
                          alt="Selected Event Banner"
                          className="mx-auto max-h-48 object-contain rounded-md"
                        />
                        <p className="mt-2 text-xs text-gray-500">Click to change image</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Terms and Agreement */}
            <div className="bg-gray-50 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircleIcon className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Agreement</h3>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={handleInputChange}
                  />
                  <span>
                    By signing you agree to your{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-800 underline font-medium">
                      Terms and conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-800 underline font-medium">
                      Privacy policy
                    </a>
                    .
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {formValid && !availabilityChecked && (
                <Button
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={checkingAvailability}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-lg shadow-md flex items-center justify-center gap-2"
                >
                  {checkingAvailability ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      Checking Availability...
                    </>
                  ) : (
                    <>
                      <AlertCircleIcon className="h-5 w-5" />
                      Check Venue Availability
                    </>
                  )}
                </Button>
              )}

              {formValid && availabilityChecked && !paymentDone && (
                <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    Venue Available! Proceed to Payment
                  </h3>
                  <div className="py-2">
                    <GooglePaymentButton
                      price={formData.venue.price}
                      setPaymentDone={setPaymentDone}
                    />
                  </div>
                </div>
              )}

              {formValid && paymentDone && (
                <Button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-medium rounded-lg shadow-md flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      Finalizing Your Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5" />
                      Confirm & Complete Booking
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>

        <CardFooter className="bg-gray-50 px-6 py-4 border-t">
          <Button
            className="flex items-center gap-2 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 shadow-sm"
            type="button"
            onClick={() => handlePageChange(2)}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Venue Selection
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ThirdPage;