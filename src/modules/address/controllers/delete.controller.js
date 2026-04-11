import AddressModel from "../model/address.model.js";

const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;

    const address = await AddressModel.findOne({
      _id: addressId,
      user: userId,
      del: false
    }).select("_id active del");

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    address.del = true;
    await address.save();

    if (address.active) {
      const anotherAddress = await AddressModel.findOne({
        user: userId,
        del: false,
        _id: { $ne: addressId }
      }).select("_id active").sort({ createdAt: -1 });

      if (anotherAddress) {
        anotherAddress.active = true;
        await anotherAddress.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully"
    });

  } catch (error) {
    console.error("Delete Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export {
  deleteAddress
};