import VendorModel from "../model/vendor.model.js";

const deleteVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const userId = req.user._id;

    const vendor = await VendorModel.findOne({
      _id: vendorId,
      user: userId
    }).select("del deletedAt _id");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    vendor.del = true;
    vendor.deletedAt = new Date();
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Vendor deleted successfully"
    });
  } catch (error) {
    console.error("Delete Vendor Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export {
  deleteVendor
};