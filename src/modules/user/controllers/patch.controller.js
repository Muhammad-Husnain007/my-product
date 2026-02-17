import { UserModel } from "../model/user.model.js";
import logger from './../../../../config/logger.config.js';

export const patchUser = async (req, res) => {
  try {
    const {userId} = req.params

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId, del: false },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    logger.log("Server Error")
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
