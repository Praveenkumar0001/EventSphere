import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FirstPage from "./first-page";
import SecondPage from "./second-page";
import ThirdPage from "./third-page";
import Stepper from "@/pages/add-event/Stepper2";
import NavSidebar from "@/components/ui/HomeNavbarandSidebar";

const EventAddHome = () => {
  const [page, setPage] = useState(1);

  const userDataString = localStorage.getItem("user")
  let userID

  if (userDataString) {
    const userData = JSON.parse(userDataString)
    userID = userData._id
  }

  const [formData, setFormData] = useState({
    state: "Andhra Pradesh",
    city: "Vijayawada",
    title: "Hey there how are you?",
    genre: "Cultural Fest",
    contactNo: "131231",
    startDate: "2025-03-26",
    startTime: "11:10",
    endDate: "2025-03-26",
    endTime: "11:20",
    description: "sdfsdflskjdfljsd ",
    file: null,
    agree: false,
    venue: null,
    user: userID,
    ticketPrice: 0,
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handlePageChange = (page) => {
    if (page < 1 || page > 3) return;
    setPage(page);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <div className="p-6">
      <NavSidebar />
      <Stepper currentStep={page} />
      <AnimatePresence exitBeforeEnter>
        {page === 1 && (
          <motion.div
            key="firstPage"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
          >
            <FirstPage
              formData={formData}
              setFormData={setFormData}
              handlePageChange={handlePageChange}
            />
          </motion.div>
        )}
        {page === 2 && (
          <motion.div
            key="secondPage"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
          >
            <SecondPage
              formData={formData}
              setFormData={setFormData}
              handlePageChange={handlePageChange}
            />
          </motion.div>
        )}
        {page === 3 && (
          <motion.div
            key="thirdPage"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
          >
            <ThirdPage
              formData={formData}
              setFormData={setFormData}
              handlePageChange={handlePageChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventAddHome;
