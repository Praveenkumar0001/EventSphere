const express = require("express");
const router = express.Router();
const profileController = require("../controllers/Profile");
const authenticateUser = require("../middlewares/auth")

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/updateProfile").post(upload.single("file"), profileController.updateProfile);
router.route("/getProfileData").post(authenticateUser, profileController.getProfileData);


module.exports = router;
