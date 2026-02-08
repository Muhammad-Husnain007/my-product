import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import { UserModel } from "../model/user.model.js";

const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      profile,
    } = req.body;

    const ip = req.ip;

    const already = await UserModel.findOne({
      email,
      del: false
    });

    // const device = await DeviceM

    if (already) {
      return res.status(400).json(
        new ApiResponse({
          status: 400,
          success: false,
          message: "User already exists"
        })
      );
    }

    // 🔹 create user
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      phone,
      profile,
    });

    return res.status(201).json(
      new ApiResponse({
        status: 201,
        success: true,
        message: "User created successfully",
        data: user
      })
    );

  } catch (error) {
    return res.status(500).json(
      new ApiError({
        status: 500,
        error: error.message
      })
    );
  }
};

export { createUser };
