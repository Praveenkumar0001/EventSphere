import React, { useRef } from "react";
import EventsCarousel from "./events-carousel";
import EventsPage from './events-page';
import EventGenres from "./event-genres";
import NavSidebar from "@/components/ui/HomeNavbarandSidebar";
import { CalendarDays, MapPin, TrendingUp } from "lucide-react";
import HeroSection from "@/components/ui/Homestartingpage";
import FAQAccordion from "./faq-accordian";
import Footer from "./Footer"; // Import the Footer component

export default function HomePage() {
  const footerRef = useRef(null);
  const eventGenresRef = useRef(null);

  const scrollToFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToEventGenres = () => {
    if (eventGenresRef.current) {
      eventGenresRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavSidebar scrollToFooter={scrollToFooter} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-700 to-pink-600 text-white">
        <HeroSection scrollToEventGenres={scrollToEventGenres} />
      </section>

      <section className="">
        <EventsCarousel />
      </section>

      {/* Upcoming Events Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 overflow-hidden">
        <EventsPage />
      </section>

      {/* Event Genres Section */}
      <section ref={eventGenresRef} className="container mx-auto px-4 py-12 md:py-16 bg-white">
        <EventGenres />
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 bg-white">
        <FAQAccordion />
      </section>

      {/* Footer */}
      <Footer ref={footerRef} />
    </div>
  );
}