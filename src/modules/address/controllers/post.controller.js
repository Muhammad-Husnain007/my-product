import AddressModel from "../model/address.model.js";

// Create Address
const createAddress = async (req, res) => {
  try {
    const userId = req.user._id; // assume auth middleware laga hua hai

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

    const newAddress = await AddressModel.create({
      user: userId,
      label: label,
      fullName,
      addressLine,
      city,
      state,
      postalCode,
      coordinates,
      active: active,
      country
    });

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: newAddress
    });

  } catch (error) {
    console.error("Create Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export {
  createAddress
};