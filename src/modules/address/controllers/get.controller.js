import AddressModel from "../model/address.model.js";

const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;

    const addresses = await AddressModel.find({
      user: userId,
      del: false
    }).sort({ active: -1, createdAt: -1 }).select("_id fullName addressLine city state active country");

    if(!addresses.length) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No addresses found for this user"
      });
    }

    return res.status(200).json({
      success: true,
      data: addresses
    });

  } catch (error) {
    console.error("Get Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export {
  getAddresses
};