import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { buildResumePrompt } from "../utils/buildResumePrompt.js";
import { aiCircuitBreaker } from "../utils/aiCircuitBreaker.js";
import { generateResumeFallback } from "../utils/aiResumeFallback.js";
import { guardResumeResponse } from "../utils/aiResumeGuard.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

/* ----------------------------- SCHEMA ----------------------------- */

const optimizedResumeSchema = z.object({
  summary: z.string(),
  optimizedExperience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      duration: z.string(),
      bullets: z.array(z.string()),
    }),
  ),
  optimizedProjects: z.array(
    z.object({
      title: z.string(),
      techStack: z.string(),
      bullets: z.array(z.string()),
    }),
  ),
  suggestedSkills: z.array(z.string()),
  isFallback: z.boolean().default(false),
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
      
      // Callback ko modelName pass kar rahe hain
      return await callback(modelName); 
      
    } catch (err) {
      lastError = err;
      console.warn(` Model ${modelName} failed. Switching... Reason: ${err.message}`);
    }
  }
  throw lastError;
};

  


/* ---------------------- RESUME SERVICE ---------------------- */

export const generateOptimizedResume = async ({
  resume,
  jobDescription,
  skillGaps,
}) => {
  const fallback = () => generateResumeFallback(resume);

  try {
    const prompt = buildResumePrompt({ resume, jobDescription, skillGaps });

    // CIRCUIT BREAKER
    if (aiCircuitBreaker.isOpen()) {
      console.warn("Resume Circuit OPEN → returning fallback");
      return fallback();
    }

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
      console.error("RESUME AI CALL FAILED:", err.message);
      aiCircuitBreaker.recordFailure();
      return fallback();
    }

    const raw =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      response?.text;

    if (!raw) {
        console.error("AI Response was empty");
      aiCircuitBreaker.recordFailure();
      return fallback();
    }

    // SAFE PARSE & GUARD
    const parsed = guardResumeResponse(raw);

    if (!parsed) {
      aiCircuitBreaker.recordFailure();
      return fallback();
    }

    // SUCCESS
    aiCircuitBreaker.recordSuccess();

    return optimizedResumeSchema.parse(parsed);
  } catch (error) {
    console.error("RESUME SERVICE ERROR:", error.message);
    aiCircuitBreaker.recordFailure();
    return fallback();
  }
};
