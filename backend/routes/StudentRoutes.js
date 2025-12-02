import express from "express";
import { getAllQuizzes, getQuizById, getQuizQuestions, submitQuizAnswers } from "../controllers/StudentController.js";

const router = express.Router();

router.get("/quizzs", getAllQuizzes);
// Route pour récupérer un quiz complet par ID (avec questions)
router.get("/quizzes/:id", getQuizById);

// Route pour récupérer uniquement les questions d'un quiz
router.get("/quizzes/:id/questions", getQuizQuestions);

// Route pour soumettre les réponses d'un quiz
router.post("/quizzes/:id/submit", submitQuizAnswers);

export default router;
