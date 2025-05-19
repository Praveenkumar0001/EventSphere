const express = require("express");
const router = express.Router();

const ratingController = require("../controllers/Rating");

router.route("/rate-event").post(ratingController.rateEvent);
router.route("/getAvgRating").post(ratingController.getAverageRating);
router.route("/getEventRating").post(ratingController.getEventRating);
router.route("/getRatingCnt").post(ratingController.ratingCnt);
module.exports = router;
