import AddressModel from "../../address/model/address.model.js";
import DocumentModel from "../../document/model/document.model.js";
import { HallModel } from "../model/hall.model.js";


// Create Hall
export const createHall = async (req, res) => {
  try {
    const { hallName, description, address, pricePerSlot, capacity, amenities, images } = req.body;
    const owner = req.user._id;

    const isAddress = await AddressModel.findOne({_id: address, del: false}).select("_id")
    const isImages = await DocumentModel.findOne({_id: images, del: false}).select("_id")

    if(!isAddress){
        return res.status(404).json({
            success: false,
            message: "Address not found"
        })
    }

    if(!isImages){
        return res.status(404).json({
            success: false,
            message: "Image not found"
        })
    }

    const newHall = await HallModel.create({
      owner,
      hallName,
      description,
      address,
      pricePerSlot,
      capacity,
      amenities,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Hall created successfully",
      data: newHall,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};