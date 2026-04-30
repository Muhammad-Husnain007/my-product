import { HallModel } from "../../hallUpload/model/hall.model.js";
import BookingModel from "../model/booking.model.js";

// ================= ACCEPT / REJECT BOOKING =================

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status, rejectReason, hall } = req.body;

    const hallPrice = await HallModel.findOne({
      _id: req.body.hall,
      del: false,
    }).select("pricePerSlot").lean();

    const totalAmount = hallPrice.pricePerSlot/ 100 * 20; // 20% of total booking amount

    const booking = await BookingModel.findOneAndUpdate(
      {
        _id: id,
        del: false,
        status: "send",
      },
      {
        $set: {
          status,
          rejectReason,
          forComplete: "Please pay the advanced payment which is 20% of total booking amount to confirm your booking",
          paymentCalculation: totalAmount,
        },
      },
      {
        new: true,
      }
    ).select("status rejectReason");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or already processed",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
      message: `Booking ${status} successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};