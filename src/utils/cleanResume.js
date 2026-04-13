export const cleanResumeText = (text) => {
  return text
    .replace(/\r/g, "")
    .replace(/\n{2,}/g, "\n") // remove extra new lines
    .replace(/\t/g, " ")
    .replace(/ +/g, " ") // multiple spaces
    .trim();
};