import React from "react";
import { useLocation } from "react-router-dom";
import VenueCard from "./VenueCard";
import Stepper from "../../pages/add-event/Stepper2";

function VenueList() {
  const location = useLocation();
  const { venues = [], formData } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <br />
      <Stepper currentStep={2} />
      <h2 className="text-2xl font-bold mb-6">Select Venue</h2>
      <div
        className="grid grid-cols-3 gap-y-20"
        style={{ columnGap: '60px' }} // Custom horizontal spacing
      >
        {venues.map((venue, index) => (
          <VenueCard key={index} venue={venue} formData={formData} />
        ))}
      </div>
    </div>
  );
}

export default VenueList;