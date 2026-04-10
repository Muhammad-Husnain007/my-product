// src/middlewares/validate.js
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate({ body: req.body });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

export default validate;
