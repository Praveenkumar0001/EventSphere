"use client"

import { useState } from "react"
import axios from "axios"
import { Star, Sparkles } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import "react-toastify/dist/ReactToastify.css"

function Giverating({ eventId, userId }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [experience, setExperience] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)
  const maxCharacters = 500

  const handleExperienceChange = (e) => {
    const text = e.target.value
    if (text.length <= maxCharacters) {
      setExperience(text)
      setCharacterCount(text.length)
    }
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.warning("Please provide a rating")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await axios.post("http://localhost:3002/api/rating/rate-event", {
        eventId,
        userId,
        rating,
        comment: experience,
      })

      if (response.data.success) {
        toast.success("Your review has been submitted successfully!")
        setRating(0)
        setHover(0)
        setExperience("")
      } else {
        toast.error("Failed to submit rating")
      }
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast.error("An error occurred while submitting your rating")
    } finally {
      setIsSubmitting(false)
    }
  }

  const ratingLabels = [
    "Select a rating",
    "Poor - Not recommended",
    "Fair - Below average",
    "Good - Average experience",
    "Very Good - Above average",
    "Excellent - Highly recommended",
  ]

  return (
    <Card className="max-w-2xl mx-auto mt-12 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"></div>

      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-500" />
          Share Your Experience
        </CardTitle>
        <CardDescription>Your feedback helps others make better decisions</CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="mb-8">
          <p className="text-sm font-medium mb-3">How would you rate this event?</p>
          <div className="flex flex-col gap-4">
            <div className="flex justify-center">
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Star
                    size={40}
                    className={`cursor-pointer transition-all duration-200 ${
                      i < (hover || rating) ? "text-yellow-400 fill-yellow-400 drop-shadow-md" : "text-gray-300"
                    }`}
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHover(i + 1)}
                    onMouseLeave={() => setHover(0)}
                  />
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {(hover > 0 || rating > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center"
                >
                  <span className="font-medium text-blue-700">{ratingLabels[hover || rating]}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <label htmlFor="experience" className="text-sm font-medium">
              Describe your experience (optional)
            </label>
            <span className={`text-xs ${characterCount > maxCharacters * 0.8 ? "text-amber-600" : "text-gray-500"}`}>
              {characterCount}/{maxCharacters}
            </span>
          </div>

          <Textarea
            id="experience"
            placeholder="What did you like or dislike? What was memorable about this event?"
            value={experience}
            onChange={handleExperienceChange}
            className="min-h-[150px] resize-none transition-all duration-200 focus:border-blue-400 focus:ring-blue-400"
          />

          <p className="text-xs text-gray-500">
            Your review will be public and may help others decide whether to attend similar events
          </p>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-800 hover:to-blue-600 text-white py-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            <span className="text-lg">Submit Review</span>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Giverating
