const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  console.log("in image uploader");
  console.log("file", file);
  console.log("folder", folder);
  const options = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";

  // Convert buffer to a base64 string
  const base64String = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  return await cloudinary.uploader.upload(base64String, options);
};
