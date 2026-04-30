// ================= CANCEL BOOKING =================

import BookingModel from "../model/booking.model.js";

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const booking = await BookingModel.findOne({
      _id: id,
      user: userId,
      del: false,
    }).select("status");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "send") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking in '${booking.status}' status`,
      });
    }

    booking.status = "cancelled";

    await booking.save();

    return res.status(200).json({
      success: true,
      data: booking,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};