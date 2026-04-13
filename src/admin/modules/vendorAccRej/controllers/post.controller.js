import VendorModel from "../../../../modules/onboarding/model/vendor.model.js";
import { createAcceptRejectService } from "../services/acceptReject.service.js";

// Create Accept/Reject Record
export const createAcceptReject = async (req, res) => {
  try {
    const { vendor, status, reason } = req.body;
    const reviewedBy = req.user._id;

    const checkVendor = await VendorModel.findOneAndUpdate(
      {
        _id: vendor,
        del: false,
      },
      {
        $set: {
          status: status,
        },
      },
    )
      .select("_id")
      .lean();

    if (!checkVendor) {
      return res.status(400).json({
        success: false,
        message: "Request deleted",
      });
    }

    // Call service
    const result = await createAcceptRejectService({
      vendor,
      status,
      reason,
      reviewedBy,
    });

    return res.status(201).json({
      success: true,
      message: `Vendor ${status} record created successfully`,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};
