import { HallModel } from "../model/hall.model.js";

export const getAllHalls = async (req, res) => {
  try {
    const limit = 10;

    const halls = await HallModel.find({ del: false }, { createdAt: -1 })
      .limit(limit)
    //   .select("_id")
      .lean();

    return res.status(200).json({
      success: true,
      message: "All Halls",
      data: halls,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
};
