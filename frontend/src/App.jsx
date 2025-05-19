import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import SignupForm from "./components/ui/SignupForm.jsx";
import LoginForm from "./pages/auth/LoginForm.jsx";
import CompanySignup from "./components/ui/companysignup.jsx";
import OTPVerification from "./components/ui/Otpverify.jsx";
import CompanyOtpVerity from "./components/ui/verify-company-otp.jsx";
import ResetPasswordForm from "./components/ui/Resetpass.jsx";
import ResetPasswordFormemail from "./components/ui/Resetpassemail.jsx";
import EmailSentNotification from "./components/ui/Emailsendsuccess.jsx";
import AddVenueForm from "./components/ui/Addvenue.jsx";
import EventListForm1 from "./components/ui/EventListForm";
import Stepper from "./pages/add-event/Stepper2.jsx";
import VenueList from "./components/ui/VenueList.jsx";
import VenueCard from "./components/ui/Venuecard.jsx";
import EventlistForm2 from "./components/ui/Eventlistform2.jsx";
import EventAddHome from "./pages/add-event/home.jsx";
import Prior_booking from "./pages/add-event/components/Prior_booking.jsx";
import Homepage from "./pages/home/home.jsx";
import Homepage2 from "./pages/home/event-genres.jsx";
import Genrepagefilter from "./pages/genre-wise-events/genre-events-home.jsx";
import HomepageBooking from "./pages/ticket-booking/temp1.jsx";
import PaymentForEvent from "./pages/ticket-booking/event-payment.jsx";
import Navbar from "./components/ui/Homenavbar.jsx";
import Sidebar from "./components/ui/Homesidebar.jsx";
import Myprofile from "./pages/Profile/profile.jsx";
import MyBooking from "./components/ui/my-ticket.jsx";
import AboutUS from "./pages/about-us/about-us-page.jsx";
import ContactUS from "./pages/contact-us/HomefooterContactus.jsx";
import ProtectedRoute from "./components/ui/Protectedroute.jsx";
import MyEvents from "./components/ui/my-events.jsx";
import Reviewpage from  "./components/ui/Homereviewpage.jsx";
import Homeimage from  "./pages/home/events-carousel.jsx";
import Homestart from  "./components/ui/Homestartingpage.jsx";
import ScrollToTop from "./utils/scroll-to-top.jsx";
import HomePage from "./pages/home/home.jsx";
import Footer from "./pages/home/Footer.jsx";
import Rating from "./components/ui/Homereviewpage2.jsx";
import EventsPage from "./pages/file-tender/events-page.jsx";
import TenderSubmissionForm from "./pages/file-tender/tender-submission-form.jsx";
import MyTenders from "./pages/file-tender/my-tenders.jsx";
function App() {
  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="468203105744-0cvsjak0ig3n2q735ntt6u02g2b5ot8q.apps.googleusercontent.com">
        <SignupForm />
      </GoogleOAuthProvider>
    );
  };
  const GoogleAuthWrapper1 = () => {
    return (
      <GoogleOAuthProvider clientId="468203105744-0cvsjak0ig3n2q735ntt6u02g2b5ot8q.apps.googleusercontent.com">
       <LoginForm/>
      </GoogleOAuthProvider>
    );
  };
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<GoogleAuthWrapper />} />
          <Route path="/companyregister" element={<CompanySignup />} />
          <Route path="/otpverify" element={<OTPVerification />} />
          <Route path="/otpverify-company" element={<CompanyOtpVerity />} />
          <Route path="/update-password/:id" element={<ResetPasswordForm />} />
          <Route
            path="/update-passwordemail"
            element={<ResetPasswordFormemail />}
          />
          <Route path="/emailsentsuccess" element={<EmailSentNotification />} />
          <Route path="/login" element={<GoogleAuthWrapper1/>} />
          <Route path="/aboutus" element={<AboutUS />} />

          {/* Protected Routes */}
          <Route
            path="/addVenue"
            element={<ProtectedRoute element={AddVenueForm} />}
          />
          <Route
            path="/listevent1"
            element={<ProtectedRoute element={EventListForm1} />}
          />
          <Route path="/step" element={<ProtectedRoute element={Stepper} />} />
          <Route
            path="/venuelist"
            element={<ProtectedRoute element={VenueList} />}
          />
          <Route
            path="/venuecard"
            element={<ProtectedRoute element={VenueCard} />}
          />
          <Route
            path="/listevent2"
            element={<ProtectedRoute element={EventlistForm2} />}
          />
          <Route
            path="/add-event"
            element={<ProtectedRoute element={EventAddHome} />}
          />
          <Route
            path="/venue-details"
            element={<ProtectedRoute element={Prior_booking} />}
          />
          <Route path="/home" element={<ProtectedRoute element={Homepage} />} />
          <Route path="/contactus" element={<ProtectedRoute element={Footer} />} />
          <Route
            path="/home2"
            element={<ProtectedRoute element={Homepage2} />}
          />
          <Route
            path="/genrepagefilter"
            element={<ProtectedRoute element={Genrepagefilter} />}
          />
          <Route
            path="/ticketbooking/:event_id"
            element={<ProtectedRoute element={HomepageBooking} />}
          />
          <Route
            path="/event-booking-payment"
            element={<ProtectedRoute element={PaymentForEvent} />}
          />
          <Route path="/navbar" element={<ProtectedRoute element={Navbar} />} />
          <Route path="/sidebar" element={<ProtectedRoute element={Sidebar} />} />
          <Route path="/myprofile" element={<ProtectedRoute element={Myprofile} />} />
          <Route path="/myticket" element={<ProtectedRoute element={MyBooking} />} />
         
          <Route path="/myevent" element={<ProtectedRoute element={MyEvents} />} />
          <Route path="/reviewpage" element={<ProtectedRoute element={Reviewpage} />} />
          <Route path="/homeimage" element={<ProtectedRoute element={Homeimage} />} />
          <Route path="/homestart" element={<ProtectedRoute element={Homestart} />} />
          <Route path="/homerating" element={<ProtectedRoute element={Rating} />} />



          <Route path="/file-tender" element={<EventsPage />} />
          <Route path="/tender-for-event/:id" element={<TenderSubmissionForm />} />
          <Route path="/my-tenders" element={<MyTenders />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;