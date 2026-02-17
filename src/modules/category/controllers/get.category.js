import { CategoryModel } from "../model/category.model.js";

export const getCategory = async (req, res) => {
  try {
    const category = await CategoryModel.find({ del: false });
    if (!category) {
      return res.status(400).json({
        message: "category not found",
      });
    }

    return res.status(200).json({
      message: "Category Fetched Success",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error?.message,
    });
  }
};
