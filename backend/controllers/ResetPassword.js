const User=require("../models/User");
const mailSender=require("../utils/mailsender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


exports.resetPasswordToken = async (req,res) =>{
    try{
        const {email} = req.body;
        if(!email){
            return res.status(400).json({
                success:false,
                message:"email is required",
            })
        }
        const user = await User.findOne({email:email});

        if(!user){
            return res.status(403).json({
                success:false,
                message:"your email is not registered with us",

            });
        }

        const token = crypto.randomBytes(20).toString("hex");
        const updateDetails=await User.findOneAndUpdate({email:email},
            {token:token,
             resetPasswordExpires:Date.now()+5*60*1000,
            },{new:true});
        
            const url=`http://localhost:5173/update-password/${token}`;
            await mailSender(
                email,
                "Password Reset",
                `Your Link for email verification is ${url}. Please click this url to reset your password.`
            );
            res.status(200).json({
                success:true,
                message:'Emiil sent successfull',
            })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"something went wrong"
        })
    }
}

exports.resetPassword=async (req,res)=>{
    try{
        //data fetch
        const {password,confirmPassword,token}=req.body;

        if(!password || !confirmPassword || !token){
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            })
        }
        //validation
        if(password!==confirmPassword){

            return res.status().json({
                success:false,

                message:'password not matching'
            })
        }

        //get user details from db using token
        const userDetails=await User.findOne({token:token});
        //if no entry invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"token is invalid"
            })
        }
        //token expired
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"token expired",
            })
        }
        //hash passsword
        const hashedPassword=await bcrypt.hash(password,10);

        //password update
        await User.findOneAndUpdate({token:token},{password:hashedPassword},{new:true});
        //return response
        return res.status(200).json({
            success:true,
            message:"password reset succesfully",
        })
    }
    catch(error){
        return res.status().json({
            success:false,
            message:"something went wrong"
        })
    }
}