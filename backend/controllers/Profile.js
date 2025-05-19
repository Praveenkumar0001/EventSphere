const Profile = require("../models/Profile");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

function extractPublicId(url) {
  const regex = /\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|webp|gif|svg)$/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1]; // This is your public_id
  }
  return null;
}

async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log("Error deleting image:", error);
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const { gender, dob, addressLine, city, state, mobileNo, userID } =
      req.body;
    const profilePhoto = req.file; // Assuming profile photo is uploaded as a file
    // Check if userID is provided
    console.log("userID", userID);
    if (!userID) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const updatedFields = {
      gender,
      dob,
      addressLine,
      city,
      state,
      mobileNo,
      profilePhoto,
    };

    // Add profilePhoto if it is uploaded
    if (profilePhoto) {
      console.log("priting image 😂", profilePhoto);
      const image = await uploadImageToCloudinary(
        profilePhoto,
        process.env.PROFILE_IMAGES
      );

      updatedFields.profilePhoto = image.secure_url;
    }

    // Find and update profile
    const prevProfile = await Profile.findOne({ user: userID });

    //delteting prev profile photo
    if (profilePhoto && prevProfile.profilePhoto) {
      const url = prevProfile.profilePhoto;
      const publicId = extractPublicId(url);
      console.log("Public ID:", publicId); // -> "folder/image123"
      if (publicId) {
        deleteImage(publicId);
      }
    }
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userID }, // Assuming Profile model has a `user` field referencing User
      updatedFields,
      { new: true, runValidators: true } // Return updated document
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.log("printing error", error);
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating Profile",
    });
  }
};

exports.getProfileData = async (req, res) => {
  try {
    const { userID } = req.body;
    console.log("hello there", userID);
    if(!userID){
      return res.status(400).json({
        success:false,
        message:"userID is required",
      })
    }
    const profile = await Profile.findOne({ user: userID });

    return res.status(200).json({
      success: true,
      message: "successfully fetched data of profile",
      profile,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "something went wrong while fetching profile data",
    });
  }
};
