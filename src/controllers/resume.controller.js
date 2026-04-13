// controllers/resume.controller.js
import Report from "../models/report.model.js";
import { generateOptimizedResume } from "../services/ai.resume.service.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getOptimizedResume = asyncHandler(async (req, res) => {
  const { reportId } = req.params;

  const report = await Report.findOne({ _id: reportId, user: req.user.id }).select("+resume");
  if (!report) throw new ApiError(404, "Report not found or unauthorized");


  if (report.optimizedResumeContent) {
    return res.status(200).json({
      success: true,
      message: "Fetched from cache",
      data: {
        personalDetails: report.personalDetails,
        education: report.education,
        optimizedContent: report.optimizedResumeContent
      }
    });
  }

  const optimizedData = await generateOptimizedResume({
    resume: report.resume,
    jobDescription: report.jobDescription,
    skillGaps: report.skillGaps
  });

  report.optimizedResumeContent = optimizedData;
  await report.save();

  return res.status(200).json({
    success: true,
    message: "Resume optimized successfully",
    data: {
      personalDetails: report.personalDetails,
      education: report.education,
      optimizedContent: optimizedData
    }
  });
});