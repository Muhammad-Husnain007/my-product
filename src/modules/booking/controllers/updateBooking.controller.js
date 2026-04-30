import { HallModel } from "../../hallUpload/model/hall.model.js";
import BookingModel from "../model/booking.model.js";

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const {
      eventType,
      guestCount,
      specialRequests,
      bookingDate,
      slot,
    } = req.body;

    // ================= FIND BOOKING =================

    const booking = await BookingModel.findOne({
      _id: id,
      user: userId,
      del: false,
      status: "send", // sirf send status update hogi
    }).lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or cannot be updated",
      });
    }

    // ================= PREPARE NEW VALUES =================

    const newDate = bookingDate
      ? new Date(bookingDate)
      : booking.bookingDate;

    const newStart = slot?.startTime || booking.slot.startTime;

    const newEnd = slot?.endTime || booking.slot.endTime;

    // ================= PAST DATE CHECK =================

    if (bookingDate && newDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Booking date cannot be in the past",
      });
    }

    // ================= SLOT CHECK =================

    // if (bookingDate || slot) {
    //   const slotExist = await BookingModel.exists({
    //     _id: { $ne: id },
    //     hall: booking.hall,
    //     del: false,
    //     status: { $in: ["send", "accepted"] },
    //     bookingDate: newDate,

    //     "slot.startTime": { $lt: newEnd },
    //     "slot.endTime": { $gt: newStart },
    //   });

    //   if (slotExist) {
    //     return res.status(409).json({
    //       success: false,
    //       message: "Slot already booked",
    //     });
    //   }
    // }

    // ================= GUEST COUNT CHECK =================

    if (guestCount) {
      const hall = await HallModel.findById(booking.hall)
        .select("capacity")
        .lean();

      if (!hall) {
        return res.status(404).json({
          success: false,
          message: "Hall not found",
        });
      }

      if (guestCount > hall.capacity) {
        return res.status(400).json({
          success: false,
          message: `Hall capacity is only ${hall.capacity}`,
        });
      }
    }

    // ================= UPDATE PAYLOAD =================

    const updatePayload = {};

    if (eventType) {
      updatePayload.eventType = eventType;
    }

    if (guestCount) {
      updatePayload.guestCount = guestCount;
    }

    if (specialRequests !== undefined) {
      updatePayload.specialRequests = specialRequests;
    }

    if (bookingDate) {
      updatePayload.bookingDate = newDate;
    }

    if (slot?.startTime) {
      updatePayload["slot.startTime"] = slot.startTime;
    }

    if (slot?.endTime) {
      updatePayload["slot.endTime"] = slot.endTime;
    }

    const updatedBooking = await BookingModel.findOneAndUpdate(
      {
        _id: id,
        user: userId,
        del: false,
        status: "send",
      },
      {
        $set: updatePayload,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      data: updatedBooking,
      message: "Booking updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};