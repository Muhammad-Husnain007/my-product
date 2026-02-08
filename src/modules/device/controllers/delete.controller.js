// import logger from "../../../../config/logger.config";
// import ApiError from "../../../utils/ApiError";
// import ApiResponse from "../../../utils/ApiResponse";
// import { DeviceModel } from "../model/device.model";

// const deviceDel = async (req, res) => {
//   try {
//     const deviceId = req.params;
//     const device = await DeviceModel.findByIdAndDelete(deviceId);

//     if (device) {
//       logger.log("Device not found");
//     }

//     return res.status(200).json(
//       new ApiResponse({
//         success: true,
//         status: 200,
//         message: "Device deleted successfully",
//       }),
//     );
//   } catch (error) {
//     return res.status(500).json(
//       new ApiError({
//         status: 500,
//         error: error.message,
//       }),
//     );
//   }
// };

// export {deviceDel}
