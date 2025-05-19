const User = require("../models/User");
const OTP = require("../models/Otp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const axios = require("axios");
const {oauth2client} = require("../utils/googleConfig");
const Profile = require("../models/Profile");
const {passwordUpdated} = require("../utils/passwordUpdate");
const mailSender = require("../utils/mailsender");

require("dotenv").config();

//sign up controller
exports.signup = async (req, res) => {
  try {
    //fetching data from request
    console.log("in signup controller");
    const { name, email, password, accountType, otp,Rname,Rno } = req.body;
    console.log("req.body", req.body);

    //validation

    if (!name || !email || !password || !accountType || !otp) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    }

    //check for exsisting user

    const exsistingUser = await User.findOne({ email });

    if (exsistingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exsists",
      });
    }

    //find most recent otp
    const recentOtp = await OTP
      .findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    console.log("1")
    console.log(recentOtp)
    //validate otp
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "otp expired"
      })
    }
    console.log("2")

    if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "otp not matching",
      });
    }
    console.log("3")

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    if(!Rname && !Rno){
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        accountType: accountType,
      });
    }
    else{
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        accountType: accountType,
        RepresentativeName:Rname,
        CompanyRegNo:Rno
      });
    }
    const newProfile=await Profile.create({
      user:user._id,
    });
    console.log("4")

    return res.status(200).json({
      success: true,
      message: "user is registered successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user cannot be registered try again",
    });
  }
};

//login controlller
exports.login = async (req, res) => {
  try {
    // console.log('in login controller');
    const { email, password } = req.body;
    // console.log('email', email);
    // console.log('password', password);
    
    // Validation
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not registered",
      });
    }
    // console.log('user', user);

    // Password matching
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    // Create token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    user.token = token;
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    // Send token through cookie
    console.log("at end step");
    return res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//send otp controller
exports.sendotp = async (req, res) => {
  console.log("in sendotp controller");
  try {
    //fetch email from req body
    const { email } = req.body;
    //check if email already exsist or not
    if(!email){
      return res.status(400).json({
        success:false,
        message:"email is missing",
      })
    }
    const checkuserpresent = await User.findOne({ email });

    if (checkuserpresent) {
      return res.status(401).json({
        success: false,
        message: "User already regisitered",
      });
    }
    //generate otp
    var otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("otp generated", otp);
    //check unique otp or not

    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    // const otpPayload={email,otp};
    //create an entry in db of otp
    const otpBody = await OTP.create({
      email,
      otp,
    });
    console.log(otpBody);
    //return successful response
    res.status(200).json({
      success: true,
      message: "otp sent successfullt",
      otp,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//change password controller
exports.changePassword = async (req, res) => {
  try {
    const {userID, oldPassword, newPassword } = req.body;
    if(!userID || !oldPassword || newPassword){
      return res.status(400).json({
        success:false,
        message:"all fields are required",
      })
    }
    console.log(req.body, 'req.body');

    const userDetails = await User.findById(userID);

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    // Match new password and confirm new password
    // if (newPassword !== confirmNewPassword) {
    // 	// If new password and confirm new password do not match, return a 400 (Bad Request) error
    // 	return res.status(400).json({
    // 		success: false,
    // 		message: "The password and confirm password does not match",
    // 	});
    // }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      userID,
      { password: encryptedPassword },
      { new: true }
    );
    console.log('password saved succesfully');
    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password Changed",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.name}`
        )
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { code,accountType } = req.body;
    // console.log('in google Login');
    // console.log('accountType',accountType);
    // console.log('code recieved from frontend',code);
    if(!code || !accountType){
      return res.status(400).json({
        success:false,
        message:"all fields are required",
      })
    }
    const googleRes = await oauth2client.getToken(code);

    // console.log("googleRes",googleRes);

    oauth2client.setCredentials(googleRes.tokens);
    console.log('google response',googleRes);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    )
    // console.log('userRes',userRes);
    const { email, name, picture } = userRes.data;
    let user = await User.findOne({ email});
    // console.log("111");
    if (!user) {
      console.log("i am in  if bracket");
      user = await User.create({
        name,
        email,
        accountType: accountType,
      

      });
    }
    // console.log("222");
    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };
    // console.log("333");
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    // console.log("444");
    user.token = token;
    user.password = undefined;

    // console.log("555");
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    // console.log("666");
    //sending token through cookie
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: "logged in successfully",
    });
  }
  catch (error) {
    console.log("printing error ",error);
    return res.status(400).json({
      success:false,
      message:"something went wrong while google sign in"
    })
  }
}

// log out 
exports.logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      path: '/',
    });
    console.log('in logout handler');
    return res.json({ success: true, message: 'Logged out, cookie removed!' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(400).json({
      success: false,
      message: 'Error while logout',
    });
  }
};
