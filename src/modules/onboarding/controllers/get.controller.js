

import VendorModel from "../model/vendor.model.js";

const getVendorById = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await VendorModel.findById(vendorId).select("-otp -otpExpiresAt");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    console.error("Get Vendor By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export {
  getVendorById
};