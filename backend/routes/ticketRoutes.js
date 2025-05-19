const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/TicketBooking");

router.route("/book-ticket").post(ticketController.bookTicket);
router.route("/myBookedEvents").post(ticketController.getMyBookedEvents);
module.exports = router;
