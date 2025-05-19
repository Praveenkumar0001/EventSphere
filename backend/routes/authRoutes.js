const express = require("express");
const router = express.Router();

const authController = require("../controllers/Auth");
const resetpassController = require("../controllers/ResetPassword");

router.route("/signup").post(authController.signup);

router.route("/login").post(authController.login);

router.route("/sendotp").post(authController.sendotp);

router.route("/change-password").post(authController.changePassword);

router.route("/reset-password").post(resetpassController.resetPassword);
router.route("/reset-password-token").post(resetpassController.resetPasswordToken);
router.route("/googleLogin").post(authController.googleLogin);
router.route("/logout").post(authController.logout);
module.exports = router;
