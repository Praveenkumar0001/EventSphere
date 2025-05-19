import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function EventCard({ event, className }) {
  // Format date and time
  const eventDate = new Date(event.start).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  const eventTime = new Date(event.start).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  })

  return (
    <Link to={`/ticketbooking/${event._id}`} className={cn("block", className)}>
      <Card className="overflow-hidden w-full max-w-[340px] h-full rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-0">
        {/* Image Section with Gradient Overlay */}
        <div className="relative h-[220px] overflow-hidden">
          <img
            src={event.imageUrl || "/placeholder.svg?height=220&width=340"}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <Badge className="absolute top-3 left-3 bg-rose-500 hover:bg-rose-600 text-white border-0">
            {event.title || "SPORTS"}
          </Badge>
        </div>

        {/* Content Section */}
        <CardContent className="p-5">
          <h3 className="text-xl font-bold mb-3 line-clamp-1">{event.venue.name}</h3>
          <div className="space-y-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-rose-500" />
              <span className="text-sm">
                {eventDate}, {eventTime} onwards
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-500" />
              <span className="text-sm line-clamp-1">
                {event.venue.city || "Location not available"},{event.venue.state || ""}
              </span>
            </div>
          </div>
        </CardContent>

        {/* Footer Section */}
        <CardFooter className="px-5 pb-5 pt-0">
          <div className="flex justify-between items-center w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <span className="font-bold">
              ₹{event.ticketPrice} <span className="text-xs font-normal text-muted-foreground">ONWARDS</span>
            </span>
            <div className="flex items-center text-rose-500 font-medium">
              BUY NOW
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
