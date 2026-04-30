import mongoose from "mongoose";
import BookingModel from "./../../booking/model/booking.model.js";
import { PaymentModel } from "../model/payment.model.js";
import { UserModel } from "../../user/model/user.model.js";

export const createPayment = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { bookingId, type } = req.body;

    // ======================================================
    // GET BOOKING
    // ======================================================

    const booking = await BookingModel.findById(bookingId)
      .populate("user")
      .populate({
        path: "hall",
        populate: {
          path: "owner",
        },
      })
      .session(session);

    if (!booking) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ======================================================
    // CHECK BOOKING STATUS
    // ======================================================

    if (booking.status !== "accepted") {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "Booking is not accepted yet",
      });
    }

    // ======================================================
    // GET USER & VENDOR
    // ======================================================

    const user = booking.user;
    const vendor = booking.hall.owner;

    if (!user || !vendor) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "User or Vendor not found",
      });
    }

    // ======================================================
    // TOTAL AMOUNT
    // ======================================================

    // CHANGE THIS FIELD NAME IF NEEDED
    const totalAmount = booking?.hall?.pricePerSlot 

    if (!totalAmount || totalAmount <= 0) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "Invalid total amount in booking",
      });
    }

    // ======================================================
    // ADVANCE AMOUNT (20%)
    // ======================================================

    const advanceAmount = totalAmount * 0.2;

    let payableAmount = 0;
    let remainingAmount = 0;

    // ======================================================
    // ADVANCE PAYMENT
    // ======================================================

    if (type === "advanced") {
      const alreadyPaidAdvance =
        await PaymentModel.findOne({
          booking: bookingId,
          type: "advanced",
          paymentStatus: "paid",
        }).session(session);

      if (alreadyPaidAdvance) {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          success: false,
          message: "Advance payment already completed",
        });
      }

      payableAmount = advanceAmount;
      remainingAmount = totalAmount - advanceAmount;
    }

    // ======================================================
    // FULL PAYMENT
    // ======================================================

    if (type === "full") {
      const alreadyPaidFull =
        await PaymentModel.findOne({
          booking: bookingId,
          type: "full",
          paymentStatus: "paid",
        }).session(session);

      if (alreadyPaidFull) {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          success: false,
          message: "Full payment already completed",
        });
      }

      // CHECK ADVANCE PAYMENT
      const advancePayment =
        await PaymentModel.findOne({
          booking: bookingId,
          type: "advanced",
          paymentStatus: "paid",
        }).session(session);

      if (advancePayment) {
        // ONLY REMAINING AMOUNT
        payableAmount =
          advancePayment.remainingAmount;
      } else {
        // DIRECT FULL PAYMENT
        payableAmount = totalAmount;
      }

      remainingAmount = 0;
    }

    // ======================================================
    // CHECK WALLET BALANCE
    // ======================================================

    if (user.wallet < payableAmount) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance",
      });
    }

    // ======================================================
    // COMMISSION
    // ======================================================

    const commissionPercentage = 10;

    const commissionAmount =
      (payableAmount * commissionPercentage) /
      100;

    const vendorReceivedAmount =
      payableAmount - commissionAmount;

    // ======================================================
    // UPDATE USER WALLET
    // ======================================================

    user.wallet -= payableAmount;

    // ======================================================
    // UPDATE VENDOR WALLET
    // ======================================================

    vendor.wallet += vendorReceivedAmount;

    await user.save({ session });
    await vendor.save({ session });

    // ======================================================
    // CREATE PAYMENT
    // ======================================================

    const payment = await PaymentModel.create(
      [
        {
          booking: booking._id,

          user: user._id,

          vendor: vendor._id,

          type,

          totalAmount,

          advanceAmount:
            type === "advanced"
              ? payableAmount
              : advanceAmount,

          remainingAmount,

          commissionPercentage,

          commissionAmount,

          vendorReceivedAmount,

          // paymentMethod: "cash",

          transactionId: `TXN-${Date.now()}`,

          paymentStatus: "paid",

          paidAt: new Date(),
        },
      ],
      { session }
    );

    // ======================================================
    // COMMIT TRANSACTION
    // ======================================================
    booking.status = "completed"
    await booking.save({ session });
    await session.commitTransaction();

    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Payment successful",

      payment: payment[0],

      userWallet: user.wallet,

      vendorWallet: vendor.wallet,
    });
  } catch (error) {
    await session.abortTransaction();

    session.endSession();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
