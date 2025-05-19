import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { 
  FileTextIcon, 
  MapPinIcon, 
  PhoneIcon, 
  TagIcon, 
  AlertCircle, 
  CheckCircle2, 
  CalendarIcon,
  ArrowRightIcon,
} from "lucide-react";
import { motion } from "framer-motion";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const formFieldAnimation = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const stateCityMap = {
  "Andhra Pradesh": ["Vijayawada", "Visakhapatnam"],
  "Arunachal Pradesh": ["Itanagar", "Tawang"],
  Assam: ["Guwahati", "Dibrugarh"],
  Bihar: ["Patna", "Gaya"],
  Chhattisgarh: ["Raipur", "Bhilai"],
  Goa: ["Panaji", "Vasco da Gama"],
  Gujarat: ["Ahmedabad", "Surat"],
  Haryana: ["Gurgaon", "Faridabad"],
};

const genreOptions = [
  "Cultural Fest",
  "Musical Concerts",
  "Comedy Shows",
  "Sports",
  "Science Fair",
];

// Icons for genres to make the form more visual
const genreIcons = {
  "Cultural Fest": "🎭",
  "Musical Concerts": "🎵",
  "Comedy Shows": "😂",
  "Sports": "⚽",
  "Science Fair": "🔬"
};

const FirstPage = ({ formData, setFormData, handlePageChange }) => {
  const [valid, setValid] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [touched, setTouched] = useState({});
  const [formProgress, setFormProgress] = useState(0);
  const [showStateEffect, setShowStateEffect] = useState(false);

  // Handle field validation
  const errors = {
    title: formData.title.trim() === "" && touched.title ? "Event title is required" : "",
    description: formData.description.trim().length < 10 && touched.description ? "Please provide a more detailed description (at least 10 characters)" : "",
    genre: formData.genre === "" && touched.genre ? "Please select a genre" : "",
    contactNo: touched.contactNo ? validatePhone(formData.contactNo) : "",
    state: formData.state === "" && touched.state ? "Please select a state" : "",
    city: formData.state !== "" && formData.city === "" && touched.city ? "Please select a city" : ""
  };

  function validatePhone(phone) {
    if (!phone) return "Contact number is required";
    if (!/^\d{10}$/.test(phone)) return "Please enter a valid 10-digit number";
    return "";
  }

  useEffect(() => {
    if (!formData) return;
    
    // Check if all fields are valid
    const isValid =
      formData.title.trim() !== "" &&
      formData.description.trim().length >= 10 &&
      formData.genre.trim() !== "" &&
      formData.contactNo.trim() !== "" &&
      /^\d{10}$/.test(formData.contactNo) &&
      formData.state !== "" &&
      formData.city !== "";
    
    setValid(isValid);

    // Calculate progress percentage for progress bar
    let filledFields = 0;
    if (formData.title.trim() !== "") filledFields++;
    if (formData.description.trim() !== "") filledFields++;
    if (formData.genre.trim() !== "") filledFields++;
    if (formData.contactNo.trim() !== "") filledFields++;
    if (formData.state !== "") filledFields++;
    if (formData.city !== "") filledFields++;
    
    setFormProgress(Math.round((filledFields / 6) * 100));
  }, [formData]);

  useEffect(() => {
    if (formData.state && stateCityMap[formData.state]) {
      setAvailableCities(stateCityMap[formData.state]);
      setShowStateEffect(true);
      setTimeout(() => setShowStateEffect(false), 1000);
    } else {
      setAvailableCities([]);
    }
  }, [formData.state]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="w-full"
    >
      <Card className="w-full max-w-4xl mx-auto border shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-2xl font-bold">
            Create Your Event
          </CardTitle>
          <CardDescription className="text-blue-100">
            Let's make your event memorable! Start by filling in the basic details.
          </CardDescription>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2 w-full bg-blue-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${formProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-xs text-right mt-1 text-blue-100">
              {formProgress}% completed
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Event Title */}
              <motion.div 
                className="md:col-span-2"
                variants={formFieldAnimation}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileTextIcon className="h-4 w-4 text-blue-500" />
                  <Label className="font-medium text-base">Event Title</Label>
                </div>
                <div className="relative">
                  <Input
                    name="title"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`h-11 transition-all duration-200 border ${
                      errors.title ? "border-red-400 bg-red-50" : touched.title ? "border-green-400 bg-green-50" : ""
                    }`}
                  />
                  {touched.title && !errors.title && (
                    <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                  )}
                  {errors.title && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{errors.title}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div 
                className="md:col-span-2"
                variants={formFieldAnimation}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileTextIcon className="h-4 w-4 text-blue-500" />
                  <Label className="font-medium text-base">
                    Event Description
                  </Label>
                </div>
                <div className="relative">
                  <Textarea
                    name="description"
                    placeholder="Provide a detailed description of your event"
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`min-h-[120px] resize-y transition-all duration-200 ${
                      errors.description ? "border-red-400 bg-red-50" : touched.description ? "border-green-400 bg-green-50" : ""
                    }`}
                  />
                  {touched.description && !errors.description && (
                    <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                  )}
                  {errors.description && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{errors.description}</span>
                    </div>
                  )}
                  {formData.description && !errors.description && (
                    <div className="mt-1 text-sm text-gray-500">
                      Character count: {formData.description.length}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Genre */}
              <motion.div 
                className="col-span-1 md:col-span-1"
                variants={formFieldAnimation}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TagIcon className="h-4 text-blue-500" />
                  <Label className="font-medium text-base">Genre</Label>
                </div>
                <div className="relative">
                  <Select
                    name="genre"
                    value={formData.genre}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, genre: value }));
                      setTouched((prev) => ({ ...prev, genre: true }));
                    }}
                  >
                    <SelectTrigger className={`h-11 w-full transition-all duration-200 ${
                      errors.genre ? "border-red-400 bg-red-50" : touched.genre ? "border-green-400 bg-green-50" : ""
                    }`}>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genreOptions.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          <span className="flex items-center">
                            <span className="mr-2">{genreIcons[genre]}</span>
                            {genre}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {touched.genre && !errors.genre && (
                    <CheckCircle2 className="absolute right-8 top-3 h-5 w-5 text-green-500" />
                  )}
                  {errors.genre && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{errors.genre}</span>
                    </div>
                  )}
                </div>
                {formData.genre && (
                  <div className="mt-3 text-center">
                    <span className="text-3xl">{genreIcons[formData.genre]}</span>
                  </div>
                )}
              </motion.div>

              {/* Contact Number */}
              <motion.div 
                className="col-span-1 md:col-span-1"
                variants={formFieldAnimation}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <PhoneIcon className="h-4 w-4 text-blue-500" />
                  <Label className="font-medium text-base">Contact Number</Label>
                </div>
                <div className="relative">
                  <Input
                    name="contactNo"
                    placeholder="10-digit phone number"
                    type="tel"
                    maxLength={10}
                    value={formData.contactNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`h-11 w-full transition-all duration-200 ${
                      errors.contactNo ? "border-red-400 bg-red-50" : touched.contactNo && formData.contactNo ? "border-green-400 bg-green-50" : ""
                    }`}
                  />
                  {touched.contactNo && !errors.contactNo && formData.contactNo && (
                    <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                  )}
                  {errors.contactNo && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{errors.contactNo}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Location Section */}
              <motion.div 
                className="md:col-span-2"
                variants={formFieldAnimation}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <MapPinIcon className="h-5 w-5 text-blue-500" />
                  <h3 className="text-base font-semibold">Event Location</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* State */}
                  <div className="col-span-1 md:col-span-1">
                    <Label className="font-medium">State</Label>
                    <div className="relative">
                      <Select
                        name="state"
                        value={formData.state}
                        onValueChange={(value) => {
                          setFormData((prev) => ({
                            ...prev,
                            state: value,
                            city: "",
                          }));
                          setTouched((prev) => ({ ...prev, state: true }));
                        }}
                      >
                        <SelectTrigger className={`h-11 mt-1 w-full transition-all duration-200 ${
                          errors.state ? "border-red-400 bg-red-50" : touched.state && formData.state ? "border-green-400 bg-green-50" : ""
                        }`}>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(stateCityMap).map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {touched.state && !errors.state && formData.state && (
                        <CheckCircle2 className="absolute right-8 top-4 h-5 w-5 text-green-500" />
                      )}
                      {errors.state && (
                        <div className="flex items-center mt-1 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span>{errors.state}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* City with animation effect when state changes */}
                  <div className="col-span-1 md:col-span-1">
                    <Label className="font-medium">City</Label>
                    <div className="relative">
                      <motion.div
                        animate={showStateEffect ? { scale: [1, 1.02, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <Select
                          name="city"
                          value={formData.city}
                          disabled={!availableCities.length}
                          onValueChange={(value) => {
                            setFormData((prev) => ({ ...prev, city: value }));
                            setTouched((prev) => ({ ...prev, city: true }));
                          }}
                        >
                          <SelectTrigger className={`h-11 mt-1 w-full transition-all duration-200 ${
                            errors.city ? "border-red-400 bg-red-50" : touched.city && formData.city ? "border-green-400 bg-green-50" : ""
                          }`}>
                            <SelectValue placeholder={!availableCities.length ? "Select state first" : "Select city"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>
                      {touched.city && !errors.city && formData.city && (
                        <CheckCircle2 className="absolute right-8 top-4 h-5 w-5 text-green-500" />
                      )}
                      {errors.city && (
                        <div className="flex items-center mt-1 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span>{errors.city}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-6 py-4 bg-gray-50 border-t flex flex-col sm:flex-row gap-4 items-center">
          <div className="text-gray-500 text-sm flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Next step: Select Venue & Date
          </div>
          <div className="ml-auto">
            <motion.div
              whileHover={{ scale: valid ? 1.03 : 1 }}
              whileTap={{ scale: valid ? 0.97 : 1 }}
            >
              <Button
                className={`
                  relative overflow-hidden transition-all duration-300
                  ${valid 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}
                  w-full md:w-auto px-8 py-2 h-11 text-white font-medium group
                `}
                type="button"
                onClick={() => handlePageChange(2)}
                disabled={!valid}
              >
                <span className="flex items-center">
                  Continue to Select Venue 
                  <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                {valid && (
                  <motion.span 
                    className="absolute bottom-0 left-0 h-1 bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                )}
              </Button>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default FirstPage;