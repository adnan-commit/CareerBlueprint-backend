const SKILL_DB = [
  "javascript", "react", "node", "express",
  "mongodb", "sql", "python", "java",
  "html", "css", "typescript", "next.js",
  "aws", "docker", "kubernetes", "git",
  "rest", "graphql", "redis", "linux",
  "c++", "c#", "ruby", "php",
  "go", "swift", "flutter", "dart",
  
  
];

export const extractSkills = (text) => {
  const foundSkills = [];

  const lowerText = text.toLowerCase();

  for (const skill of SKILL_DB) {
    if (lowerText.includes(skill)) {
      foundSkills.push(skill);
    }
  }

  return foundSkills;
};