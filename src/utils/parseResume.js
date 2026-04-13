export const parseResume = (text) => {
  const sections = {
    skills: "",
    experience: "",
    education: "",
    projects: "",
  };

  const lowerText = text.toLowerCase();

  const extractSection = (startKeywords, endKeywords) => {
    let startIndex = -1;

    for (const keyword of startKeywords) {
      const index = lowerText.indexOf(keyword);
      if (index !== -1) {
        startIndex = index;
        break;
      }
    }

    if (startIndex === -1) return "";

    let endIndex = text.length;

    for (const keyword of endKeywords) {
      const index = lowerText.indexOf(keyword, startIndex + 1);
      if (index !== -1) {
        endIndex = index;
        break;
      }
    }

    return text.substring(startIndex, endIndex).trim();
  };

  sections.skills = extractSection(
    ["skills", "technical skills", "tech stack"],
    ["experience", "projects", "education"]
  );

  sections.experience = extractSection(
    ["experience", "work experience"],
    ["projects", "education", "skills"]
  );

  sections.projects = extractSection(
    ["projects"],
    ["experience", "education", "skills"]
  );

  sections.education = extractSection(
    ["education"],
    ["experience", "projects", "skills"]
  );

  return sections;
};