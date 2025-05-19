import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Filters from "./filters";
import GenrePage from "./genre-page";
import NavSidebar from "../../components/ui/HomeNavbarandSidebar";

function GennreWiseEvents() {
  const location = useLocation();
  const genreTitle = location.state?.genreTitle || "Default Genre"; // Use a default genre if none is provided
  const [events, setEvents] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(genreTitle);

  useEffect(() => {
    const fetchEventsByGenre = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3002/api/event/genre-event",
          { genre: selectedGenre }
        );
        if (response.data.success) {
          setEvents(response.data.events);
        } else {
          console.error("Failed to fetch events for the genre");
        }
      } catch (error) {
        console.error("Error fetching events by genre:", error);
      }
    };

    if (selectedGenre) {
      fetchEventsByGenre();
    } else {
      console.warn("No genre title provided");
    }
  }, [selectedGenre]);

  useEffect(() => {
    const fetchEventsByStateAndCity = async () => {
      try {
        let stateEvents = [];
        let cityEvents = [];

        if (selectedState) {
          const stateResponse = await axios.post(
            "http://localhost:3002/api/event/getEventByState",
            { state: selectedState }
          );
          stateEvents = stateResponse.data.success
            ? stateResponse.data.events
            : [];
        }

        if (selectedCity) {
          const cityResponse = await axios.post(
            "http://localhost:3002/api/event/getEventByCity",
            { city: selectedCity }
          );
          cityEvents = cityResponse.data.success
            ? cityResponse.data.events
            : [];
        }
        console.log("stateevents", stateEvents);

        const combinedEvents = [...stateEvents, ...cityEvents];
        const uniqueEvents = Array.from(
          new Set(combinedEvents.map((event) => event._id))
        ).map((id) => combinedEvents.find((event) => event._id === id));

        const filteredByGenre = uniqueEvents.filter(
          (event) => event.genre === selectedGenre || !selectedGenre
        );

        setEvents(filteredByGenre);
        console.log("filterbygenre", filteredByGenre);
      } catch (error) {
        console.error("Error fetching events by state or city:", error);
      }
    };

    if (selectedState || selectedCity) {
      fetchEventsByStateAndCity();
    }
  }, [selectedState, selectedCity, selectedGenre]);

  const filteredEvents = events
    .filter((event) => {
      const eventPrice = event.ticketPrice || 0;
      const eventDate = new Date(event.start);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      let dateMatch = selectedOptions.length === 0;
      if (selectedOptions.includes("Today")) {
        dateMatch =
          dateMatch || eventDate.toDateString() === today.toDateString();
      }
      if (selectedOptions.includes("Tomorrow")) {
        dateMatch =
          dateMatch || eventDate.toDateString() === tomorrow.toDateString();
      }
      if (selectedOptions.includes("This Weekend")) {
        const day = eventDate.getDay();
        dateMatch = dateMatch || day === 6 || day === 0;
      }

      const stateMatch = selectedState
        ? event.venue.state === selectedState
        : true;
      const cityMatch = selectedCity ? event.venue.city === selectedCity : true;
      console.log(stateMatch, "stateMatch");
      console.log(
        `Event State: ${event.venue.state}, Selected State: ${selectedState}`
      );
      return (
        eventPrice >= minPrice &&
        eventPrice <= maxPrice &&
        dateMatch &&
        stateMatch &&
        cityMatch
      );
    })
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") {
        return a.ticketPrice - b.ticketPrice;
      } else if (sortOrder === "highToLow") {
        return b.ticketPrice - a.ticketPrice;
      }
      return 0;
    });
  console.log("filteredEvents", filteredEvents);
  return (
    <div className="flex pt-16">
      <NavSidebar />
      <div className="w-1/4 flex items-center justify-center p-4 pt-20 mt-10 h-screen overflow-y-auto">
        <Filters
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          currentGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
      </div>

      <div className="w-3/4 p-4 overflow-y-auto">
        <GenrePage events={filteredEvents} />
      </div>
    </div>
  );
}

export default GennreWiseEvents;
