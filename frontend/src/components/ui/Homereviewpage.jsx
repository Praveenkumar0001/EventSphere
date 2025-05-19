import { useState, useEffect } from "react";
import axios from "axios";
import { Star, ThumbsUp, ThumbsDown, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

function Reviews({ eventId }) {
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [ratingCounts, setRatingCounts] = useState({
    oneCnt: 0,
    twoCnt: 0,
    threeCnt: 0,
    fourCnt: 0,
    fiveCnt: 0,
  });
  const [helpfulMarked, setHelpfulMarked] = useState({});

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await axios.post("http://localhost:3002/api/rating/getAvgRating", {
          eventId,
        });

        if (response.data.success) {
          setAverageRating(response.data.averageRating || 0);
          setTotalRatings(response.data.totalRatings || 0);
        }
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };

    if (eventId) {
      fetchAverageRating();
    }
  }, [eventId]);

  useEffect(() => {
    const fetchEventRatings = async () => {
      try {
        const response = await axios.post("http://localhost:3002/api/rating/getEventRating", {
          eventID: eventId,
        });

        if (response.data.success) {
          setReviews(response.data.ratings);
        }
      } catch (error) {
        console.error("Error fetching event ratings:", error);
      }
    };

    if (eventId) {
      fetchEventRatings();
    }
  }, [eventId]);

  useEffect(() => {
    const fetchRatingCounts = async () => {
      try {
        const response = await axios.post("http://localhost:3002/api/rating/getRatingCnt", {
          eventID: eventId,
        });

        if (response.data.success) {
          setRatingCounts({
            oneCnt: response.data.oneCnt,
            twoCnt: response.data.twoCnt,
            threeCnt: response.data.threeCnt,
            fourCnt: response.data.fourCnt,
            fiveCnt: response.data.fiveCnt,
          });
          console.log("Rating Counts:", response.data);
        }
      } catch (error) {
        console.error("Error fetching rating counts:", error);
      }
    };

    if (eventId) {
      fetchRatingCounts();
    }
  }, [eventId]);

  const totalCount =
    ratingCounts.oneCnt + ratingCounts.twoCnt + ratingCounts.threeCnt + ratingCounts.fourCnt + ratingCounts.fiveCnt;

  const markHelpful = (reviewId, isHelpful) => {
    setHelpfulMarked((prev) => ({
      ...prev,
      [reviewId]: isHelpful,
    }));
    // Here you would typically send this to your API
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-white to-slate-50 shadow-xl rounded-2xl">
      <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
        Event Reviews
      </h2>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold text-blue-600">{averageRating}</span>
              </div>
              <svg className="w-36 h-36" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-purple-100" strokeWidth="2"></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-blue-600"
                  strokeWidth="2"
                  strokeDasharray={`${(100 * averageRating) / 5} 100`}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                ></circle>
              </svg>
            </div>
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className="text-lg font-medium">Based on {totalRatings} reviews</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h3 className="text-xl font-semibold mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                ratingCounts[
                  `${rating === 1 ? "one" : rating === 2 ? "two" : rating === 3 ? "three" : rating === 4 ? "four" : "five"}Cnt`
                ];
              const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-4 h-4 ml-1 fill-yellow-400 text-yellow-400" />
                  </div>
                  {/* Removed Progress component */}
                  <span className="text-sm font-medium w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="border-2 border-white shadow-sm">
                        <AvatarImage
                          src={review?.user?.profile?.profilePhoto || "/placeholder.svg?height=40&width=40"}
                          alt={review?.user?.name}
                        />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{review?.user?.name}</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-white">
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{review?.rating}</span>
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      </div>
                    </Badge>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < review?.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">{review?.comment}</p>

                  <div className="flex items-center justify-between border-t pt-4">
                    <p className="text-sm text-gray-500">Was this review helpful?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => markHelpful(index, true)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
                          helpfulMarked[index] === true
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>Yes</span>
                      </button>
                      <button
                        onClick={() => markHelpful(index, false)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
                          helpfulMarked[index] === false
                            ? "bg-blue-100 text-red-700"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                        <span>No</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;