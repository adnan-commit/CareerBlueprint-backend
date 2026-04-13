export const scanFile = (file) => {
  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("File too large");
  }

  // ONLY scan file name + mimetype (safe approach)
  const meta = `${file.originalname} ${file.mimetype}`.toLowerCase();

  const suspiciousPatterns = [
    "<script>",
    "javascript:",
    "eval(",
    "onerror=",
    "onload=",
  ];

  for (const pattern of suspiciousPatterns) {
    if (meta.includes(pattern)) {
      throw new Error("Malicious file detected");
    }
  }

  return true;
};
