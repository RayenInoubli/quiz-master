import axios from "axios";

const API_URL = "http://localhost:4000/api/v1/students"; // Ajustez selon votre configuration

// Récupérer tous les quiz (sans questions)
export const getAllQuizzes = async () => {
  try {
    const response = await axios.get(`${API_URL}/quizzs`);
    return response.data.data; // Retourne directement le tableau de quiz
  } catch (error) {
    console.error("Erreur lors de la récupération des quiz:", error);
    throw error;
  }
};

// Récupérer un quiz complet par ID (avec toutes ses questions)
export const getQuizById = async (quizId) => {
  try {
    const response = await axios.get(`${API_URL}/quizzes/${quizId}`);
    return response.data.data; // Retourne le quiz complet
  } catch (error) {
    console.error("Erreur lors de la récupération du quiz:", error);
    throw error;
  }
};

// Récupérer uniquement les questions d'un quiz
export const getQuizQuestions = async (quizId) => {
  try {
    const response = await axios.get(`${API_URL}/quizzes/${quizId}/questions`);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des questions:", error);
    throw error;
  }
};

// Soumettre les réponses d'un quiz (à implémenter selon vos besoins)
export const submitQuizAnswers = async (quizId, answers) => {
  try {
    const response = await axios.post(`${API_URL}/quizzes/${quizId}/submit`, {
      answers,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la soumission du quiz:", error);
    throw error;
  }
};
