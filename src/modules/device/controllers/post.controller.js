import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import { DeviceModel } from "../model/device.model.js";

const deviceSync = async (req, res) => {
  try {
    const { deviceId, info } = req.body;
    // const userId = req.user._id; 
    const ip = req.ip;

    let device = await DeviceModel.findOne({
      deviceId,
    //   user: userId,
    ip,
      del: false
    })

    if (device) {
      device.info = info;
      device.ip = ip;

      await device.save();

      return res.status(200).json(
        new ApiResponse({
          status: 200,
          success: true,
          message: "Device updated successfully",
          data: device
        })
      );
    }

    device = await DeviceModel.create({
      deviceId,
      info,
      ip,
      class: "lurker"
    //   user: userId
    });

    return res.status(201).json(
      new ApiResponse({
        status: 201,
        success: true,
        message: "Device registered successfully",
        data: device
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

export { deviceSync };
