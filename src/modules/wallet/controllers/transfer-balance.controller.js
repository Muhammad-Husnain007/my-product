import mongoose from "mongoose";
import { WalletModel } from "../model/wallet.model.js";
import { convertAmount } from "../../../../services/converAmount.service.js";

export const transferBalance = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { amount, recipientWalletId } = req.body;
    const senderUserId = req.user._id;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    session.startTransaction();

    // Sender Wallet
    const senderWallet = await WalletModel.findOne({
      user: senderUserId,
      active: true,
      del: false,
    })
      .select("_id user balance currencyCode totalDebit")
      .session(session);

    if (!senderWallet) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Sender wallet not found",
      });
    }

    if (senderWallet.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // Recipient Wallet
    const recipientWallet = await WalletModel.findOne({
      _id: recipientWalletId,
      active: true,
      del: false,
    })
      .select("_id user balance currencyCode totalCredit")
      .session(session);

    if (!recipientWallet) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Recipient wallet not found",
      });
    }

    // Currency Conversion
    let convertedAmount = amount;

    if (
      senderWallet.currencyCode &&
      recipientWallet.currencyCode &&
      senderWallet.currencyCode !== recipientWallet.currencyCode
    ) {
      convertedAmount = await convertAmount(
        amount,
        senderWallet.currencyCode,
        recipientWallet.currencyCode,
      );
    }

    // Atomic Updates
    senderWallet.balance -= amount;
    senderWallet.totalDebit = (senderWallet.totalDebit || 0) + amount;

    recipientWallet.balance += convertedAmount;
    recipientWallet.totalCredit =
      (recipientWallet.totalCredit || 0) + convertedAmount;

    await senderWallet.save({ session });
    await recipientWallet.save({ session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Balance transferred successfully",
      data: {
        debitedAmount: amount,
        senderCurrency: senderWallet.currencyCode,
        creditedAmount: convertedAmount,
        recipientCurrency: recipientWallet.currencyCode,
      },
    });
  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({
      success: false,
      message: "An error occurred while transferring balance",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
