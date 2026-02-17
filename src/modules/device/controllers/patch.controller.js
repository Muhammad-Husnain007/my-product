import { DeviceModel } from "../model/device.model.js";

export const devicePatch = async (req, res) => {
  try {

    const updatedDevice = await DeviceModel.findOneAndUpdate(
      { deviceId: req.body?.deviceId, del: false },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedDevice) {
      return res.status(404).json({
        message: "Device not found",
      });
    }

    return res.status(200).json({
      message: "Device updated successfully",
      data: updatedDevice,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
