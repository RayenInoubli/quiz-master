import express from "express";
import multer from "multer";
import path from "path";
import { uploadCourse } from "../controllers/CourseController.js";

const router = express.Router();

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(new Error("Seuls les fichiers PDF sont autorisés"), false);
  },
});

// Route Upload
router.post("/upload", upload.single("pdf"), uploadCourse);

export default router;
