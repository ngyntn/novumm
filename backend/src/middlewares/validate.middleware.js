const { BadRequestError } = require("../utils/AppError");

module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });
  if (!result.success) {
    const firstError = result.error.issues[0];
    const errorMessage = `[${firstError.path.join(".")}]: ${
      firstError.message
    }`;
    return next(new BadRequestError(errorMessage));
  }

  req.body = result.data.body || req.body;
  req.params = result.data.params || req.params;
  req.query = result.data.query || req.query;
  next();
};
