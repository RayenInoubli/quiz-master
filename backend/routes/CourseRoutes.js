import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getAllCourses, uploadCourse } from "../controllers/CourseController.js";

const router = express.Router();

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads";
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    } catch (e) {
      cb(e, dir);
    }
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      // PDF
      'application/pdf',
      // Word
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // Excel
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // PowerPoint
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // Images
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Archives
      'application/zip', 'application/x-rar-compressed',
      // Autres
      'text/plain', 'application/json'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'), false);
    }
  }
});

// Route Upload
router.post("/upload", upload.single("pdf"), uploadCourse);
router.get("/", getAllCourses);
export default router;
