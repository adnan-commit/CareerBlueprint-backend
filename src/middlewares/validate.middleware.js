import ApiError from "../utils/apiError.js";

const validate = (schema) => (req, res, next) => {
  const data = {
    ...req.body,
  };

  const { error } = schema.validate(data);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  next();
};

export default validate;