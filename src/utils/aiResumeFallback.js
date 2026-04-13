export const generateResumeFallback = (resumeText) => {
  return {
    summary:
      "Dedicated Software Engineer with a strong foundation in full-stack development and problem-solving.",
    optimizedExperience: [], // Empty means frontend will show original
    optimizedProjects: [],
    suggestedSkills: [
      "Full Stack Development",
      "Problem Solving",
      "Software Engineering",
    ],
    isFallback: true,
  };
};
