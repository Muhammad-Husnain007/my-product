import express from "express";
import mongoose from "mongoose";
import { WalletModel } from "../model/wallet.model.js";


/**
 * POST /wallet/create
 * Create wallet for logged in user
 */

export const createWallet = async (req, res) => {
  try {
    const userId = req.user._id; 

    const existingWallet = await WalletModel.findOne({
      currencyCode: req.user.profile?.currencyCode,
      user: userId,
      active: true,
      del: false,
    })
      .select("_id user balance")
      .lean();

    if (existingWallet) {
      return res.status(409).json({
        success: false,
        message: "Wallet already exists",
        data: existingWallet,
      });
    }

    // create wallet
    const wallet = await WalletModel.create({
      user: userId,
      currencyCode: req.user.profile?.currencyCode,
    });

    return res.status(201).json({
      success: true,
      message: "Wallet created successfully",
      data: wallet,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
