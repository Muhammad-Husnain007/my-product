import mongoose from "mongoose";
import BookingModel from "../../booking/model/booking.model";
import { PaymentModel } from "../model/payment.model";


export const createPayment = async (req, res) => {

  const session = await mongoose.startSession();

  session.startTransaction();

  try {

    const userId = req.user._id;

    const {
      bookingId,
      type,
      paymentMethod,
      advanceAmount,
      remainingAmount,
    } = req.body;

    // ==================================================
    // BOOKING FIND
    // ==================================================

    const booking = await BookingModel.findOne({
      _id: bookingId,
      user: userId,
      del: false,
      status: "accepted",
    })
      .populate({
        path: "hall",
        select: "owner pricePerSlot",
      })
      .session(session)
      .lean();

    if (!booking) {

      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Booking not found or not accepted",
      });
    }

    // ==================================================
    // ALREADY PAID CHECK
    // ==================================================

    const alreadyPaid = await PaymentModel.findOne({
      booking: bookingId,
      paymentStatus: "paid",
      del: false,
    }).session(session);

    if (alreadyPaid) {

      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Payment already completed",
      });
    }

    // ==================================================
    // TOTAL AMOUNT
    // ==================================================

    const totalAmount = booking.pricePerSlot;
    let advanceIs = (totalAmount / 100) * 10; // 10% advance 

    // ==================================================
    // ADVANCE / FULL LOGIC
    // ==================================================

    let paidAmount = 0;

    let remainingAmount = 0;

    if (type === "advanced") {
       
        

    } else if (type === "full") {

      

    } else {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Invalid payment type",
      });
    }

    // ==================================================
    // COMMISSION
    // ==================================================

    const commissionPercentage = 10;

    const commissionAmount =
      (paidAmount * commissionPercentage) / 100;

    const vendorReceivedAmount =
      paidAmount - commissionAmount;

    // ==================================================
    // CREATE PAYMENT
    // ==================================================

    const payments = await PaymentModel.create(
      [
        {
          booking: booking._id,

          user: userId,

          vendor: booking.hall.owner,

          type,

          totalAmount,

          advanceAmount:
            type === "advanced"
              ? advanceAmount
              : totalAmount,

          remainingAmount,

          commissionPercentage,

          commissionAmount,

          vendorReceivedAmount,

          paymentMethod,

          transactionId,

          paymentStatus: "paid",

          paidAt: new Date(),
        },
      ],
      { session }
    );

    const payment = payments[0];

    // ==================================================
    // WALLET FIND / CREATE
    // ==================================================

    let wallet = await WalletModel.findOne({
      user: booking.hall.owner,
    }).session(session);

    if (!wallet) {

      const wallets = await WalletModel.create(
        [
          {
            user: booking.hall.owner,
          },
        ],
        { session }
      );

      wallet = wallets[0];
    }

    const previousBalance = wallet.balance;

    // ==================================================
    // WALLET UPDATE
    // ==================================================

    wallet.balance += vendorReceivedAmount;

    wallet.totalEarning += vendorReceivedAmount;

    wallet.totalCommissionPaid += commissionAmount;

    await wallet.save({ session });

    // ==================================================
    // WALLET HISTORY
    // ==================================================

    await WalletHistoryModel.create(
      [
        {
          wallet: wallet._id,

          user: booking.hall.owner,

          booking: booking._id,

          payment: payment._id,

          type: "credit",

          amount: vendorReceivedAmount,

          previousBalance,

          currentBalance: wallet.balance,

          description: "Payment received",
        },
      ],
      { session }
    );

    // ==================================================
    // BOOKING STATUS
    // ==================================================

    if (type === "full") {

      booking.status = "completed";

    } else {

      booking.status = "partially_paid";
    }

    await booking.save({ session });

    // ==================================================
    // COMMIT
    // ==================================================

    await session.commitTransaction();

    session.endSession();

    return res.status(201).json({
      success: true,
      data: payment,
      message: "Payment successful",
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