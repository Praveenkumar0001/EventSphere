const Venue = require("../models/Venue");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.addVenue = async(req,res) =>{
    try{
        //fetch data from req body 
       const {name,city,state,price,paxcapacity,roomcount,description} = req.body;
       console.log("frontend data",req.body);
       //fetch image 
       const thumbnail = req.file;
       console.log("thumbnail image from frontend",thumbnail);
       //validation 
       if(!name || !city || !state || !price || !paxcapacity || !roomcount || !description){
        return res.status(400).json({
            success:false,
            message:"all fields are required",
        })
       }
       //upload image on cloudinary
       const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.VENUE_IMAGES
      )

      //create venue in database
      const newVenue = await Venue.create({
        name,
        city,
        state,
        price,
        imageUrl:thumbnailImage.secure_url,
        paxcapacity,
        roomcount,
        description

      })
      //return success status 
      return res.status(200).json({
        success:true,
        message:"venue created successfully",
      })

    }
    catch(error){
      console.log("printing error",error);
        return res.status(400).json({
            success:false,
            message:"something went wrong while adding venue",
        })
    }
}

// Get venue controller
exports.getVenue = async (req, res) => {
  try {
    // Fetch {state, city} from req
    const { state, city } = req.body;

    // Validation
    if (!state || !city) {
      return res.status(400).json({
        success: false,
        message: "State and City are required",
      });
    }

    // Fetch list of venues from database
    const venues = await Venue.find({ state, city });

    // if (venues.length === 0) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No venues found",
    //   });
    // }

    // Returning list of venues in response
    return res.status(200).json({
      success: true,
      message: "Returning list of venues",
      venues,
    });
  } catch (error) {
    console.error("Error fetching venues:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
