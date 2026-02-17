import ApiError from "../utils/ApiError.js";

const classBasedAccess = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.class) {
      return res.status(401).json(
        new ApiError({
          status: 401,
          error: "Unauthorized"
        })
      );
    }

    if (!allowedRoles.includes(req.user.class)) {
      return res.status(403).json(
        new ApiError({
          status: 403,
          error: "Access denied"
        })
      );
    }

    next();
  };
};

export default classBasedAccess;
