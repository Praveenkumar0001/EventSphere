// HomePage.js
import React, { useRef } from "react";
import EventsPage from "./HomePage3";
import EventGenres from "./HomePage2";
import NavSidebar from "./HomeNavbarandSidebar";
import Homeimage from "../../pages/home/events-carousel";
import Homestart from "./Homestartingpage"; // Make sure this path points to HeroSection

function HomePage() {
  const eventGenresRef = useRef(null);

  const scrollToEventGenres = () => {
    if (eventGenresRef.current) {
      eventGenresRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div>
      <NavSidebar />

      <section>
        <Homestart scrollToEventGenres={scrollToEventGenres} />
      </section>

      <section className="mb-20">
        <Homeimage />
      </section>

      <section className="mb-8">
        <EventsPage />
      </section>

      <section ref={eventGenresRef} className="pt-20">
        <EventGenres />
      </section>
    </div>
  );
}

export default HomePage;
