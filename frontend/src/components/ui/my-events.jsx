import React, { useEffect, useState } from "react";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Loader2, 
  ChevronRight, 
  Sparkles, 
  Timer, 
  Search,
  Filter,
  Tag,
  Bookmark,
  Heart,
  Share2,
  Music,
  Star,
  Flame,
  TrendingUp,
  Users,
  Calendar as CalendarIcon,
  RefreshCcw,
  Gift
} from "lucide-react";
import NavSidebar from "./HomeNavbarandSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function MyEvents() {
  const navigate = useNavigate();
  const [bookedEvents, setBookedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [activeView, setActiveView] = useState("upcoming");
  const [showFilters, setShowFilters] = useState(false);
  const [savedEvents, setSavedEvents] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list view
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const userDataString = localStorage.getItem("user");
  let userID;

  if (userDataString) {
    const userData = JSON.parse(userDataString);
    userID = userData._id;
  }

  useEffect(() => {
    const fetchBookedEvents = async () => {
      try {
        setLoading(true);
        // Simulating a longer load for animation demo purposes
        setTimeout(async () => {
          try {
            const response = await fetch("http://localhost:3002/api/event/getListedEventsByUser", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userID }),
            });
            
            const data = await response.json();
            if (data.success) {
              setBookedEvents(data.events);
              // Initialize saved events with empty array
              setSavedEvents(localStorage.getItem("savedEvents") ? 
                JSON.parse(localStorage.getItem("savedEvents")) : []);
              
              // Show confetti if user has upcoming events
              if (data.events.filter(event => new Date(event.start) > new Date()).length > 0) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
              }
            } else {
              console.error("Failed to fetch booked events");
            }
          } catch (error) {
            console.error("Error fetching booked events:", error);
          } finally {
            setLoading(false);
          }
        }, 1000);
      } catch (error) {
        console.error("Error in fetch wrapper:", error);
        setLoading(false);
      }
    };

    fetchBookedEvents();
  }, [userID]);

  // Move to next featured event every 5 seconds
  useEffect(() => {
    if (upcomingEvents.length > 1) {
      const interval = setInterval(() => {
        setCurrentEventIndex((prevIndex) => 
          prevIndex === upcomingEvents.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [bookedEvents]);

  const now = new Date();

  const filteredEvents = bookedEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterGenre === "" || event.genre === filterGenre)
  );

  const upcomingEvents = filteredEvents.filter((event) => new Date(event.start) > now);
  const pastEvents = filteredEvents.filter((event) => new Date(event.start) <= now);

  const sortedUpcomingEvents = upcomingEvents.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
  const sortedPastEvents = pastEvents.sort(
    (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
  );

  const uniqueGenres = [...new Set(bookedEvents.map(event => event.genre).filter(Boolean))];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysUntilEvent = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(eventDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleNavigate = (id) => {
    console.log("Navigating to ticket booking with id:", id);
    navigate(`/ticketbooking/${id}`);
  };

  const toggleSaveEvent = (eventId) => {
    const updatedSavedEvents = savedEvents.includes(eventId)
      ? savedEvents.filter(id => id !== eventId)
      : [...savedEvents, eventId];
    
    setSavedEvents(updatedSavedEvents);
    localStorage.setItem("savedEvents", JSON.stringify(updatedSavedEvents));
  };

  const shareEvent = (event) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title} at ${event.venue.name}`,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      alert(`Share this event: ${event.title} at ${event.venue.name}`);
    }
  };

  // Event card for grid view
  const GridTicketCard = ({ event, handleNavigate }) => {
    const daysUntil = getDaysUntilEvent(event.start);
    const isUpcoming = new Date(event.start) > now;
    const isSaved = savedEvents.includes(event._id);
    
    // Determine if the event is soon (less than 3 days away)
    const isSoon = isUpcoming && daysUntil <= 3;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        className="h-full"
      >
        <Card
          className="overflow-hidden transition-all hover:shadow-lg border-l-4 relative h-full flex flex-col"
          style={{ borderLeftColor: isSoon ? '#ef4444' : isUpcoming ? '#0ea5e9' : '#64748b' }}
        >
          <div className="relative">
            <img
              src={event.imageUrl || "https://source.unsplash.com/random/800x600/?concert"}
              alt={event.title}
              className="h-48 w-full object-cover transition-transform hover:scale-105"
            />
            <Badge className="absolute left-3 top-3" variant={isSoon ? "destructive" : isUpcoming ? "default" : "secondary"}>
              {event.genre || "EVENT"}
            </Badge>
            {isUpcoming && (
              <div className="absolute right-3 top-3 bg-black/70 text-white p-2 rounded-full flex items-center gap-1">
                <Timer className="h-4 w-4" />
                <span className="text-xs font-bold">{daysUntil} days</span>
              </div>
            )}
            {isSoon && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-red-500/20 to-transparent"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          <div className="flex flex-1 flex-col p-4">
            <CardHeader className="p-0 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold text-primary truncate">
                  {event.title}
                </CardTitle>
              </div>
              <CardDescription>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{event.venue.name}, {event.venue.city}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 p-0 flex-1 pt-2">
              <div className="grid gap-1">
                <div className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  {formatDate(event.start)}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {formatTime(event.start)}
                </div>
              </div>
              
              <div className="mt-auto">
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Amount Paid
                  </span>
                  <span className="text-sm font-bold text-primary">
                    ₹{event.ticketPrice}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveEvent(event._id);
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                    />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      shareEvent(event);
                    }}
                  >
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button 
                    className="flex-1 h-8 text-xs gap-1"
                    variant={isUpcoming ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigate(event._id);
                    }}
                  >
                    View
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    );
  };

  // Event card for list view
  const ListTicketCard = ({ event, handleNavigate }) => {
    const daysUntil = getDaysUntilEvent(event.start);
    const isUpcoming = new Date(event.start) > now;
    const isSaved = savedEvents.includes(event._id);
    const isSoon = isUpcoming && daysUntil <= 3;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.01 }}
      >
        <Card
          className="overflow-hidden transition-all hover:shadow-lg border-l-4 relative"
          style={{ borderLeftColor: isSoon ? '#ef4444' : isUpcoming ? '#0ea5e9' : '#64748b' }}
        >
          <div className="flex flex-col md:flex-row">
            <div className="relative h-60 w-full md:h-auto md:w-2/5">
              <img
                src={event.imageUrl || "https://source.unsplash.com/random/800x600/?concert"}
                alt={event.title}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
              <Badge className="absolute left-3 top-3" variant={isSoon ? "destructive" : isUpcoming ? "default" : "secondary"}>
                {event.genre || "EVENT"}
              </Badge>
              {isUpcoming && (
                <div className="absolute right-3 top-3 bg-black/70 text-white p-2 rounded-full flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  <span className="text-xs font-bold">{daysUntil} days</span>
                </div>
              )}
              {isSoon && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-red-500/20 to-transparent"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <CardHeader className="p-0 pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold text-primary">
                    {event.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveEvent(event._id);
                      }}
                    >
                      <Heart 
                        className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                      />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        shareEvent(event);
                      }}
                    >
                      <Share2 className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {event.venue.name}, {event.venue.city}, {event.venue.state}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 p-0">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Date:</span>{" "}
                    {formatDate(event.start)}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Time:</span>{" "}
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Amount Paid
                  </span>
                  <span className="text-lg font-bold text-primary">
                    ₹{event.ticketPrice}
                  </span>
                </div>
                <Button 
                  className="mt-2 w-full gap-2"
                  variant={isUpcoming ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(event._id);
                  }}
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const FeaturedEventCard = ({ event }) => {
    if (!event) return null;
    
    const daysUntil = getDaysUntilEvent(event.start);
    const isUpcoming = new Date(event.start) > now;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-xl mb-8"
      >
        <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden">
          <img
            src={event.imageUrl || "https://source.unsplash.com/random/1200x600/?concert"}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-6 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge variant="default" className="mb-2 bg-primary">Coming Up!</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{event.title}</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4" />
                {formatDate(event.start)}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="h-4 w-4" />
                {event.venue.name}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Timer className="h-4 w-4" />
                {daysUntil} days to go
              </div>
            </div>
            <Button 
              onClick={() => handleNavigate(event._id)}
              className="gap-2 bg-primary hover:bg-primary/90"
              size="sm"
            >
              View Details
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
          
          {/* Pagination dots */}
          {upcomingEvents.length > 1 && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              {upcomingEvents.map((_, index) => (
                <button 
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentEventIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                  onClick={() => setCurrentEventIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const EventStats = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/50">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <CalendarIcon className="h-8 w-8 text-blue-500 mb-2" />
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{upcomingEvents.length}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Upcoming Events</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800/50">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <RefreshCcw className="h-8 w-8 text-purple-500 mb-2" />
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{pastEvents.length}</p>
            <p className="text-xs text-purple-600 dark:text-purple-400">Past Events</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800/50">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Tag className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{uniqueGenres.length}</p>
            <p className="text-xs text-green-600 dark:text-green-400">Genres Explored</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800/50">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Gift className="h-8 w-8 text-amber-500 mb-2" />
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {bookedEvents.reduce((sum, event) => sum + (parseInt(event.ticketPrice) || 0), 0)}₹
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Total Spent</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const EmptyState = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center"
    >
      <Calendar className="mb-3 h-16 w-16 text-muted-foreground opacity-50" />
      <h3 className="mb-2 text-xl font-medium">No events found</h3>
      <p className="text-sm text-muted-foreground mb-6">{message}</p>
      <Button
        onClick={() => navigate("/events")}
        className="gap-2"
      >
        <Sparkles className="h-4 w-4" />
        Discover Events
      </Button>
    </motion.div>
  );

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-64">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="h-12 w-12 text-primary" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-muted-foreground"
      >
        Loading your amazing events...
      </motion.p>
    </div>
  );

  // Confetti animation component
  const Confetti = ({ show }) => {
    if (!show) return null;
    
    const confettiCount = 50;
    const confettiItems = Array.from({ length: confettiCount });
    
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {confettiItems.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            initial={{
              top: "-10%",
              left: `${Math.random() * 100}%`,
              backgroundColor: [
                "#FF4136", "#0074D9", "#2ECC40", "#FFDC00", "#B10DC9", "#FF851B", "#39CCCC"
              ][Math.floor(Math.random() * 7)],
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              top: "110%",
              rotate: Math.random() * 720 - 360,
              x: Math.random() * 200 - 100,
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <NavSidebar />
        <div className="mx-auto max-w-6xl py-16">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 md:p-8">
        <NavSidebar />

        <Confetti show={showConfetti} />

        <div className="mx-auto max-w-6xl py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-6 text-center text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              My Event Collection
            </h1>
            
            {upcomingEvents.length > 0 && (
              <AnimatePresence mode="wait">
                <FeaturedEventCard 
                  key={upcomingEvents[currentEventIndex]?._id || 'featured'} 
                  event={upcomingEvents[currentEventIndex]} 
                />
              </AnimatePresence>
            )}
            
            <EventStats />
            
            <Alert className="mb-6 relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-blue-900/40 border-l-4 border border-blue-300 dark:border-blue-700 dark:border-l-blue-500 p-4 rounded-lg shadow-md">
  {/* Decorative background elements */}
  <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-blue-100/50 dark:bg-blue-700/20"></div>
  <div className="absolute -left-6 -bottom-6 w-16 h-16 rounded-full bg-indigo-100/50 dark:bg-indigo-700/20"></div>
  
  <div className="relative flex items-center justify-between">
    <div className="flex gap-3 items-center">
      <div className="p-2 bg-blue-100 dark:bg-blue-800/60 rounded-full">
        <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-300" />
      </div>
      <div>
        <h3 className="font-semibold text-blue-800 dark:text-blue-200">
          {`You have ${upcomingEvents.length} upcoming ${upcomingEvents.length === 1 ? "event" : "events"}`}
        </h3>
        <p className="text-sm text-blue-700/80 dark:text-blue-300/80 mt-0.5">
          {upcomingEvents.length > 0 ? "Get ready for an amazing time!" : "Browse new events to join the fun!"}
        </p>
      </div>
    </div>
    {upcomingEvents.length > 0 ? (
      <button className="flex items-center gap-1 text-white hover:text-white dark:text-blue-100 dark:hover:text-white text-sm font-medium px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-500 dark:hover:to-indigo-600 transition-all shadow-sm hover:shadow">
        View All
        <svg className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    ) : (
      <button className="flex items-center gap-1 text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 text-sm font-medium px-4 py-2 rounded-md bg-white/80 hover:bg-white dark:bg-blue-900/50 dark:hover:bg-blue-800/60 transition-all border border-blue-200 dark:border-blue-700 shadow-sm">
        Discover
        <svg className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </button>
    )}
  </div>
  
  {/* Visual indicator of event count */}
  {upcomingEvents.length > 0 && (
    <div className="relative mt-3 pt-3 border-t border-blue-200 dark:border-blue-700/70">
      <div className="flex items-center">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div 
            className={`bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 h-1.5 rounded-full`}
            style={{ width: `${Math.min(upcomingEvents.length * 10, 100)}%` }}
          ></div>
        </div>
        <span className="ml-2 text-xs font-medium text-blue-700 dark:text-blue-300">{upcomingEvents.length}</span>
      </div>
    </div>
  )}
</Alert>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search your events..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <div className="flex rounded-md border">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-l-md rounded-r-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                      <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                      <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                      <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                    </div>
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-r-md rounded-l-none"
                    onClick={() => setViewMode("list")}
                  >
                    <div className="flex flex-col space-y-0.5">
                      <div className="h-0.5 w-4 bg-current"></div>
                      <div className="h-0.5 w-4 bg-current"></div>
                      <div className="h-0.5 w-4 bg-current"></div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="bg-card p-4 rounded-lg border shadow-sm">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Filter by Genre
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      className={`cursor-pointer ${filterGenre === "" ? "bg-primary" : "bg-secondary hover:bg-primary/80"}`}
                      onClick={() => setFilterGenre("")}
                    >
                      All
                    </Badge>
                    {uniqueGenres.map((genre) => (
                      <Badge
                        key={genre}
                        className={`cursor-pointer ${
                          filterGenre === genre ? "bg-primary" : "bg-secondary hover:bg-primary/80"
                        }`}
                        onClick={() => setFilterGenre(genre)}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          <Tabs 
            value={activeView} 
            onValueChange={setActiveView} 
            className="w-full"
          >
            <TabsList className="mb-8 grid w-full grid-cols-2 p-1">
              <TabsTrigger 
                value="upcoming"
                className={activeView === "upcoming" ? "bg-primary text-primary-foreground text-black-800" : ""}
              >
                Upcoming Events ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger 
                value="previous"
                className={activeView === "previous" ? "bg-primary text-primary-foreground text-black-800" : ""}
              >
                Previous Events ({pastEvents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
              {sortedUpcomingEvents.length > 0 ? (
                sortedUpcomingEvents.map((event) => (
                  viewMode === "grid" ? (
                    <GridTicketCard
                      key={event._id}
                      event={event}
                      handleNavigate={handleNavigate}
                    />
                  ) : (
                    <ListTicketCard
                      key={event._id}
                      event={event}
                      handleNavigate={handleNavigate}
                    />
                  )
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState message="You don't have any upcoming events. Browse events to book tickets." />
                </div>
              )}
            </TabsContent>

            <TabsContent value="previous" className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
              {sortedPastEvents.length > 0 ? (
                sortedPastEvents.map((event) => (
                  viewMode === "grid" ? (
                    <GridTicketCard
                      key={event._id}
                      event={event}
                      handleNavigate={handleNavigate}
                    />
                  ) : (
                    <ListTicketCard
                      key={event._id}
                      event={event}
                      handleNavigate={handleNavigate}
                    />
                  )
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState message="You haven't attended any events yet." />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default MyEvents;