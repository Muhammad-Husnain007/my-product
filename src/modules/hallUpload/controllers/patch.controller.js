import { HallModel } from "../model/hall.model.js";

// Update Hall
export const updateHall = async (req, res) => {
  try {
    const { hallId } = req.params;
    const userId = req.user._id;

    if (!hallId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Hall ID is required",
        data: null,
      });
    }

    const hall = await HallModel.findOneAndUpdate(
      { _id: hallId, del: false, },
      { $set: req.body },
      {new: true, runValidators: true}
    ).select("_id owner hallName")

    if (!hall) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Hall not found",
        data: null,
      });
    }

    // Check if user is the owner
    if (hall.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this hall",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hall updated successfully",
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
