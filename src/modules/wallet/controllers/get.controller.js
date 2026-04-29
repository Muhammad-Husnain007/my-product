import { WalletModel } from "../model/wallet.model.js";


export const getWallet = async (req, res) => {
  try {
    const userId = req.user._id;

    const wallet = await WalletModel.findOne({
      currencyCode: req.user.profile?.currencyCode,
      user: userId,
      active: true,
      del: false,
    })
      .select("_id user balance")
      .lean();

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Wallet retrieved successfully",
      data: wallet,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
