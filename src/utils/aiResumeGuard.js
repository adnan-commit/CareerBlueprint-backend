export const guardResumeResponse = (rawText) => {
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      summary: parsed.summary || "",
      optimizedExperience: Array.isArray(parsed.optimizedExperience)
        ? parsed.optimizedExperience
        : [],
      optimizedProjects: Array.isArray(parsed.optimizedProjects)
        ? parsed.optimizedProjects
        : [],
      suggestedSkills: Array.isArray(parsed.suggestedSkills)
        ? parsed.suggestedSkills
        : [],
      isFallback: false,
    };
  } catch (error) {
    console.error("Resume Guard Error:", error.message);
    return null;
  }
};
