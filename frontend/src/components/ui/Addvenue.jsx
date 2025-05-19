import React, { useState, useRef, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const stateCityMap = {
  "Andhra Pradesh": ["Vijayawada", "Visakhapatnam"],
  "Arunachal Pradesh": ["Itanagar", "Tawang"],
  "Assam": ["Guwahati", "Dibrugarh"],
  "Bihar": ["Patna", "Gaya"],
  "Chhattisgarh": ["Raipur", "Bhilai"],
  "Goa": ["Panaji", "Vasco da Gama"],
  "Gujarat": ["Ahmedabad", "Surat"],
  "Haryana": ["Gurgaon", "Faridabad"],
};

function AddVenueDetails() {
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [venueImage, setVenueImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    paxcapacity: "",
    roomcount: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState();
  const [fileName, setFileName] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const handlers = useSwipeable({
    onSwipedUp: () => {
      formRef.current.scrollBy({ top: 100, behavior: "smooth" });
    },
    onSwipedDown: () => {
      formRef.current.scrollBy({ top: -100, behavior: "smooth" });
    },
  });

  useEffect(() => {
    const isValid =
      formData.name.trim() !== "" &&
      formData.price.trim() !== "" &&
      formData.paxcapacity.trim() !== "" &&
      formData.roomcount.trim() !== "" &&
      formData.description.trim() !== "" &&
      selectedState !== "" &&
      selectedCity !== "" &&
      selectedFile !== undefined;

    setIsFormValid(isValid);
  }, [formData, selectedState, selectedCity, selectedFile]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill all required fields.");
      return;
    }
   
    setLoading(true);
  
    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("price", formData.price);
    dataToSend.append("paxcapacity", formData.paxcapacity);
    dataToSend.append("roomcount", formData.roomcount);
    dataToSend.append("description", formData.description);
    dataToSend.append("state", selectedState);
    dataToSend.append("city", selectedCity);
    dataToSend.append("file", selectedFile);
    
    try {
      const response = await axios.post("http://localhost:3002/api/venue/addvenue", dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response.data);
      if (response.data.success){
        toast.success("Venue Added Successfully")
      }
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCitySelect = (e) => {
    if (!selectedState) {
      toast.warning("Please select a state first!", {
        autoClose: 1500,
      });
      e.preventDefault();
      return;
    }
    setSelectedCity(e.target.value);
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

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full overflow-hidden">
        <h2 className="text-2xl font-bold mb-6">Add Venue Details</h2>
        <div ref={formRef} className="overflow-y-auto max-h-[500px] p-2" style={{ scrollbarWidth: "thin" }} {...handlers}>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter venue name"
                className={`border w-full py-2 px-3 rounded outline-none transition-colors ${focusedInput === "venueName" ? "border-blue-500" : "border-gray-300"}`}
                required
                onFocus={() => setFocusedInput("venueName")}
                onBlur={() => setFocusedInput("")}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Venue State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`border w-full py-2 px-3 rounded outline-none transition-colors text-left ${focusedInput === "state" ? "border-blue-500" : "border-gray-300"}`}
                  onFocus={() => setFocusedInput("state")}
                  onBlur={() => setFocusedInput("")}
                >
                  {selectedState || "Select State"}
                </button>
                {dropdownOpen && (
                  <div className="absolute z-10 bg-white border rounded mt-1 max-h-40 overflow-y-auto w-full">
                    {Object.keys(stateCityMap).map((state, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 hover:bg-blue-200 cursor-pointer"
                        onClick={() => {
                          setSelectedState(state);
                          setSelectedCity("");
                          setDropdownOpen(false);
                        }}
                      >
                        {state}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Venue City <span className="text-red-500">*</span>
              </label>
              <select
                className={`border w-full py-2 px-3 rounded outline-none transition-colors ${focusedInput === "city" ? "border-blue-500" : "border-gray-300"}`}
                required
                value={selectedCity}
                onChange={handleCitySelect}
                onFocus={() => setFocusedInput("city")}
                onBlur={() => setFocusedInput("")}
              >
                <option value="">Select City</option>
                {selectedState &&
                  stateCityMap[selectedState].map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booking Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                placeholder="Enter Booking Price"
                className={`border w-full py-2 px-3 rounded outline-none transition-colors ${focusedInput === "bookingPrice" ? "border-blue-500" : "border-gray-300"}`}
                min="0"
                onFocus={() => setFocusedInput("bookingPrice")}
                onBlur={() => setFocusedInput("")}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4 flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pax Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="paxcapacity"
                  placeholder="Enter Pax Capacity"
                  className={`border w-full py-2 px-3 rounded outline-none transition-colors ${focusedInput === "paxCapacity" ? "border-blue-500" : "border-gray-300"}`}
                  required
                  min="0"
                  onFocus={() => setFocusedInput("paxCapacity")}
                  onBlur={() => setFocusedInput("")}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Count <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="roomcount"
                  placeholder="Enter Room Count"
                  className={`border w-full py-2 px-3 rounded outline-none transition-colors ${focusedInput === "roomCount" ? "border-blue-500" : "border-gray-300"}`}
                  required
                  min="0"
                  onFocus={() => setFocusedInput("roomCount")}
                  onBlur={() => setFocusedInput("")}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Add Description (Minimum 150 Words)"
                className={`border w-full py-2 px-3 rounded outline-none transition-colors ${focusedInput === "description" ? "border-blue-500" : "border-gray-300"}`}
                rows="4"
                required
                onFocus={() => setFocusedInput("description")}
                onBlur={() => setFocusedInput("")}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Photo <span className="text-red-500">*</span>
              </label>
              <div
                className={`border-dashed border-2 p-6 text-center rounded-md bg-gray-50 w-[60%] ${focusedInput === "uploadPhoto" ? "border-blue-500" : "border-gray-300"}`}
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
                  <button type="button" className="bg-blue-500 text-white py-1 px-3 rounded mt-2">Browse Files</button>
                </label>
                {fileName && <p className="mt-2 text-sm text-gray-600">{fileName}</p>}
              </div>
            </div>

            <div className="venueImage mb-4 flex justify-start">
              {venueImage && <img src={venueImage} alt="Selected Venue" className="w-[60%] h-auto object-cover rounded-md" />}
            </div>
          </form>
        </div>
        <button
          type="submit"
          onClick={handleFormSubmit}
          className={`${isFormValid
            ? "bg-gradient-to-r from-blue-400 to-blue-600"
            : "bg-gray-400"
            } py-2 px-8 mt-4 font-bold text-white cursor-pointer transform transition-transform duration-200 active:scale-105 mx-auto block rounded-full flex items-center justify-center`}
          style={{ width: "100%" }}
          disabled={!isFormValid}
        >
          {loading ? (
            <>
              <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Continue to Add Venue"
          )}
        </button>
      </div>
    </div>
  );
}

export default AddVenueDetails;