import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";

export default function EventCard({ event }) {
  return (
    <Link to={`/ticketbooking/${event._id}`} className="block cursor-pointer">
      <Card className="overflow-hidden w-[324px] shadow-lg rounded-lg transform transition-transform duration-300 hover:scale-105  pt-0">
        {/* Image Section with Title Overlay */}
        <div className="relative h-[220px]">
          <img
            src={event.imageUrl || "/placeholder.svg?height=220&width=324"}
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            style={{ borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit' }}
          />
          <div className="absolute top-3 left-3 bg-pink-500 text-white rounded-full px-3 py-1 text-xs font-bold">
            {event.title || "SPORTS"}
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-2">{event.venue.name}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {new Date(event.start).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              , {new Date(event.start).toLocaleTimeString("en-US", { hour: 'numeric', minute: 'numeric' })} onwards
            </span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{event.venue.city || "Location not available"} ,{event.venue.state || "Location not available"}</span>
          </div>
        </CardContent>

        {/* Footer Section */}
        <CardFooter className="px-4 pb-2 pt-0">
          <div className="flex justify-between items-center bg-blue-50 p-2 w-full rounded-lg">
            <span className="text-black font-bold text-sm">
              ₹{event.ticketPrice} ONWARDS
            </span>
            <div className="flex items-center">
              <div className="border-l border-blue-500 h-5 mx-2"></div>
              <span className="text-blue-500 font-bold text-sm">
                BUY NOW
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}