import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/dissertations";

/* ---------------------------------------
   Ensure upload directory exists
---------------------------------------- */
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ---------------------------------------
   Storage configuration
---------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.random().toString(36).slice(2) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

/* ---------------------------------------
   File filter (PDF only)
---------------------------------------- */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

/* ---------------------------------------
   Multer export
---------------------------------------- */
const upload = multer({
  storage,
  fileFilter
});

export default upload;
