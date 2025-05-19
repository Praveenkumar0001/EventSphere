"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Share2,
  Heart,
  Ticket,
  Users,
  Star,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import CityApp from "../../components/ui/Masotest"
import NavSidebar from "@/components/ui/HomeNavbarandSidebar"
import Ratingpage from "../../components/ui/Homereviewpage"
import Giverating from "../../components/ui/Homereviewpage2"
const EventCard = React.lazy(() => import("./temp2"))
const GooglePaymentButton = React.lazy(() => import("../../components/ui/google-payment-button"))

function EventDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8">
        <Skeleton className="h-[400px] w-full md:w-[600px] rounded-xl" />
        <div className="w-full md:w-1/3 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-12 w-full mt-8" />
        </div>
      </div>
    </div>
  )
}


function EventDetails() {
  const navigate = useNavigate()
  const { event_id } = useParams()
  const [event, setEvent] = useState(null)
  const [similarEvents, setSimilarEvents] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)
  const [bookedTicket, setBookedTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("details")
  const [isLiked, setIsLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Mock multiple images for the gallery effect
  const mockImages = [
    event?.imageUrl
  ]

  const visibleCards = 3
  const userDataString = localStorage.getItem("user")
  let userId

  if (userDataString) {
    const userData = JSON.parse(userDataString)
    userId = userData._id
  }

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`http://localhost:3002/api/event/get-event-by-id/${event_id}`)
        if (response.status === 200) {
          setEvent(response.data.event)
          console.log("Event details fetched successfully:", response.data);
        } else {
          console.error("Failed to fetch event details")
        }
      } catch (error) {
        console.error("Error fetching event details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (event_id) {
      fetchEventDetails()
    }
  }, [event_id])

  useEffect(() => {
    const fetchSimilarEvents = async () => {
      if (!event) return
      try {
        const response = await axios.post("http://localhost:3002/api/event/genre-event", { genre: event.genre })
        if (response.data.success) {
          const filteredEvents = response.data.events.filter((e) => e._id !== event._id)
          setSimilarEvents(filteredEvents)
        } else {
          console.error("Failed to fetch similar events")
        }
      } catch (error) {
        console.error("Error fetching similar events:", error)
      }
    }

    if (event?.genre) {
      fetchSimilarEvents()
    }
  }, [event])

  useEffect(() => {
    if (paymentDone) {
      const bookTicket = async () => {
        try {
          const response = await axios.post("http://localhost:3002/api/ticket/book-ticket", {
            paymentID: `TXN-${userId}-${Math.floor(Math.random() * 100000)}`,
            userID: userId,
            eventID: event?._id,
          })
          if (response.data.success) {
            setBookedTicket(response.data.ticket)
          }
        } catch (error) {
          console.error("Error booking ticket:", error)
        }
      }
      bookTicket()
    }
  }, [paymentDone, event, userId])

  // Countdown timer effect
  useEffect(() => {
    if (!event?.start) return

    const calculateTimeLeft = () => {
      const eventTime = new Date(event.start).getTime()
      const now = new Date().getTime()
      const difference = eventTime - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setCountdown({ days, hours, minutes, seconds })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [event])

  // Image gallery navigation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mockImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [mockImages.length])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, similarEvents.length - visibleCards))
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? mockImages.length - 1 : prevIndex - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mockImages.length)
  }

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription)
  }

  const description = showFullDescription ? event?.description : `${event?.description?.slice(0, 150)}...`

  if (bookedTicket) {
    return (
      <Suspense fallback={<div className="p-8 text-center">Loading payment success...</div>}>
        <PaymentSuccess event={event} ticket={bookedTicket} />
      </Suspense>
    )
  }

  const eventDate = event?.start ? new Date(event.start) : new Date()
  const eventEndDate = event?.end ? new Date(event.end) : new Date()

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <NavSidebar />

      {/* Hero Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden bg-black">
        <img
          src={mockImages[currentImageIndex]}
          alt={event?.title}
          className="w-full h-full object-cover opacity-70"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div>
              <Badge className="mb-4 bg-blue-500 hover:bg-blue-600 text-white border-0">
                {event?.genre}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {event?.title}
              </h1>
              <p className="text-xl text-white/80">
                Presented by{" "}
                <span className="font-medium">Event Organizer</span>
              </p>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-4 right-4 flex justify-between">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full opacity-70 hover:opacity-100"
            onClick={handlePrevImage}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full opacity-70 hover:opacity-100"
            onClick={handleNextImage}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-8">
            {/* Event Quick Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Card className="bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-rose-200 transition-all duration-300 hover:shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Calendar className="h-8 w-8 text-blue-500 mb-3" />
                  <h3 className="font-semibold text-slate-700">Date & Time</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {formatDate(eventDate)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatTime(eventDate)} - {formatTime(eventEndDate)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-rose-200 transition-all duration-300 hover:shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <MapPin className="h-8 w-8 text-blue-500 mb-3" />
                  <h3 className="font-semibold text-slate-700">Location</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {event?.venue?.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {event?.venue?.city}, {event?.venue?.state}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-rose-200 transition-all duration-300 hover:shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Ticket className="h-8 w-8 text-blue-500 mb-3" />
                  <h3 className="font-semibold text-slate-700">Ticket Price</h3>
                  <p className="text-sm text-slate-600 mt-1">Starting from</p>
                  <p className="text-xl font-bold text-blue-600 mt-1">
                    ₹{event?.ticketPrice}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabs for Event Information */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Tabs
                defaultValue="details"
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-8 grid w-full grid-cols-2 bg-slate-100 p-1 rounded-full">
                  <TabsTrigger
                    value="details"
                    className="rounded-full data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    Event Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-full data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    Reviews & Ratings
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="details"
                  className="space-y-8 bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">
                      About the Event
                    </h2>
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {description}
                    </p>
                    {event?.description && event.description.length > 150 && (
                      <Button
                        variant="link"
                        onClick={toggleDescription}
                        className="px-0 text-blue-600 mt-2"
                      >
                        {showFullDescription ? "Show Less" : "Show More"}
                      </Button>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-bold mb-4 text-slate-800">
                      Event Highlights
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Live performances",
                        "Interactive sessions",
                        "Networking opportunities",
                        "Exclusive content",
                      ].map((highlight, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <span className="text-slate-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-bold mb-4 text-slate-800">
                      Organizer Information
                    </h3>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-rose-100">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" />
                        <AvatarFallback>EO</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-800">
                          Event Organizer
                        </p>
                        <p className="text-sm text-slate-600">
                          Professional event management company
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-8">
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h2 className="text-2xl font-bold mb-4 text-slate-800">
                        Reviews & Ratings
                      </h2>
                      <div className="space-y-4">
                        {/* Integrate your Ratingpage and Giverating components here */}
                        <div className="mt-8">
                          <Giverating eventId={event_id} userId={userId} />
                        </div>
                        <div className="mt-8">
                          <Ratingpage eventId={event_id} />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Similar Events Section */}
            {activeTab !== "reviews" && similarEvents.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">
                    You May Also Like
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className="rounded-full border-slate-200 hover:border-rose-200 hover:text-blue-600"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleNext}
                      disabled={
                        currentIndex >= similarEvents.length - visibleCards
                      }
                      className="rounded-full border-slate-200 hover:border-rose-200 hover:text-blue-600"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Suspense
                    fallback={
                      <>
                        {[...Array(3)].map((_, i) => (
                          <Card key={i} className="w-full h-[400px]">
                            <Skeleton className="h-[220px] w-full rounded-t-xl" />
                            <div className="p-5 space-y-3">
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                              <Skeleton className="h-4 w-2/3" />
                              <Skeleton className="h-12 w-full mt-4" />
                            </div>
                          </Card>
                        ))}
                      </>
                    }
                  >
                    {similarEvents
                      .slice(currentIndex, currentIndex + visibleCards)
                      .map((similarEvent) => (
                        <EventCard
                          key={similarEvent._id}
                          event={similarEvent}
                        />
                      ))}
                  </Suspense>
                </div>
              </motion.div>
            )}

            {/* City Events Section */}
            {activeTab !== "reviews" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-slate-800">
                  Similar events in {event?.venue?.city}
                </h2>
                <Suspense
                  fallback={
                    <div className="h-[300px] bg-slate-100 rounded-xl flex items-center justify-center">
                      <p>Loading city events...</p>
                    </div>
                  }
                >
                  {/* You would integrate your CityApp component here */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <CityApp city={event?.venue?.city} />
                  </div>
                </Suspense>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Countdown Timer */}
                <Card className="bg-gradient-to-br from-blue-500 to-pink-600 text-white mb-6 overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-center">
                      Event Starts In
                    </h3>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-2xl font-bold">
                          {countdown.days}
                        </div>
                        <div className="text-xs uppercase">Days</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-2xl font-bold">
                          {countdown.hours}
                        </div>
                        <div className="text-xs uppercase">Hours</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-2xl font-bold">
                          {countdown.minutes}
                        </div>
                        <div className="text-xs uppercase">Mins</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-2xl font-bold">
                          {countdown.seconds}
                        </div>
                        <div className="text-xs uppercase">Secs</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Card */}
                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4">
                    <h3 className="text-xl font-bold text-slate-800">
                      Book Your Tickets
                    </h3>
                    <p className="text-sm text-slate-600">
                      Secure your spot at this amazing event
                    </p>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Ticket className="h-5 w-5 text-rose-500" />
                          <div>
                            <p className="font-medium text-slate-800">
                              Standard Ticket
                            </p>
                            <p className="text-sm text-slate-500">
                              General admission
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-rose-600">
                          ₹{event?.ticketPrice}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-rose-500" />
                          <div>
                            <p className="font-medium text-slate-800">
                              Available Seats
                            </p>
                            <p className="text-sm text-slate-500">
                              Book before they're gone
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-600 border-green-200"
                        >
                          Available
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Star className="h-5 w-5 text-rose-500" />
                          <div>
                            <p className="font-medium text-slate-800">
                              Event Rating
                            </p>
                            <p className="text-sm text-slate-500">
                              Based on user reviews
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= 4
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-1 text-sm font-medium">4.0</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-800">Total Amount</span>
                      <span className="text-xl text-rose-600">
                        ₹{event?.ticketPrice}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
                        <GooglePaymentButton
                          price={event?.ticketPrice}
                          setPaymentDone={setPaymentDone}
                        >
                          <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white h-12 text-lg font-semibold">
                            Book Now
                          </Button>
                        </GooglePaymentButton>
                      </Suspense>

                      <div className="flex justify-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className={`rounded-full ${
                            isLiked
                              ? "text-rose-500 border-rose-200"
                              : "text-slate-400 border-slate-200"
                          }`}
                          onClick={() => setIsLiked(!isLiked)}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              isLiked ? "fill-rose-500" : ""
                            }`}
                          />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full text-slate-400 border-slate-200"
                        >
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Payment Success Component
function PaymentSuccess({ event, ticket }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-16 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2" />
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Payment Successful!</h1>
              <p className="text-slate-600 mt-2">Your ticket for {event?.title} has been booked successfully.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl text-left space-y-3 border border-slate-100">
              <div className="flex justify-between items-center pb-3 border-b border-dashed border-slate-200">
                <span className="text-sm text-slate-500">Ticket ID</span>
                <span className="font-mono font-medium text-slate-800">{ticket?._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Event</span>
                <span className="font-medium text-slate-800">{event?.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Date</span>
                <span className="font-medium text-slate-800">
                  {new Date(event?.start).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Time</span>
                <span className="font-medium text-slate-800">
                  {new Date(event?.start).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Venue</span>
                <span className="font-medium text-slate-800">{event?.venue?.name}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-200">
                <span className="text-sm text-slate-500">Amount Paid</span>
                <span className="font-bold text-green-600">₹{event?.ticketPrice}</span>
              </div>
            </div>

            <div className="pt-4">
              <div className="max-w-xs mx-auto bg-slate-800 p-3 rounded-lg mb-6">
                <div className="aspect-[4/1] bg-white flex items-center justify-center">
                  <div className="font-mono text-xs">TICKET-{ticket?._id?.slice(-12).toUpperCase()}</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" className="border-slate-200 hover:border-slate-300">
                  Download Ticket
                </Button>
                <Button onClick={() => navigate('/myticket')} className="bg-rose-500 hover:bg-rose-600 text-white">View My Bookings</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default EventDetails
