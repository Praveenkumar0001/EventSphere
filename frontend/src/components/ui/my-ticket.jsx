import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Calendar, Clock, Loader2, Filter, Search, Tag, ArrowUpRight, Ticket } from "lucide-react"
import NavSidebar from "./HomeNavbarandSidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock ticket data to use when API fails or for development
const MOCK_TICKETS = [
  {
    _id: "t1",
    event: {
      _id: "e1",
      title: "Summer Music Festival 2025",
      genre: "Music",
      start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
      imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      ticketPrice: 2500,
      venue: {
        name: "Sunset Arena",
        city: "Mumbai",
        state: "Maharashtra"
      }
    }
  },
  {
    _id: "t2",
    event: {
      _id: "e2",
      title: "International Comedy Night",
      genre: "Comedy",
      start: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
      imageUrl: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
      ticketPrice: 1800,
      venue: {
        name: "Laugh Factory",
        city: "Delhi",
        state: "Delhi"
      }
    }
  },
  {
    _id: "t3",
    event: {
      _id: "e3",
      title: "Tech Conference 2025",
      genre: "Conference",
      start: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      end: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(), // 1 day later
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      ticketPrice: 5000,
      venue: {
        name: "Convention Center",
        city: "Bangalore",
        state: "Karnataka"
      }
    }
  },
  {
    _id: "t4",
    event: {
      _id: "e4",
      title: "Classical Dance Performance",
      genre: "Dance",
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      end: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
      imageUrl: "https://images.unsplash.com/photo-1535525153412-5a0efadc2d6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      ticketPrice: 1200,
      venue: {
        name: "Cultural Center",
        city: "Chennai",
        state: "Tamil Nadu"
      }
    }
  },
  {
    _id: "t5",
    event: {
      _id: "e5",
      title: "Food & Wine Festival",
      genre: "Food",
      start: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
      end: new Date(Date.now() - 59 * 24 * 60 * 60 * 1000).toISOString(), // 1 day later
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      ticketPrice: 3000,
      venue: {
        name: "Waterfront Park",
        city: "Hyderabad",
        state: "Telangana"
      }
    }
  },
  {
    _id: "t6",
    event: {
      _id: "e6",
      title: "Weekend Adventure Camp",
      genre: "Outdoors",
      start: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
      end: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(), // 2 days later
      imageUrl: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=971&q=80",
      ticketPrice: 4500,
      venue: {
        name: "Mountain Trails",
        city: "Manali",
        state: "Himachal Pradesh"
      }
    }
  }
];

