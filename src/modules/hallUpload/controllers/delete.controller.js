import { HallModel } from "../model/hall.model.js";

// Delete Hall (Soft Delete)
export const deleteHall = async (req, res) => {
  try {
    const { hallId } = req.params;
    const userId = req.user._id;

    const hall = await HallModel.findOneAndUpdate(
      { _id: hallId, del: false },
      { $set: { del: true, deletedAt: new Date() } },
      {new: true}
    ).select("_id owner")

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
        data: null,
      });
    }

    if (hall?.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this hall",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hall deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};
