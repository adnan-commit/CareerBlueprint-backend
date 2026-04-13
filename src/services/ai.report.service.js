import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { buildReportPrompt } from "../utils/buildIReportPrompt.js";
import { aiCircuitBreaker } from "../utils/aiCircuitBreaker.js";
import { generateFallbackReport } from "../utils/aiReportFallback.js";
import { guardAIResponse } from "../utils/aiResponseGuard.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

/* ----------------------------- SCHEMAS ----------------------------- */

const reportSchema = z.object({
  personalDetails: z.object({
    name: z.string().default("Applicant"),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    links: z.array(z.string()).default([]),
  }),
  education: z
    .array(
      z.object({
        degree: z.string(),
        institution: z.string(),
        year: z.string(),
      }),
    )
    .default([]),

  matchScore: z.number().min(0).max(100),
  companyName: z.string().optional(),
  title: z.string(),

  companyInsights: z.string(),
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }),
  ),
  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }),
  ),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
      resources: z
        .array(
          z.object({
            title: z.string(),
            url: z.string().url(),
          }),
        )
        .default([]),
    }),
  ),
  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    }),
  ),
});

/* ---------------------- SMART MODEL SWITCHER ---------------------- */

const MODELS_PRIORITY = [
  "gemini-3-flash-preview",
  "gemini-3.1-flash-lite-preview",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
];

const withSmartRetry = async (callback) => {
  let lastError;

  for (const modelName of MODELS_PRIORITY) {
    try {
      console.log(` Trying with model: ${modelName}`);
      
      return await callback(modelName); 
      
    } catch (err) {
      lastError = err;
      console.warn(` Model ${modelName} failed. Switching... Reason: ${err.message}`);
    }
  }
  throw lastError;
};


/* ---------------------- INTERVIEW REPORT ---------------------- */

export const generateReportService = async ({
  resume,
  skills = [],
  experience = "",
  education = "",
  projects = "",
  selfDescription,
  jobDescription,
  companyName,
}) => {
  const fallback = () =>
    generateFallbackReport({
      resume,
      jobDescription,
      selfDescription,
    });

  try {
    const prompt = buildReportPrompt({
      resume,
      skills,
      experience,
      education,
      projects,
      jobDescription,
      selfDescription,
      companyName,
    });

    //  CIRCUIT BREAKER
    if (aiCircuitBreaker.isOpen()) {
      console.warn(" Circuit OPEN → returning fallback");
      return fallback();
    }

    //  AI CALL (WITH RETRY WRAPPED)
    let response;

    try {
      response = await withSmartRetry(async (modelName) => {
        return await ai.models.generateContent({
          model: modelName, // <-- Dynamic Model Name
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            responseMimeType: "application/json",
          },
        });
      });
    } catch (err) {
      console.error("AI CALL FAILED:", err.message);
      aiCircuitBreaker.recordFailure();
      return fallback();
    }


    //  EXTRACT TEXT
    const raw =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || response?.text;



    if (!raw || typeof raw !== "string" || raw.trim().length === 0) {
      aiCircuitBreaker.recordFailure();
      return fallback();
    }


    //  SAFE PARSE
    let parsed;
    try {
      parsed = guardAIResponse(raw);
    } catch (err) {
      aiCircuitBreaker.recordFailure();
      return fallback();
    }


    if (!parsed) {
      aiCircuitBreaker.recordFailure();
      return fallback();
    }

    //  SUCCESS
    aiCircuitBreaker.recordSuccess();

    const safeParsed = {
      personalDetails: parsed?.personalDetails,
      education: parsed?.education ?? [],
      title: parsed?.title ?? "Software Engineer",
      companyName: companyName || "General",
      matchScore: parsed?.matchScore ?? 50,
      companyInsights: parsed?.companyInsights, //changed
      technicalQuestions: parsed?.technicalQuestions ?? [],
      behavioralQuestions: parsed?.behavioralQuestions ?? [],
      skillGaps: parsed?.skillGaps ?? [],
      preparationPlan: parsed?.preparationPlan ?? [],
    };

    return reportSchema.parse(safeParsed);
  } catch (error) {
    console.error("AI PROCESSING FAILED:", error.message);
    aiCircuitBreaker.recordFailure();
    return fallback();
  }
};
