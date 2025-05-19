import { CheckCircle, Download, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import DownloadTicket from "./download-ticket";

export function PaymentSuccess({ event, ticket }) {
  const navigate = useNavigate();

  const handleDownloadTicket = () => {
    console.log("Download ticket clicked");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 text-white text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-white" />
          <h2 className="text-2xl font-bold">Payment Successful!</h2>
          <p className="text-sm opacity-90 mt-1">Your tickets are confirmed</p>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Order Date</span>
            <span className="font-medium">
              {new Date(ticket.createdAt).toLocaleDateString("en-GB")}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Transaction ID</span>
            <span className="font-medium">{ticket.paymentID}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Ticket ID</span>
            <span className="font-medium">{ticket._id}</span>
          </div>

          <Separator className="my-4" />

          <div className="flex gap-4 my-4">
            <img
              src={event?.imageUrl || "/placeholder.svg"}
              alt={event?.title}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div>
              <h3 className="font-bold">{event?.title}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(event?.start).toLocaleDateString("en-GB")}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {event?.venue?.name}, {event?.venue?.city}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg mt-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold">₹{event?.ticketPrice}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 p-6 pt-0">
          <Button
            onClick={handleDownloadTicket}
            variant="outline"
            className="w-full"
          >
            <DownloadTicket event={event} ticket={ticket}/>
          </Button>

          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <Button
              className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600"
              onClick={() => navigate("/myticket")}
            >
              View My Tickets
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
