import { WalletModel } from "../model/wallet.model.js";

export const deleteWallet = async (req, res) => {
  try {
    const userId = req.user._id;
    const wallet = await WalletModel.findOneAndUpdate(
      {
        currencyCode: req.user.profile?.currencyCode,
        user: userId,
        active: true,
        del: false,
      },
        {
        active: false,
        del: true,
      },
        { new: true }
    )
      .select("_id balance")
      .lean();
   
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    if (wallet.balance > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete wallet with non-zero balance",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Wallet deleted successfully",
      data: wallet,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
        message: "Internal server error",
    });
  }
};