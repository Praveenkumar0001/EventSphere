require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const mongoose = require("mongoose");
const cors = require("cors");
const corsOptions = require("./config/cors");
const cookieParser = require("cookie-parser");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUplaod = require("express-fileupload");
const PORT = process.env.PORT || 4000;
const multer = require("multer");
connectDB();

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", require("./routes/authRoutes"));

const storage = multer.memoryStorage(); // You can use diskStorage if you want to save files to disk
const upload = multer({ storage: storage });

// Route to handle venue addition
app.use("/api/venue", require("./routes/venueRoutes"));

app.use("/api/event", require("./routes/eventRoutes"));

app.use("/api/ticket", require("./routes/ticketRoutes"));
app.use("/api/profile", require("./routes/Profile"));
app.use("/api/rating", require("./routes/ratingRoutes"));
app.use("/api/tender", require("./routes/tenderRoutes"));
app.use(
  fileUplaod({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
cloudinaryConnect();

mongoose.connection.once("open", () => {
  console.log("connection to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
