import { Calendar, Clock, Download, MapPin, Pencil, QrCode } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import html2pdf from "html2pdf.js";
import { format, parseISO } from "date-fns";

const DownloadTicket = ({ event, ticket }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async () => {
    try {
      await downloadPdf();
      setIsOpen(false);
    } catch (error) {
      console.error("PDF download failed:", error);
    }
  };

  const downloadPdf = async () => {
    const element = document.querySelector("#pdf");
    if (!element) {
      console.error("PDF element not found");
      return;
    }

    await html2pdf()
      .from(element)
      .set({
        margin: 0,
        filename: `ticket_pdf`,
        jsPDF: { format: "a4", orientation: "portrait" },
      })
      .save();
  };

  const [isHovering, setIsHovering] = useState(false)

  const handleDownloadTicket = () => {
    console.log("Download ticket clicked")
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Pencil />
          <span className="ml-2"> Download Student Profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col p-4 max-w-[900px] h-[90vh]  overflow-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle> Preview of Student Profile</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="w-full h-full overflow-scroll">
          {/* A4 dimensions in mm are approximately 210 x 297, 
              Convert to pixels (at 96 DPI): 210mm = 793px and 297mm = 1123px */}
          <div
            id="pdf"
            className="w-[794px] h-[1122px] m-0 p-0 box-border origin-top flex justify-center items-center  bg-[url('/watermark.png')] bg-center bg-contain bg-no-repeat"
          >
            <Card
              // className={cn(
              //   "w-full max-w-md overflow-hidden bg-white transition-all duration-300",
              //   isHovering && "shadow-lg",
              //   className
              // )}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Top section with event image */}
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img
                  src={
                    event?.imageUrl || "/placeholder.svg?height=160&width=400"
                  }
                  alt={event?.title}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{ transform: isHovering ? "scale(1.05)" : "scale(1)" }}
                />
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h2 className="text-xl font-bold">{event?.title}</h2>
                  <div className="flex items-center text-sm mt-1 text-white/90">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(event?.start)}
                  </div>
                </div>
              </div>

              {/* Ticket tear effect */}
              <div className="relative">
                <div className="absolute left-0 right-0 h-4 flex justify-between items-center px-2">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-gray-200" />
                  ))}
                </div>
              </div>

              {/* Ticket details */}
              <div className="p-5 pt-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(event?.start)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event?.venue?.name}, {event?.venue?.city}
                    </div>
                  </div>

                  <div className="bg-primary/10 rounded-lg p-2 text-center min-w-[80px]">
                    <div className="text-xs text-gray-500">Price</div>
                    <div className="font-bold text-primary">
                      ₹{event?.ticketPrice}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Ticket ID</div>
                    <div className="font-medium text-sm truncate">
                      {ticket._id}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Order Date</div>
                    <div className="font-medium text-sm">
                      {formatDate(ticket.createdAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Transaction ID</div>
                    <div className="font-medium text-sm truncate">
                      {ticket.paymentID}
                    </div>
                  </div>
                  {ticket.seatNumber && (
                    <div>
                      <div className="text-xs text-gray-500">Seat</div>
                      <div className="font-medium text-sm">
                        {ticket.seatNumber}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex-shrink-0 mr-4">
                    <QrCode className="w-24 h-24 text-gray-800" />
                  </div>
                  <div className="flex-1">
                    <Button
                      onClick={handleDownloadTicket}
                      className="w-full mb-2 bg-primary hover:bg-primary/90"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Ticket
                    </Button>
                    <div className="text-xs text-center text-gray-500">
                      Present this ticket at the venue entrance
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <DialogFooter className="w-full flex justify-center items-center">
          <Button type="button" onClick={handleClick}>
            Download Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadTicket;
