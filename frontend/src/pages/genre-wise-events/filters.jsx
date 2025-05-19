import React, { useState } from "react";
import Slider from '@mui/material/Slider';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

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

const genres = [
  { title: 'Cultural Fest' },
  { title: 'Sports' },
  { title: 'Musical Concerts' },
  { title: 'Comedy Shows' },
  { title: 'Science Fair' },
];

function Filters({ minPrice, maxPrice, setMinPrice, setMaxPrice, selectedOptions, setSelectedOptions, sortOrder, setSortOrder, currentGenre, setSelectedGenre, selectedState, setSelectedState, selectedCity, setSelectedCity }) {
  const [dateOpen, setDateOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [sortOpen, setSortOpen] = useState(true);

  const handleDateChange = (option) => {
    setSelectedOptions(prevOptions => 
      prevOptions.includes(option) 
        ? prevOptions.filter(opt => opt !== option) 
        : [...prevOptions, option]
    );
  };

  const handlePriceChange = (event, newValue) => {
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(prevOrder => (prevOrder === order ? "" : order));
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity(""); // Reset city when state changes
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md w-80">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      {/* Date Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Date</h3>
          <button onClick={() => setDateOpen(!dateOpen)}>
            {dateOpen ? <ExpandLess /> : <ExpandMore />}
          </button>
        </div>
        {dateOpen && (
          <div className="flex flex-wrap gap-2 mb-2">
            {["Today", "Tomorrow", "This Weekend"].map((option) => (
              <button
                key={option}
                onClick={() => handleDateChange(option)}
                className={`px-3 py-2 text-base border rounded-full ${
                  selectedOptions.includes(option) ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white" : "text-blue-500"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Price</h3>
          <button onClick={() => setPriceOpen(!priceOpen)}>
            {priceOpen ? <ExpandLess /> : <ExpandMore />}
          </button>
        </div>
        {priceOpen && (
          <div className="mb-4">
            <Slider
              value={[minPrice, maxPrice]}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={5000}
            />
            <div className="flex justify-between text-sm">
              <span>₹{minPrice}</span>      
              <span>₹{maxPrice}</span>      
            </div>
          </div>
        )}
      </div>

      {/* Sort Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Sort By</h3>
          <button onClick={() => setSortOpen(!sortOpen)}>
            {sortOpen ? <ExpandLess /> : <ExpandMore />}
          </button>
        </div>
        {sortOpen && (
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => handleSortOrderChange("lowToHigh")}
              className={`px-3 py-2 text-base border rounded-full ${
                sortOrder === "lowToHigh" ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white" : "text-blue-500"
              }`}
            >
              Price: Low to High
            </button>
            <button
              onClick={() => handleSortOrderChange("highToLow")}
              className={`px-3 py-2 text-base border rounded-full ${
                sortOrder === "highToLow" ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white" : "text-blue-500"
              }`}
            >
              Price: High to Low
            </button>
          </div>
        )}
      </div>

      {/* Genre Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Genre</h3>
        <select
          value={currentGenre}
          onChange={handleGenreChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Genre</option>
          {genres.map((g) => (
            <option key={g.title} value={g.title}>
              {g.title}
            </option>
          ))}
        </select>
      </div>

      {/* State and City Filter */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">State</h3>
        <select
          value={selectedState}
          onChange={handleStateChange}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="">Select State</option>
          {Object.keys(stateCityMap).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <h3 className="font-semibold mb-2">City</h3>
        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="w-full p-2 border rounded"
          disabled={!selectedState}
        >
          <option value="">Select City</option>
          {selectedState && stateCityMap[selectedState].map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Filters;