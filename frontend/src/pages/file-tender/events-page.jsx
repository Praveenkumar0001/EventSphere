import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { CalendarIcon, MapPinIcon, PhoneIcon, TagIcon, TicketIcon, SearchIcon, ClockIcon, SendIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import NavSidebar from "@/components/ui/HomeNavbarandSidebar"
import axios from "axios"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import GooglePaymentButton from "@/components/ui/google-payment-button"
import { useUser } from "@/context/userContext"

const fetchEvents = async () => {
  try {
    const response = await axios.post("http://localhost:3002/api/tender/getEmptyEvent");
    if (response.data.success) {
      return response.data.data;
    } else {
      console.error("Failed to fetch booked events");
    }
  } catch (error) {
    console.error("Error fetching booked events:", error);
  }
}


export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeGenre, setActiveGenre] = useState("all")
  const [sortBy, setSortBy] = useState("date-asc")
  const [paymentDone, setPaymentDone] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  
  const userDataString = localStorage.getItem("user");
  let userId;

  if (userDataString) {
    const userData = JSON.parse(userDataString);
    userId = userData._id;
  }

  const navigate = useNavigate()

  useEffect(() => {
    console.log(paymentDone, 'paymentDone')
  }, [paymentDone])

  useEffect(() => {
    if (paymentDone && selectedEvent) {
      const handleTender = async () => {
        try {
          console.log(selectedEvent, userId, 'hey tehere');
          const response = await axios.post("http://localhost:3002/api/tender/allotTender", {
            eventID: selectedEvent,
            userID: userId
          });
          console.log("Tender submission response:", response.data);
          navigate('/my-tenders');
        } catch (err) {
          console.error("Tender submission failed:", err);
        } finally {
          setPaymentDone(false);
          setSelectedEvent(null);
        }
      };
  
      handleTender();
    }
  }, [paymentDone, selectedEvent, userId]);
  

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents()
        setEvents(data)
        setFilteredEvents(data)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setLoading(false)
      }
    }

    getEvents()
  }, [])

  useEffect(() => {
    let result = [...events]

    if (activeGenre !== "all") {
      result = result.filter((event) => event.genre.toLowerCase() === activeGenre.toLowerCase())
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.venue.name.toLowerCase().includes(query),
      )
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.start).getTime() - new Date(b.start).getTime()
        case "date-desc":
          return new Date(b.start).getTime() - new Date(a.start).getTime()
        case "price-asc":
          return a.ticketPrice - b.ticketPrice
        case "price-desc":
          return b.ticketPrice - a.ticketPrice
        default:
          return 0
      }
    })

    setFilteredEvents(result)
  }, [events, activeGenre, searchQuery, sortBy])

  const genres = ["all", ...new Set(events?.map((event) => event.genre.toLowerCase()))]

  return (
    <div className="container mx-auto px-4 py-8">
      <NavSidebar />
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8 mt-20">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Available Events
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse and submit tenders for upcoming events
          </p>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-asc">Date (Earliest first)</SelectItem>
              <SelectItem value="date-desc">Date (Latest first)</SelectItem>
              <SelectItem value="price-asc">Price (Low to high)</SelectItem>
              <SelectItem value="price-desc">Price (High to low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeGenre}
        onValueChange={setActiveGenre}
        className="mb-8"
      >
        <TabsList className="mb-4 flex flex-wrap h-auto">
          {genres.map((genre) => (
            <TabsTrigger key={genre} value={genre} className="capitalize">
              {genre === "all" ? "All Events" : genre}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeGenre} className="mt-0">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-[200px] w-full" />
                  <CardHeader className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredEvents?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents?.map((event) => (
                <Card
                  key={event._id}
                  className="overflow-hidden flex flex-col h-full pt-0"
                >
                  <div className="relative h-[230px] overflow-hidden">
                    <img
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                    <Badge className="absolute top-3 right-3 bg-primary/90 hover:bg-primary">
                      ₹{event.ticketPrice}
                    </Badge>
                  </div>

                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="w-full text-xl flex justify-between">
                        <span>{event.title}</span>
                        <span>₹ {event.venue.price}</span>
                      </CardTitle>
                    </div>
                    <CardDescription className="flex items-center mt-1">
                      <div className="flex items-center ">
                        <MapPinIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                        {event.venue.name}, {event.venue.city}
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4 pt-0 flex-grow">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>
                        {format(new Date(event.start), "MMM d, yyyy")}
                      </span>
                      <ClockIcon className="h-4 w-4 ml-3 mr-1" />
                      <span>
                        {format(new Date(event.start), "h:mm a")} -{" "}
                        {format(new Date(event.end), "h:mm a")}
                      </span>
                    </div>

                    <p className="text-sm line-clamp-3 mb-3">
                      {event.description}
                    </p>

                    <div className="flex justify-between items-center text-sm text-muted-foreground mt-5">
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        <span>{event.contactNo}</span>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {event.genre}
                      </Badge>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>{event.title}</DialogTitle>
                          <DialogDescription>
                            Organized by {event.user.name}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                          <img
                            src={event.imageUrl || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-[250px] object-cover rounded-md"
                          />

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>
                                {format(new Date(event.start), "MMMM d, yyyy")}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>
                                {format(new Date(event.start), "h:mm a")} -{" "}
                                {format(new Date(event.end), "h:mm a")}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>
                                {event.venue.name}, {event.venue.city}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <PhoneIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{event.contactNo}</span>
                            </div>
                            <div className="flex items-center">
                              <TagIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{event.genre}</span>
                            </div>
                            <div className="flex items-center">
                              <TicketIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>₹{event.ticketPrice}</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-sm text-muted-foreground">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button onClick={() => setSelectedEvent(event._id)}>
                          <SendIcon className="mr-2 h-4 w-4" />
                          Submit Tender
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Confirm Tender Submission
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            You are about to proceed with a payment of{" "}
                            <span className="font-bold">₹{event.venue.price}</span>. Once
                            the payment is successful, the tender will be
                            submitted. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <GooglePaymentButton
                            price={event.venue.price}
                            setPaymentDone={setPaymentDone}
                          />
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
