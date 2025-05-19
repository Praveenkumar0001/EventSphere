const Event = require("../models/Event");
const mongoose = require("mongoose");
const User = require("../models/User");
const Venue = require("../models/Venue");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
// const { TbRulerMeasure } = require("react-icons/tb");
require("dotenv").config();

exports.addEvent = async (req, res) => {
  try {
    const {
      title,
      genre,
      contactNo,
      startDate,
      endDate,
      startTime,
      endTime,
      description,
      user,
      venue,
      ticketPrice,
    } = req.body;

    console.log(req.body);

    if (
      !title ||
      !genre ||
      !contactNo ||
      !startDate ||
      !endDate ||
      !startTime ||
      !endTime ||
      !description ||
      !user ||
      !venue ||
      !ticketPrice
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format. Use HH:mm (24-hour format).",
      });
    }

    const start = new Date(`${startDate}T${startTime}:00`);
    const end = new Date(`${endDate}T${endTime}:00`);

    const now = new Date();
    if (start < now) {
      return res.status(400).json({
        success: false,
        message: "Start date and time must not be in the past.",
      });
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "Start must be before end.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(user) ||
      !mongoose.Types.ObjectId.isValid(venue)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user or venue ID." });
    }

    const imageFile = req.file;
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Event thumbnail is required." });
    }

    const image = await uploadImageToCloudinary(
      imageFile,
      process.env.EVENT_IMAGES
    );

    const newEvent = new Event({
      title,
      genre,
      contactNo,
      start,
      end,
      description,
      imageUrl: image.secure_url,
      user,
      venue,
      ticketPrice,
    });

    await newEvent.save();

    // add this event in the bookings array of venue
    await Venue.findByIdAndUpdate(venue, {
      $push: { bookings: newEvent._id },
    });

    res
      .status(201)
      .json({ success: true, message: "Event added successfully", newEvent });
  } catch (error) {
    console.error("Error in addEvent:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    console.log("in get all events controller");
    const events = await Event.find().populate("venue");
    res.status(200).json({
      success: true,
      message: "RETURNING ALL EVENTS",
      events,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('hey there 👋👋', id)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID." });
    }
    const event = await Event.findById(id).populate("user").populate("venue");
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    res.status(200).json({
      success:true,
      message:"fetched successfully",
      event: event
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID." });
    }

    // Validate date fields if provided
    if (
      updates.startDate &&
      updates.endDate &&
      new Date(updates.startDate) >= new Date(updates.endDate)
    ) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date." });
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID." });
    }
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }
    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//get event on the basis of genre
exports.getEventByGenre = async (req, res) => {
  try {
    console.log("in gemre evemet");
    console.log("2");
    const { genre } = req.body;
    if (!genre) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    // const events = await Event.find({genre:genre});
    const events = await Event.find({ genre: genre }).populate("venue");
    return res.status(200).json({
      success: true,
      message: "returning list of events on the basis of genre",
      events,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        "something went wrong while fetching events on the basis of genre",
    });
  }
};
//get event by city
exports.getEventByCity = async (req, res) => {
  try {
    console.log("in geteventbycity")
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City field is required",
      });
    }

    // Find venues that match the city
    const venues = await Venue.find({ city }).select("_id");
    const venueIds = venues.map((venue) => venue._id);

    // Find events that are held in the found venues
    const events = await Event.find({ venue: { $in: venueIds } }).populate(
      "venue"
    );

    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//get event by state
exports.getEventByState = async (req, res) => {
  try {
    const { state } = req.body;
   console.log("in geteventbystate")
    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State field is required",
      });
    }

    // Find venues that match the state
    const venues = await Venue.find({ state }).select("_id");
    const venueIds = venues.map((venue) => venue._id);

    // Find events that are held in the found venues
    const events = await Event.find({ venue: { $in: venueIds } }).populate(
      "venue"
    );
     console.log("events",events)
    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getEventsByUser = async (req,res) =>{
  try{
    const {userID} = req.body;
    console.log(userID, 'userId');
    if(!userID){
      return res.status(400).json({
        success:false,
        message:"userID is required",
      })
    }
    const events = await Event.find({user:userID}).populate('venue');
    
    console.log(events, 'events');
    return res.status(200).json({
      success:true,
      message:"events fetched successfully",
      events,
    })
  }
  catch(error){
    return res.status(400).json({
      success:false,
      message:"events not fetched successfully"
    })
  }
 

}