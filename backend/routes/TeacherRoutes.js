import express from "express";
import {
  getAllQuizzes,
  getQuizById,
  updateQuestionStatus,
  createQuiz,
  deleteQuiz,
  publishQuiz,
  generateQuizFromCourse,
} from "../controllers/TeacherController.js";

const router = express.Router();

// Routes pour les quiz
router.get("/quizz", getAllQuizzes);
router.get("/quizz/:id", getQuizById);
router.post("/quizz", createQuiz);
router.delete("/quizz/:id", deleteQuiz);
router.patch("/quizz/:id/publish", publishQuiz);
router.post("/quizz/generate", generateQuizFromCourse);

// Route pour mettre à jour le statut d'une question
router.patch(
  "/quizz/:quizId/questions/:questionId/status",
  updateQuestionStatus
);

export default router;
