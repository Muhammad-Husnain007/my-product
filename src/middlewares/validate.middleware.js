const validate = (schema) => (req, res, next) => {
  const isComplex = schema?.body || schema?.params || schema?.query;

  if (isComplex) {
    const targets = { body: req.body, params: req.params, query: req.query };

    for (const key of ["body", "params", "query"]) {
      if (!schema[key]) continue;

      const { error } = schema[key].validate(targets[key], { abortEarly: true });
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
    }

    return next();
  }

  // Simple: validate req.body directly
  const { error } = schema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

export default validate;