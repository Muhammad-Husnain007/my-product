import { HallModel } from "../model/hall.model.js";

// Get Hall by ID
export const getHallById = async (req, res) => {
  try {
    const { hallId } = req.params;

    const hall = await HallModel.findOne({_id: hallId, del: false})
      .populate("owner", "username phone _id")
      .populate("address", "_id city state country coordinates addressLine active")
      .populate("images", " _id type hallImages")
      .select("-_v")

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hall retrieved successfully",
      data: hall,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};
