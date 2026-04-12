import logger from "../../../../config/logger.config.js";
import { UserModel } from "../model/user.model.js";
import generateToken from "../services/auth.service.js";

const createUser = async (req, res) => {
  const { phone } = req.body;

  const existingUser = await UserModel.findOne({ 
    "phone.countryCode": phone.countryCode,
    "phone.phoneNumber": phone.phoneNumber
  }).select("_id isFirstLogin");

  if(existingUser?.isFirstLogin === false) {
    existingUser.otp = 1234;
    existingUser.otpExpiresAt = new Date(Date.now() + 60 * 1000); 
    await existingUser.save();
    return res.status(200).json({ success: true, data: existingUser, message: "OTP sent successfully" });
  }

  const user = new UserModel({
    phone,
    otp: 1234,
    ip: req?.ip,
    otpExpiresAt: new Date(Date.now() + 60 * 1000), 
  });
  await user.save();
  return res.status(201).json({ success: true, data: user, message: "User created successfully" });
  
};    


const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;
  const user = await UserModel.findOne({ 
    "phone.countryCode": phone.countryCode,
    "phone.phoneNumber": phone.phoneNumber
  })
  if (!user) {
    return res.status(404).json({ success: false, data: null, message: "User not found" });
  }

  if (user.otp !== otp || user.otpExpiresAt < new Date()) {
    return res.status(400).json({ success: false, data: null, message: "Invalid OTP" });
  }
  user.isFirstLogin = false;
  user.otp = null;
  user.otpExpiresAt = null;
  user.lastLogin = new Date();
  user.loginCount += 1;
  user.emailVerified = true;
  user.class = 'user';
  const token = await generateToken(user);  
  await user.save();
  logger.info(`User ${user._id} logged in successfully. Total logins: ${user.loginCount}`);
  return res.status(200).json({ success: true, data: user, token: token, message: "OTP verified successfully" });
}


export { createUser, verifyOTP };
