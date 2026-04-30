import bcrypt from "bcrypt";
import VendorModel from "./../model/vendor.model.js";
import AddressModel from "./../../address/model/address.model.js";
import DocumentModel from "./../../document/model/document.model.js";
import sendOTP from "./../../user/services/sendOtpViaEmail.js";

const create = async (req, res) => {
  try {
    const { email, address, document } = req.body;
    const userId = req.user._id;

    // 1. Email check pehle karo
    if ("email" in req.body) {
      const checkEmail = await VendorModel.findOne({ email, del: false }).lean();
      if (checkEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }
    }

    // 2. Address check
    const isAddress = await AddressModel.findOne({
      _id: address,
      del: false,
      active: true,
    }).select("_id").lean();

    if (!isAddress) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    // 3. Document check
    const isDocument = await DocumentModel.findOne({ _id: document, del: false }).select("_id");
    if (!isDocument) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // 4. OTP logic
    const updatePayload = { address, document };
    let otpSent = false;

    if ("email" in req.body) {
      const otp = await sendOTP(email);
      const otpHash = await bcrypt.hash(String(otp), 10);
      updatePayload.email = email;
      updatePayload.otp = otpHash;
      updatePayload.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      updatePayload.emailVerifiedAt = null;
      otpSent = true;
    }

    // 5. Vendor create/update
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
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default create;
