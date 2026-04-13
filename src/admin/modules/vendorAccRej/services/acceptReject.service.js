import acceptRejectModel from "../model/acceptReject.model.js";

export const createAcceptRejectService = async (params) => {
  const { vendor, status, reason, reviewedBy } = params;

  try {
    const newAcceptReject = await acceptRejectModel.create({
      vendor,
      status,
      reason: reason || null,
      reviewedBy,
    });

    return newAcceptReject;
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    throw error;
  }
};
