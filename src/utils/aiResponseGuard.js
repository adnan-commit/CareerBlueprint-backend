import ApiError from "../utils/apiError.js";

/**
 * Safely parses AI response and fixes common failures
 */
export const safeParseAIResponse = (rawText) => {
  try {
    if (!rawText) {
      throw new ApiError(502, "Empty response from AI");
    }

    // 1. Extract JSON block safely
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new ApiError(502, "No JSON found in AI response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return parsed;
  } catch (error) {
    console.error("AI PARSE FAILED:", error.message);
    throw new ApiError(502, "Failed to parse AI response");

  }
};

/**
 * Ensures AI output matches expected structure
 */
export const normalizeAIOutput = (data) => {
  if (!data) return null;

  return {
    personalDetails: {
      name: data.personalDetails?.name || "Applicant",
      email: data.personalDetails?.email || "",
      phone: data.personalDetails?.phone || "",
      links: Array.isArray(data.personalDetails?.links)
        ? data.personalDetails.links
        : [],
    },
    education: Array.isArray(data.education)
      ? data.education.map((edu) => ({
          degree: edu.degree || "",
          institution: edu.institution || "",
          year: edu.year || "",
        }))
      : [],

    title: data.title || "Software Engineer",

    companyName: data.companyName || "General",
    matchScore: Number(data.matchScore) || 50,

    companyInsights:
      data.companyInsights ||
      data.company_insights ||
      "Focus on core technical fundamentals and behavioral alignment.",

    technicalQuestions: Array.isArray(data.technicalQuestions)
      ? data.technicalQuestions
      : [],

    behavioralQuestions: Array.isArray(data.behavioralQuestions)
      ? data.behavioralQuestions
      : [],

    skillGaps: Array.isArray(data.skillGaps)
      ? data.skillGaps.map((gap) => ({
          skill: gap.skill || "Unknown Skill",
          severity: gap.severity || "medium",
          resources: Array.isArray(gap.resources) ? gap.resources : [],
        }))
      : [],

    preparationPlan: Array.isArray(data.preparationPlan)
      ? data.preparationPlan
      : [],
  };
};

/**
 * Final safety wrapper
 */
export const guardAIResponse = (rawText) => {
  const parsed = safeParseAIResponse(rawText);

  if (!parsed) return null;

  return normalizeAIOutput(parsed);
};
