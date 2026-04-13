import Report from "../models/report.model.js";
import { generateReportService } from "../services/ai.report.service.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { scanFile } from "../utils/fileScanner.js";
import { generateHash } from "../utils/hash.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { processResume } from "../utils/processResume.js";
import { sanitizeAIInput } from "../utils/sanitizeAIInput.js";

/**
 * @name generateReport
 */
export const generateReport = asyncHandler(
  async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "Resume file is required");
    }

    const { selfDescription, jobDescription, companyName } = req.body;

    //  Security scan
    scanFile(req.file);

    //  Extract PDF text
    let text = await extractTextFromPDF(req.file);

    const processed = processResume(text);

    const safeInput = sanitizeAIInput(processed, {
      selfDescription,
      jobDescription,
      companyName,
    });

    if (!text || text.trim().length < 50) {
      throw new ApiError(400, "Invalid or empty resume content");
    }

    //  LIMIT TEXT (VERY IMPORTANT FOR AI COST + SPEED)
    const MAX_CHARS = 8000;
    if (text.length > MAX_CHARS) {
      text = text.slice(0, MAX_CHARS);
    }

    const hash = generateHash({
      resume: text.slice(0, 3000), //  reduce size
      selfDescription,
      jobDescription,
      companyName: companyName?.toLowerCase().trim(),
    });

    const existingReport = await Report.findOne({
      hash,
    }).lean();

    if (existingReport) {
      // clone for new user (optional)
      return res.status(200).json({
        success: true,
        message: "Cached result",
        data: existingReport,
      });
    }

    //  AI Processing
    const aiReport = await generateReportService({
      companyName: companyName?.toLowerCase(),
      resume: safeInput.raw,
      skills: safeInput.skills,
      experience: safeInput.experience,
      education: safeInput.education,
      projects: safeInput.projects,
      selfDescription: safeInput.selfDescription,
      jobDescription: safeInput.jobDescription,
      companyName: safeInput.companyName,
    });


    //  Save
    const report = await Report.create({
      user: req.user.id,
      hash,
      companyName: companyName?.toLowerCase(),
      resume: text,
      selfDescription,
      jobDescription,
      ...aiReport,
    });

    return res.status(201).json({
      success: true,
      message: "Report generated successfully",
      data: report,
    });
  },
);

/**
 * @name getReportById
 */
export const getReportById = asyncHandler(
  async (req, res) => {
    const { reportId } = req.params;

    const report = await Report.findOne({
      _id: reportId,
      user: req.user.id,
    });

    if (!report) {
      throw new ApiError(404, "Report not found");
    }

    return res.status(200).json({
      success: true,
      message: "Report fetched successfully",
      data: report,
    });
  },
);

/**
 * @name getAllReports
 */
export const getAllReports = asyncHandler(
  async (req, res) => {

    const reports = await Report.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
      );


    return res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      data: reports,
    });
  },
);
