import BookingModel from "../model/booking.model.js";

export const getBookingForVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const booking = await BookingModel.findOne({
      _id: id,
      del: false,
    })
      .populate("user", "name email phone")
      .populate("vendor", "businessName email")
      .populate("hall", "name images capacity price")
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getBookingForUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const booking = await BookingModel.findOne({
      _id: id,
      del: false,
    })
      .select("status paymentCalculation forComplete rejectReason")
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
