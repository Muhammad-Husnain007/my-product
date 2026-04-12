import bcrypt from "bcrypt";
import VendorModel from "../models/Vendor.js";
import UserModel from "../../user/models/User.js";
import AddressModel from "../../address/models/Address.js";
import DocumentModel from "../../document/models/Document.js";
import sendOTP from "../../user/services/sendOtpViaEmail.js";

const create = async (req, res) => {
  try {
    const { email, address, document } = req.body;
    const userId = req.user._id;

    const isUser = await UserModel.findOne({ _id: userId, del: false }).select("_id");
    if (!isUser)
      return res.status(404).json({ success: false, data: null, message: "User not found" });

    const isAddress = await AddressModel.findOne({ _id: address, del: false, active: true }).select("_id");
    if (!isAddress)
      return res.status(404).json({ success: false, data: null, message: "Address not found" });

    const isDocument = await DocumentModel.findOne({ _id: document, del: false }).select("_id");
    if (!isDocument)
      return res.status(404).json({ success: false, data: null, message: "Document not found" });

    const updatePayload = { address, document };
    let otpSent = false;

    if ("email" in req.body) {
      const otp = await sendOTP(email); 
      const otpHash = await bcrypt.hash(String(otp), 10);
      updatePayload.email = email;
      updatePayload.otpHash = otpHash;
      updatePayload.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
      updatePayload.emailVerified = false;
      otpSent = true;
    }

    const vendor = await VendorModel.findOneAndUpdate(
      { user: userId, del: false },
      { $set: { ...updatePayload, user: userId } },
      { upsert: true, new: true }
    );

    return res.status(201).json({
      success: true,
      data: { vendorId: vendor._id, otpSent },
      message: "Vendor onboarding initiated",
    });
  } catch (err) {
    return res.status(500).json({ success: false, data: null, message: err.message });
  }
};

export default create;