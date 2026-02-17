import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import { UserModel } from "../model/user.model.js";
import { DeviceModel } from './../../device/model/device.model.js';

// Get all countries
const createUser = async (req, res) => {
  try {
   
    const {
      firstName,
      lastName,
      email,
      phone,
      deviceId
    } = req.body;

    const ip = req.ip;
 

    const already = await UserModel.findOne({
      email,
      del: false
    });
    const findDevice = await DeviceModel.findOne({
      deviceId,
      del: false
    });

    if(!findDevice){
      return res.status(404).json({
        message: "Device not found"
      })
    }

    let profile = {
      currency: "PKR",
      country:"Pakistan"
    };

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
      ip,
      deviceInfo:findDevice,
      profile
    });

      findDevice.user = user._id;
       await findDevice.save();
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
