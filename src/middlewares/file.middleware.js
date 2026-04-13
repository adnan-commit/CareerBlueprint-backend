import multer from "multer";

//  Use memory storage (for PDF parsing / AI processing)
const storage = multer.memoryStorage();

//  File filter (only allow PDFs)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed"), false);
  }
};

//  Multer config
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

export default upload;

export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message,
    });
  } else if (err) {
    return res.status(400).json({
      message: err.message,
    });
  }

  next();
};
