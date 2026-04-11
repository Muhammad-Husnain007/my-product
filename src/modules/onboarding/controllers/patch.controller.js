
import bcrypt from "bcrypt";
import VendorModel from "../models/Vendor.js";

const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.user._id;

    if (!otp)
      return res.status(400).json({ success: false, data: null, message: "OTP is required" });

    const vendor = await VendorModel.findOne({ user: userId, del: false });
    if (!vendor)
      return res.status(404).json({ success: false, data: null, message: "Vendor not found" });

    if (vendor.emailVerified)
      return res.status(400).json({ success: false, data: null, message: "Email already verified" });

    if (!vendor.otpHash || !vendor.otpExpiresAt)
      return res.status(400).json({ success: false, data: null, message: "No OTP requested" });

    if (vendor.otpExpiresAt < new Date())
      return res.status(400).json({ success: false, data: null, message: "OTP expired" });

    const isMatch = await bcrypt.compare(String(otp), vendor.otpHash);
    if (!isMatch)
      return res.status(400).json({ success: false, data: null, message: "Invalid OTP" });

    vendor.emailVerified = true;
    vendor.emailVerifiedAt = new Date();
    vendor.otpHash = null;
    vendor.otpExpiresAt = null;
    await vendor.save();

    return res.status(200).json({ success: true, data: null, message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, data: null, message: err.message });
  }
};

export default verifyOTP;