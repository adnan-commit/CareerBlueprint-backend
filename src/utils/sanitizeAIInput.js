export const sanitizeAIInput = (processedResume, extra = {}) => {
  return {
    //  core resume
    raw: processedResume.raw || "",

    //  structured sections (never undefined)
    skills: Array.isArray(processedResume.skills)
      ? processedResume.skills
      : [],

    experience: processedResume.experience || "Not available",

    education: processedResume.education || "Not available",

    projects: processedResume.projects || "Not available",

    //  extra inputs (job + user)
    jobDescription: extra.jobDescription || "",
    selfDescription: extra.selfDescription || "",

    companyName: extra.companyName || "",

    

    // safety metadata (optional but useful)
    meta: {
      hasSkills: !!processedResume.skills?.length,
      hasExperience: !!processedResume.experience,
      hasProjects: !!processedResume.projects,
    },
  };
};