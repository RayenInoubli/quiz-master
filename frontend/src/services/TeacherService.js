const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

console.log("API URL configurée:", API_BASE_URL);

export const teacherService = {
  /**
   * Récupérer tous les quiz d'un enseignant
   */
  async getAllQuizzes() {
    try {
      console.log("Fetching from:", `${API_BASE_URL}/api/v1/teachers/quizz`);

      const response = await fetch(`${API_BASE_URL}/api/v1/teachers/quizz`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Get quizzes fetch error:", error);
      throw new Error(
        `Impossible de charger les quiz. Vérifiez que le serveur est démarré.`
      );
    }
  },

  /**
   * Récupérer les détails d'un quiz spécifique avec ses questions
   */
  async getQuizDetails(quizId) {
    try {
      console.log(
        "Fetching quiz details from:",
        `${API_BASE_URL}/teachers/quizz/${quizId}`
      );

      const response = await fetch(
        `${API_BASE_URL}/api/v1/teachers/quizz/${quizId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Get quiz details fetch error:", error);
      throw new Error(`Impossible de charger les détails du quiz.`);
    }
  },

  /**
   * Mettre à jour le statut d'une question
   */
  async updateQuestionStatus(quizId, questionId, status) {
    try {
      console.log("Updating question status:", { quizId, questionId, status });

      const response = await fetch(
        `${API_BASE_URL}/api/v1/teachers/quizz/${quizId}/questions/${questionId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Update question status error:", error);
      throw new Error(`Impossible de mettre à jour le statut de la question.`);
    }
  },

  /**
   * Supprimer un quiz
   */
  async deleteQuiz(quizId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/teachers/quizz/${quizId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Delete quiz error:", error);
      throw error;
    }
  },

  /**
   * Publier un quiz
   */
  async publishQuiz(quizId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/teachers/quizz/${quizId}/publish`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Publish quiz error:", error);
      throw new Error("Impossible de publier le quiz.");
    }
  },

  async unpublishQuiz(quizId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/teachers/quizz/${quizId}/unpublish`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Unpublish quiz error:", error);
      throw new Error("Impossible de dépublier le quiz.");
    }
  },
  
  /**
   * Générer un quiz à partir d'un cours
   */
  async generateQuiz({ courseId, title, description, numberOfQuestions }) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/teachers/quizz/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId,
            title,
            description,
            numberOfQuestions,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Generate quiz error:", error);
      throw new Error("Impossible de générer le quiz.");
    }
  },
};
