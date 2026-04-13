import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";


export const extractTextFromPDF = async (file) => {
  if (!file?.buffer) {
    throw new Error("File buffer missing");
  }
  if (file.mimetype === "application/pdf") {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(file.buffer),
    });

    const pdf = await loadingTask.promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const pageText = content.items.map((item) => item.str).join(" ");
      text += pageText + "\n";
    }

    return text;
  }

  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value;
  }

  throw new Error("Unsupported file type (Only PDF & DOCX allowed)");
};


