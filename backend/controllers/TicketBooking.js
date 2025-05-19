const Ticket = require("../models/Ticket");

//book ticket
// frontend-->user id and event id and payment id
// response ticket

// Book a ticket
exports.bookTicket = async (req, res) => {
  
  try {
    const { userID, eventID, paymentID } = req.body;

    if (!userID || !eventID || !paymentID) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
   
    const newTicket = await Ticket.create({
      user: userID,
      event: eventID,
      paymentID: paymentID,
    });

    return res.status(201).json({
      success: true,
      message: "Ticket booked successfully",
      ticket: newTicket,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while booking ticket",
    });
  }
};

// get all tickets by user id
// frontend -->user id

//
exports.getMyBookedEvents = async (req, res) => {
  try {
      const { userID } = req.body; // Use req.params instead of req.body

      if (!userID) {
          return res.status(400).json({
              success: false,
              message: "User ID is required",
          });
      }

      console.log("Fetching booked events for user:", userID);

      const tickets = await Ticket.find({ user: userID })
          .populate({
              path: "event",
              populate: { path: "venue" } // Populate venue inside event
          });

      return res.status(200).json({
          success: true,
          message: "Successfully fetched my booked events",
          tickets,
      });
  } catch (error) {
      console.error("Error fetching booked events:", error);
      return res.status(500).json({
          success: false,
          message: "Something went wrong while fetching booked events",
          error: error.message,
      });
  }
};

