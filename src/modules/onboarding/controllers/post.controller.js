import bcrypt from "bcrypt";
import VendorModel from "./../model/vendor.model.js";
import AddressModel from "./../../address/model/address.model.js";
import DocumentModel from "./../../document/model/document.model.js";
import sendOTP from "./../../user/services/sendOtpViaEmail.js";

const create = async (req, res) => {
  try {
    const { email, address, document } = req.body;
    const userId = req.user._id;

    const isAddress = await AddressModel.findOne({
      _id: address,
      del: false,
      active: true,
    })
      .populate({
        path: "user",
        match: email,
        select: "_id",
      })
      .select("_id").lean();

    if (isAddress?.user) {
     return res.status(400).json({
        success: false,
        message: "Please, use another email this email is alredy exist.",
      });
    }

    if (!isAddress)
      return res
        .status(404)
        .json({ success: false, data: null, message: "Address not found" });

    const isDocument = await DocumentModel.findOne({
      _id: document,
      del: false,
    }).select("_id");
    if (!isDocument)
      return res
        .status(404)
        .json({ success: false, data: null, message: "Document not found" });

    const updatePayload = { address, document };
    let otpSent = false;

    if ("email" in req.body) {
      if (checkEmail) {
        res.status(400).json({
          success: false,
          message: "Please, use another email this email is alredy exist.",
        });
      }
      const otp = await sendOTP(email);
      const otpHash = await bcrypt.hash(String(otp), 10);
      updatePayload.email = email;
      updatePayload.otp = otpHash;
      updatePayload.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
      updatePayload.emailVerified = false;
      otpSent = true;
    }

    const vendor = await VendorModel.findOneAndUpdate(
      { user: userId, del: false },
      { $set: { ...updatePayload, user: userId } },
      { upsert: true, new: true },
    );

    return res.status(201).json({
      success: true,
      data: { vendorId: vendor._id, otpSent },
      message: "Vendor onboarding initiated",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, data: null, message: err.message });
  }
};

export default create;
