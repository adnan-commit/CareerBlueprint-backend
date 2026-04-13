import { cleanResumeText } from "./cleanResume.js";
import { parseResume } from "./parseResume.js";
import {extractSkills} from "./extractSkills.js";


export const processResume = (rawText) => {
  const cleaned = cleanResumeText(rawText);

  const sections = parseResume(cleaned);

  const skills = extractSkills(sections.skills || cleaned);

  return {
    raw: cleaned,
    ...sections,
    skills,
  };
};