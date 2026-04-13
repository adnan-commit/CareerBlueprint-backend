import Joi from "joi";

export const generateReportSchema = Joi.object({
  selfDescription: Joi.string().min(20).required(),
  jobDescription: Joi.string().min(20).required(),
  companyName: Joi.string().min(2).max(100).optional(),
});