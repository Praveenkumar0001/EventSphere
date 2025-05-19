const express = require("express");
const router = express.Router();
const multer=require("multer");
const storage = multer.memoryStorage(); // You can use diskStorage if you want to save files to disk
const upload = multer({ storage: storage });


const tendorController = require("../controllers/Tender");

router.route('/allotTender').post(tendorController.allotTendor);
router.route("/get-tender-by-userId").post(tendorController.getTicketByUserId);
router.route("/getEmptyEvent").post(tendorController.getEmptyEvents);
router.route("/getAllotedEvent").post(tendorController.getAllotedEvents);
module.exports = router;