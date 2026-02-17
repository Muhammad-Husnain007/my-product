import { CategoryModel } from "../model/category.model.js";
import { UserModel } from "./../../user/model/user.model.js";

export const postCategory = async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "",
      });
    }
    const isUser = await UserModel.findById(userId, { del: false });
    if (!isUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const category = await CategoryModel.create({
      name,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "User created Success",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
