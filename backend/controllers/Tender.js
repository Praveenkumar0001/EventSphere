const Tendor =require("../models/Tender");
const Event = require('../models/Event'); // Adjust path as needed
exports.allotTendor = async(req,res)=>{
    try{

        console.log("in tender controller");
        const{userID,eventID}=req.body;
        console.log("in tender controller", req.body);

        if(!userID || !eventID){
            return res.status(403).json({
                success:false,
                message:"every field is required",
            })
        }
        const isAlloted = await Tendor.findOne({event:eventID});
        console.log('isalloted', isAlloted);
        if(isAlloted){
          return res.status(404).json({
            success:false,
            message:"sorry event already got tendor",
          })
        }
        
        const alloting = await Tendor.create({
          user:userID,
          event:eventID
        });
        console.log('alloting', alloting);
        
        return res.status(200).json({
            success:true,
            message:"successfully tendor alloted",
            alloting,
        })

    }
    catch(error){
        return res.status(400).json({
            success:false,
            meessage:"sorry Tendor is not alloted to you"
        })
    }
}

exports.getTicketByUserId = async (req, res) => {
    try {
      const { userID } = req.body;

      console.log("Fetching tenders for user: 👋👋👋", userID);
  
      const myTenders = await Tendor.find({ user: userID })
        .populate({
          path: "event",
          populate: {
            path: "venue",
          },
        });
  
      return res.status(200).json({
        success: true,
        message: "Returning all your bookings",
        myTenders,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  };
  

exports.getEmptyEvents = async (req, res) => {
    try {
      // Step 1: Get all event IDs from Tendor (with safe null check)
      const tendorEvents = await Tendor.find({}, { event: 1 }).populate("event");
  
      const usedEventIds = new Set(
        tendorEvents
          .filter(t => t.event) // skip null events
          .map(t => t.event._id.toString())
      );
  
      // Step 2: Find events not used in Tendor and populate venue
      const emptyEvents = await Event.find({
        _id: { $nin: Array.from(usedEventIds) }
      }).populate("venue"); // populate venue here
  
      // Step 3: Return full Event docs
      return res.status(200).json({
        success: true,
        data: emptyEvents,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Something went wrong',
        error,
      });
    }
  };
  

exports.getAllotedEvents = async (req, res) => {
    try {
      // Step 1: Get all tendors, populate event and nested venue
      const tendorEvents = await Tendor.find({}, { event: 1 })
        .populate({
          path: "event",
          populate: {
            path: "venue", // nested populate for event.venue
          },
        });
  
      // Step 2: Return full Event docs with venue populated
      return res.status(200).json({
        success: true,
        data: tendorEvents,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Something went wrong',
        error,
      });
    }
  };
