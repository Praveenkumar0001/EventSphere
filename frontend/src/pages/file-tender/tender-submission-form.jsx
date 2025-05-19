import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { ArrowLeft, CalendarIcon, MapPinIcon, SendIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"

const fetchEvent = async (id) => {
  try {
    console.log('id', id);
    const response = await axios.get(`http://localhost:3002/api/event/get-event-by-id/${id}`);
    if (response.data.success) {
      console.log(response.data.event, 'single-event');
      return response.data.event;
    } else {
      console.error("Failed to fetch booked events");
    }
  } catch (error) {
    console.error("Error fetching booked events:", error);
  }

  // Mock data for demonstration
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve({
  //       _id: id,
  //       title: "Summer Music Festival",
  //       genre: "Music",
  //       contactNo: "+1234567890",
  //       start: new Date(2023, 6, 15, 18, 0),
  //       end: new Date(2023, 6, 15, 23, 0),
  //       description:
  //         "A vibrant summer music festival featuring local and international artists across multiple stages.",
  //       imageUrl: "/placeholder.svg?height=200&width=400",
  //       user: { _id: "user1", name: "Event Organizer" },
  //       venue: { _id: "venue1", name: "Central Park", address: "New York, NY" },
  //       ticketPrice: 75,
  //       createdAt: new Date(),
  //     })
  //   }, 1000)
  // })
}

export default function TenderSubmissionForm() {
  const { id } = useParams();
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    proposedPrice: "",
    serviceType: "full",
    description: "",
    additionalRequirements: "",
  })
  const navigate = useNavigate()

  useState(() => {
    const getEvent = async () => {
      if (!id) return

      try {
        const data = await fetchEvent(id)
        setEvent(data)
      } catch (error) {
        console.error("Failed to fetch event:", error)
      } finally {
        setLoading(false)
      }
    }

    getEvent()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value) => {
    setFormData((prev) => ({ ...prev, serviceType: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!id) return

    setSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        proposedPrice: "",
        serviceType: "full",
        description: "",
        additionalRequirements: "",
      })
    } catch (error) {
      console.error("Failed to submit tender:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Event
        </Button>

        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-6" />

          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/events")}>Browse All Events</Button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Event
        </Button>

        <div className="max-w-3xl mx-auto">
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
                Tender Submitted Successfully!
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-500">
                Your tender for {event.title} has been received.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Thank you for submitting your tender. The event organizer will review your proposal and contact you if
                they're interested.
              </p>

              <div className="bg-white dark:bg-green-950/30 rounded-lg p-4 mb-6 border border-green-200 dark:border-green-900/50">
                <h3 className="font-medium mb-2">Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                    <span>{format(new Date(event.start), "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" />
                    <span>
                      {event.venue.name}, {event.venue.address}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex-1" onClick={() => navigate(`/events/${id}`)}>
                  Return to Event
                </Button>
                <Button className="flex-1" onClick={() => navigate("/events")}>
                  Browse More Events
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={handleGoBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Event
      </Button>

      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Submit Tender</h1>
          <p className="text-muted-foreground">
            For: <span className="font-medium text-foreground">{event.title}</span>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tender Information</CardTitle>
            <CardDescription>Provide your details and proposal for this event.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Your Company Ltd."
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="proposedPrice">Proposed Price (USD)</Label>
                  <Input
                    id="proposedPrice"
                    name="proposedPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.proposedPrice}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <RadioGroup
                    value={formData.serviceType}
                    onValueChange={handleRadioChange}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full" className="font-normal">
                        Full Service (Complete event management)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="partial" id="partial" />
                      <Label htmlFor="partial" className="font-normal">
                        Partial Service (Specific components only)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="consulting" id="consulting" />
                      <Label htmlFor="consulting" className="font-normal">
                        Consulting Only (Advisory role)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Proposal Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your proposal in detail, including your experience, approach, and what makes your offer unique..."
                    rows={5}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalRequirements">Additional Requirements or Questions</Label>
                  <Textarea
                    id="additionalRequirements"
                    name="additionalRequirements"
                    placeholder="Any additional requirements, questions, or special considerations..."
                    rows={3}
                    value={formData.additionalRequirements}
                    onChange={handleInputChange}
                  />
                </div>

                <Alert>
                  <AlertTitle>Before submitting</AlertTitle>
                  <AlertDescription>
                    Please ensure all information is accurate. Once submitted, you cannot edit your tender.
                  </AlertDescription>
                </Alert>
              </div>

              <CardFooter className="px-0 pt-2">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <SendIcon className="mr-2 h-4 w-4" />
                      Submit Tender
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
