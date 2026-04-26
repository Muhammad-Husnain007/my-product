import { UserModel } from "../model/user.model.js";

export const delUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const del = await UserModel.findOneAndUpdate(
      { _id: userId, del: false },
      { $set: { del: true, deletedAt: new Date() } },
      { new: true, runValidators: true },
    );

    if (!del) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    return res.status(201).json({
      message: "User del success",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
      status: 500,
    });
  }
};
