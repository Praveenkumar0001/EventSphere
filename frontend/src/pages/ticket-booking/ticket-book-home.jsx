import React, { useState, useEffect, Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Music,
  Clock,
  MapPin,
  Building,
} from "lucide-react";
import CityApp from "../../components/ui/Masotest";
import NavSidebar from "../../components/ui/HomeNavbarandSidebar";
import Ratingpage from "../../components/ui/Homereviewpage";
import Giverating from "../../components/ui/Homereviewpage2";
import { PaymentSuccess } from "./booking-success";

const EventCard = lazy(() => import("../../components/ui/event-card"));
const GooglePaymentButton = lazy(() => import("../../components/ui/google-payment-button"));

function EventDetails() {
  const navigate = useNavigate();
  const { event_id } = useParams();
  const [event, setEvent] = useState(null);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [bookedTicket, setBookedTicket] = useState(null);

  const visibleCards = 3;
  const userDataString = localStorage.getItem("user");
  let userId;

  if (userDataString) {
    const userData = JSON.parse(userDataString);
    userId = userData._id;
  }

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/event/get-event-by-id/${event_id}`
        );
        if (response.status === 200) {
          setEvent(response.data);
        } else {
          console.error("Failed to fetch event details");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    if (event_id) {
      fetchEventDetails();
    }
  }, [event_id]);

  useEffect(() => {
    if (event) {
      console.log("Venue bookings:", event?.venue?.bookings);
    }
  }, [event]);

  useEffect(() => {
    const fetchSimilarEvents = async () => {
      if (!event) return;
      try {
        const response = await axios.post(
          "http://localhost:3002/api/event/genre-event",
          { genre: event.genre }
        );
        if (response.data.success) {
          const filteredEvents = response.data.events.filter(
            (e) => e._id !== event._id
          );
          setSimilarEvents(filteredEvents);
        } else {
          console.error("Failed to fetch similar events");
        }
      } catch (error) {
        console.error("Error fetching similar events:", error);
      }
    };

    if (event?.genre) {
      fetchSimilarEvents();
    }
  }, [event]);

  useEffect(() => {
    if (paymentDone) {
      const bookTicket = async () => {
        try {
          const response = await axios.post(
            "http://localhost:3002/api/ticket/book-ticket",
            {
              paymentID: `TXN-${userId}-${Math.floor(Math.random() * 100000)}`,
              userID: userId,
              eventID: event?._id,
            }
          );
          if (response.data.success) {
            setBookedTicket(response.data.ticket);
          }
        } catch (error) {
          console.error("Error booking ticket:", error);
        }
      };
      bookTicket();
    }
  }, [paymentDone, event, userId]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, similarEvents.length - visibleCards)
    );
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const description = showFullDescription
    ? event?.description
    : `${event?.description?.slice(0, 100)}...`;

  if (bookedTicket) {
    return (
      <Suspense fallback={<div>Loading payment success...</div>}>
        <PaymentSuccess event={event} ticket={bookedTicket} />
      </Suspense>
    );
  }

  return (
    <div className="container mx-auto pt-16">
      <NavSidebar />
      <div className="flex mt-8 ml-8">
        <img
          src={event?.imageUrl}
          alt={event?.title}
          className="rounded-lg"
          style={{ width: "600px", height: "400px", objectFit: "cover" }}
          loading="lazy"
          decoding="async"
        />
        <div className="w-1/3 p-6 bg-white shadow-md rounded-lg border border-gray-200 ml-10">
  <h2 className="text-2xl font-bold mb-4">{event?.title}</h2>
  <p className="text-gray-600 flex items-center mb-4">
    <Music className="mr-2" /> {event?.genre}
  </p>
  <p className="text-gray-600 flex items-center mb-4">
    <Clock className="mr-2" /> {new Date(event?.start).toLocaleString()}
  </p>
  <p className="text-gray-600 flex items-center mb-4">
    <Clock className="mr-2" /> {new Date(event?.end).toLocaleString()}
  </p>
  <p className="text-gray-600 flex items-center mb-4">
    <Building className="mr-2" /> {event?.venue?.name}
  </p>
  <p className="text-gray-600 flex items-center mb-4">
    <MapPin className="mr-2" /> {event?.venue?.city}, {event?.venue?.state}
  </p>
  <div className="flex justify-between items-center mt-4">
    <p className="text-xl font-bold">₹{event?.ticketPrice || "ticket price"}</p>
    <Suspense fallback={<div>Loading payment button...</div>}>
      <GooglePaymentButton
        price={event?.ticketPrice}
        setPaymentDone={setPaymentDone}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Book Now
      </GooglePaymentButton>
    </Suspense>
  </div>
</div>
      </div>

      <div className="mt-8 ml-8">
        <h3 className="text-xl font-bold">About the Event</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
        <button onClick={toggleDescription} className="text-blue-500">
          {showFullDescription ? "Show Less" : "Show More"}
        </button>
      </div>
      <div className="mt-8 ml-8">
        <h3 className="text-xl font-bold">You May Also Like</h3>
        <div className="flex items-center">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2 disabled:opacity-50 hover:scale-150 hover:cursor-pointer transition-transform"
          >
            <ChevronLeft className="h-8 w-8 text-pink-500" />
          </button>
          <div className="flex overflow-hidden space-x-4 p-4">
            <Suspense fallback={<div>Loading similar events...</div>}>
              {similarEvents
                .slice(currentIndex, currentIndex + visibleCards)
                .map((similarEvent) => (
                  <EventCard key={similarEvent._id} event={similarEvent} />
                ))}
            </Suspense>
          </div>
          <button
            onClick={handleNext}
            disabled={currentIndex >= similarEvents.length - visibleCards}
            className="p-2 disabled:opacity-50 hover:scale-150 hover:cursor-pointer transition-transform"
          >
            <ChevronRight className="h-8 w-8 text-pink-500" />
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold">
          Similar events in your {event?.venue?.city}
        </h3>
        <CityApp city={event?.venue?.city} />
      </div>
      <div className="mt-8 mr-180">
        <Giverating eventId={event_id} userId={userId} />
      </div>
      <div className="mt-8 mr-160">
        <Ratingpage eventId={event_id} />
      </div>
    </div>
  );
}

export default EventDetails;