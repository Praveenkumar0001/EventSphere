const express = require("express");
const router = express.Router();
const multer=require("multer");

const storage = multer.memoryStorage(); // You can use diskStorage if you want to save files to disk
const upload = multer({ storage: storage });


const venueController = require("../controllers/Venue");

router.route('/addvenue').post(upload.single('file'), venueController.addVenue);
router.route("/getvenue").post(venueController.getVenue);

module.exports = router;