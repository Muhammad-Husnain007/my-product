// ======================================================
// GET VENDOR NEGOTIATIONS
// ======================================================

import NegotiateModel from "../model/negotiate.model.js";

export const getNegotiateForVendor = async (req, res) => {
  try {

    const userId = req.user._id;

    const negotiations = await NegotiateModel.find({
      receiver: userId,
      del: false,
    })
      .populate("sender", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: negotiations,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// GET USER NEGOTIATIONS
// ======================================================

export const getNegotiateForUser = async (req, res) => {
  try {

    const userId = req.user._id;

    const negotiations = await NegotiateModel.find({
      sender: userId,
      del: false,
    })
    //   .populate("receiver", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: negotiations,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};