export default function MyBooking() {
  const navigate = useNavigate();
  const [bookedEvents, setBookedEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isHoveredId, setIsHoveredId] = useState(null)
  const [useMockData, setUseMockData] = useState(false)
  const [error, setError] = useState(null)

  const userDataString = localStorage.getItem("user")
  let userID

  if (userDataString) {
    try {
      const userData = JSON.parse(userDataString)
      userID = userData._id
    } catch (e) {
      console.error("Error parsing user data from localStorage", e)
    }
  }

  // Fetch booked events from API or use mock data
  useEffect(() => {
    const fetchBookedEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Simulating network request with a timeout for better UX
        setTimeout(async () => {
          try {
            if (!userID) {
              throw new Error("User ID not found")
            }
            
            const response = await fetch("http://localhost:3002/api/ticket/myBookedEvents", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ userID })
            });
            
            const data = await response.json();
            
            if (data.success) {
              setBookedEvents(data.tickets)
            } else {
              throw new Error(data.message || "Failed to fetch booked events")
            }
          } catch (error) {
            console.error("Error fetching booked events:", error)
            setError("Couldn't connect to the server. Showing sample tickets instead.")
            setUseMockData(true)
            setBookedEvents(MOCK_TICKETS)
          } finally {
            setLoading(false)
          }
        }, 1200)
      } catch (error) {
        console.error("Error in fetch setup:", error)
        setLoading(false)
        setError("Something went wrong. Showing sample tickets instead.")
        setUseMockData(true)
        setBookedEvents(MOCK_TICKETS)
      }
    }

    fetchBookedEvents()
  }, [userID])

  const now = new Date()

  // Filter events
  const filterEvents = (events) => {
    return events.filter(ticket => {
      const matchesSearch = 
        ticket.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.event.venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.event.venue.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedFilter === "all") return matchesSearch;
      return matchesSearch && ticket.event.genre?.toLowerCase() === selectedFilter.toLowerCase();
    });
  }

  // Get unique genres for filter dropdown
  const genres = [...new Set(bookedEvents.map(ticket => ticket.event.genre).filter(Boolean))];

  const upcomingEvents = bookedEvents.filter((ticket) => new Date(ticket.event.start) > now)
  const pastEvents = bookedEvents.filter((ticket) => new Date(ticket.event.start) <= now)

  const filteredUpcomingEvents = filterEvents(upcomingEvents).sort(
    (a, b) => new Date(a.event.start).getTime() - new Date(b.event.start).getTime()
  )
  
  const filteredPastEvents = filterEvents(pastEvents).sort(
    (a, b) => new Date(b.event.start).getTime() - new Date(a.event.start).getTime()
  )

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-background to-background/80">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Ticket className="h-12 w-12 text-primary" />
          </motion.div>
          <p className="text-lg font-medium text-primary">Loading your tickets...</p>
          <p className="text-sm text-muted-foreground">Getting your amazing events ready</p>
        </motion.div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeLeft = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(start - now);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    } else {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} left`;
    }
  }

  const handleNavigate = (id) => {
    console.log("Navigating to ticket booking with id:", id);
    navigate(`/ticketbooking/${id}`);
  };

  const TicketCard = ({ ticket, handleNavigate }) => {
    const isHovered = isHoveredId === ticket._id;
    const isUpcoming = new Date(ticket.event.start) > now;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHoveredId(ticket._id)}
        onMouseLeave={() => setIsHoveredId(null)}
      >
        <Card
          className="overflow-hidden transition-all hover:shadow-lg cursor-pointer border-2 group"
          onClick={() => handleNavigate(ticket.event._id)}
          style={{ 
            borderColor: isHovered ? 'var(--primary)' : 'transparent',
            transform: isHovered ? 'translateY(-4px)' : 'none',
            transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
          }}
        >
          <div className="flex flex-col md:flex-row">
            <div className="relative h-48 md:h-64 w-full md:w-2/5 overflow-hidden">
              <img
                src={ticket.event.imageUrl || "/placeholder.svg"}
                alt={ticket.event.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
              <Badge className="absolute left-3 top-3 text-xs font-bold px-3 py-1" 
                variant={isUpcoming ? "default" : "secondary"}>
                {ticket.event.genre || "EVENT"}
              </Badge>
              
              {isUpcoming && (
                <Badge className="absolute right-3 top-3 bg-green-500/80 hover:bg-green-500 text-white border-0">
                  {getTimeLeft(ticket.event.start)}
                </Badge>
              )}
            </div>
            
            <div className="flex flex-1 flex-col p-6 relative">
              {isHovered && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute right-4 top-4"
                >
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </motion.div>
              )}
              
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-xl font-bold text-primary line-clamp-2">
                  {ticket.event.title}
                </CardTitle>
                <CardDescription>
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      {ticket.event.venue.name}, {ticket.event.venue.city},{" "}
                      {ticket.event.venue.state}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="grid gap-4 p-0">
                <div className="grid gap-3 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">Date:</span>{" "}
                    <span className="text-muted-foreground">{formatDate(ticket.event.start)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">Time:</span>{" "}
                    <span className="text-muted-foreground">
                      {formatTime(ticket.event.start)} - {formatTime(ticket.event.end)}
                    </span>
                  </div>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Amount Paid
                  </span>
                  <span className="text-lg font-bold text-primary">
                    ₹{ticket.event.ticketPrice}
                  </span>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  const EmptyState = ({ message }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center"
    >
      <div className="rounded-full bg-muted/30 p-6 mb-4">
        <Calendar className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-xl font-medium">No tickets found</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">{message}</p>
      <Button 
        variant="outline" 
        className="mt-6"
        onClick={() => navigate('/events')}
      >
        Browse Events
      </Button>
    </motion.div>
  )

  return (
    <div className="container mx-auto p-4 md:p-8">
      <NavSidebar />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-5xl py-16"
      >
        <div className="flex flex-col items-center justify-center mb-10">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Ticket className="h-12 w-12 text-primary mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            My Tickets
          </h1>
          <p className="text-muted-foreground mt-2 text-center max-w-lg">
            View and manage all your upcoming and past event bookings in one place
          </p>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-4 rounded-md bg-amber-50 border border-amber-200 text-amber-700 max-w-lg"
            >
              <p className="text-sm font-medium">{error}</p>
              {useMockData && (
                <p className="text-xs mt-1">
                  These are sample tickets for demonstration. Real tickets will be shown when connected to the server.
                </p>
              )}
            </motion.div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by event or venue name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <Filter className="h-4 w-4" />
                <span>{selectedFilter === "all" ? "All Categories" : selectedFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedFilter("all")}>
                All Categories
              </DropdownMenuItem>
              {genres.map(genre => (
                <DropdownMenuItem 
                  key={genre} 
                  onClick={() => setSelectedFilter(genre)}
                >
                  {genre}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs 
          defaultValue="upcoming" 
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-8 grid w-full grid-cols-2">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Upcoming Events {filteredUpcomingEvents.length > 0 && `(${filteredUpcomingEvents.length})`}
            </TabsTrigger>
            <TabsTrigger value="previous" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Previous Events {filteredPastEvents.length > 0 && `(${filteredPastEvents.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <AnimatePresence>
              {filteredUpcomingEvents.length > 0 ? (
                filteredUpcomingEvents.map((ticket) => (
                  <TicketCard 
                    key={ticket._id} 
                    ticket={ticket} 
                    handleNavigate={handleNavigate} 
                  />
                ))
              ) : (
                <EmptyState 
                  message={searchTerm ? "No upcoming events match your search. Try different keywords or clear the filter." : "You don't have any upcoming events. Browse events to book tickets."} 
                />
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="previous" className="space-y-6">
            <AnimatePresence>
              {filteredPastEvents.length > 0 ? (
                filteredPastEvents.map((ticket) => (
                  <TicketCard 
                    key={ticket._id} 
                    ticket={ticket} 
                    handleNavigate={handleNavigate}
                  />
                ))
              ) : (
                <EmptyState 
                  message={searchTerm ? "No previous events match your search. Try different keywords or clear the filter." : "You don't have any past events."} 
                />
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
        
        {/* Quick actions section */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => navigate('/events')}
              className="flex gap-2 items-center justify-center p-6 h-auto flex-col"
            >
              <Ticket className="h-6 w-6 mb-2" />
              <span>Browse Events</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/profile')}
              variant="outline"
              className="flex gap-2 items-center justify-center p-6 h-auto flex-col"
            >
              <Tag className="h-6 w-6 mb-2" />
              <span>Manage Profile</span>
            </Button>
            
            <Button 
              onClick={() => {
                // For demo purposes, we'll use the mock data
                setBookedEvents(MOCK_TICKETS)
                setUseMockData(true)
                setError("Demo mode activated. Showing sample tickets.")
              }}
              variant="secondary"
              className="flex gap-2 items-center justify-center p-6 h-auto flex-col"
            >
              <Calendar className="h-6 w-6 mb-2" />
              <span>View Sample Tickets</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}