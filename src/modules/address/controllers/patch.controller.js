import AddressModel from "../model/address.model.js";

const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const {addressId} = req.params;

    const address = await AddressModel.findOne({
      _id: addressId,
      user: userId,
      del: false
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    const {
      label,
      fullName,
      addressLine,
      city,
      state,
      postalCode,
      coordinates,
      active,
      country
    } = req.body;

    if (active) {
      await AddressModel.updateMany(
        { user: userId, del: false },
        { $set: { active: false } }
      );
    }

    if (label !== undefined) address.label = label;
    if (fullName !== undefined) address.fullName = fullName;
    if (addressLine !== undefined) address.addressLine = addressLine;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (coordinates !== undefined) address.coordinates = coordinates;
    if (active !== undefined) address.active = active;
    if (country !== undefined) address.country = country;

    await address.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: address
    });

  } catch (error) {
    console.error("Update Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export {
  updateAddress
};