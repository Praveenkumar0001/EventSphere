import React, { useState, useEffect } from "react";
import { FaSpinner, FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Stepper from "../../pages/add-event/Stepper2";

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
  "Sports ",
  "Science Fair",
];

function AddVenueDetails() {
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    contact: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const userDataString = localStorage.getItem("user")
  let userID

  if (userDataString) {
    const userData = JSON.parse(userDataString)
    userID = userData._id
  }

  useEffect(() => {
    const isValid =
      formData.title.trim() !== "" &&
      formData.genre.trim() !== "" &&
      formData.contact.trim() !== "" &&
      selectedState !== "" &&
      selectedCity !== "";

    setIsFormValid(isValid);
  }, [formData, selectedState, selectedCity]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const dataToSend = {
      title: formData.title,
      state: selectedState,
      city: selectedCity,
      genre: formData.genre,
      contactNo: formData.contact,
      user: userID,
    };

    try {
      const response = await axios.post(
        "http://localhost:3002/api/venue/getvenue",
        {
          state: selectedState,
          city: selectedCity,
        }
      );
      console.log("Response:", response.data);
      if (response.data.success) {
        toast.success("Venues Retrieved Successfully");
        console.log(response.data.venues);
        navigate("/venuelist", {
          state: { venues: response.data.venues, formData: dataToSend },
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to retrieve venues. Please try again.");
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

  return (
    <div className="min-h-screen bg-gray-100">
      <br></br>

      <Stepper currentStep={1} />

      <div className="flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full overflow-hidden">
          <h2 className="text-2xl font-bold mb-6">General Details</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                className={`border w-full py-2 px-3 rounded outline-none transition-colors ${
                  focusedInput === "title"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                required
                onFocus={() => setFocusedInput("title")}
                onBlur={() => setFocusedInput("")}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`border w-full py-2 px-3 rounded outline-none transition-colors text-left flex justify-between items-center ${
                    focusedInput === "state"
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  onFocus={() => setFocusedInput("state")}
                  onBlur={() => setFocusedInput("")}
                >
                  {selectedState || "Select State"}
                  <FaChevronDown className="ml-2" />
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
                City <span className="text-red-500">*</span>
              </label>
              <select
                className={`border w-full py-2 px-3 rounded outline-none transition-colors ${
                  focusedInput === "city"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
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
                Genre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="genre"
                  className={`border w-full py-2 px-3 rounded outline-none transition-colors ${
                    focusedInput === "genre"
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  required
                  value={formData.genre}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedInput("genre")}
                  onBlur={() => setFocusedInput("")}
                >
                  <option value="">Select Genre</option>
                  {genreOptions.map((genre, index) => (
                    <option key={index} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact No. <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border rounded py-2 px-3">
                <div className="mr-2">
                  <img src="/indian_flag.png" alt="Flag" className="w-6 h-4" />
                </div>
                <span className="mr-2">+91</span>
                <input
                  type="text"
                  name="contact"
                  placeholder="Enter mobile number"
                  className="outline-none flex-1"
                  required
                  onFocus={() => setFocusedInput("contact")}
                  onBlur={() => setFocusedInput("")}
                  onChange={handleInputChange}
                  style={{ marginLeft: "0.5rem" }}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`${
                isFormValid ? "bg-blue-900" : "bg-gray-400"
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
                "Continue to Select Venue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddVenueDetails;
