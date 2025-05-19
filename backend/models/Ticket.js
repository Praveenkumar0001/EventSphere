const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    paymentID: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
