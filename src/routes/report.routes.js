import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/file.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
  generateReport,
  getReportById,
  getAllReports,
} from "../controllers/report.controller.js";

import { generateReportSchema } from "../validations/report.validation.js";
import { aiLimiter } from "../middlewares/rateLimit.middleware.js";
import { getOptimizedResume } from "../controllers/resume.controller.js";

const reportRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description Generate interview report (resume + selfDescription + jobDescription)
 * @access Private
 */
reportRouter.post(
  "/",
  authUser,
  aiLimiter, //  aggressive rate limit for heavy AI endpoint
  upload.single("resume"),
  validate(generateReportSchema),
  generateReport,
);

/**
 * @route GET /api/interview/
 * @description Get all interview reports of logged-in user
 * @access Private
 */
reportRouter.get("/all", authUser, getAllReports);

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by ID
 * @access Private
 */
reportRouter.get(
  "/:reportId",
  authUser,
  getReportById,
);



// routes/interview.routes.js (ya resume.routes.js)

reportRouter.post(
  "/:reportId/optimize-resume",
  authUser,
  aiLimiter,
  getOptimizedResume,
);

export default reportRouter;
