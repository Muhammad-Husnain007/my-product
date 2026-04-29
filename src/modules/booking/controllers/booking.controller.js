
import { HallModel } from "../../hallUpload/model/hall.model.js";
import BookingModel from "../model/booking.model.js";

const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      hall,
      eventType,
      guestCount,
      specialRequests,
      bookingDate,
      slot,
    } = req.body;

    const isHall = await HallModel.findOne({
      _id: hall,
      del: false,
      active: true,
    })
      .select("vendor capacity")
      .lean();

    if (!isHall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    if (guestCount > isHall.capacity) {
      return res.status(400).json({
        success: false,
        message: `Guest count exceeds hall capacity of ${isHall.capacity}`,
      });
    }

    const requestedStart = slot.startTime; // "14:00"
    const requestedEnd = slot.endTime;     // "22:00"
    const requestedDate = new Date(bookingDate);

    if (requestedDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Booking date cannot be in the past",
      });
    }

    const booking = await BookingModel.create({
      user: userId,
      vendor: isHall.vendor, 
      hall,
      eventType,
      guestCount,
      specialRequests: specialRequests || null,
      bookingDate: requestedDate,
      slot: {
        startTime: requestedStart,
        endTime: requestedEnd,
      }
    });

    return res.status(201).json({
      success: true,
      data: booking,
      message: "Booking request sent successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
};


export default createBooking;