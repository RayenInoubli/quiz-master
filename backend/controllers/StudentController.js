import QuizModel from "../models/QuizModel.js";

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await QuizModel.aggregate([
      {
        $match: { isPublished: true },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseSource",
          foreignField: "_id",
          as: "courseSource",
          pipeline: [{ $project: { title: 1 } }],
        },
      },
      {
        $unwind: {
          path: "$courseSource",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          validatedQuestionsCount: {
            $size: {
              $filter: {
                input: "$questions",
                as: "question",
                cond: { $eq: ["$$question.status", true] },
              },
            },
          },
          // Pour garder le count total des questions
          totalQuestionsCount: { $size: "$questions" },
        },
      },
      {
        $project: {
          questions: 0, // Exclure les questions pour alléger la réponse
          "courseSource._id": 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: quizzes,
      count: quizzes.length,
      message: "Liste des quiz récupérée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des quiz",
      error: error.message,
    });
  }
};

// Récupérer un quiz par ID avec toutes ses questions
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'ID est valide
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID de quiz invalide",
      });
    }

    // Récupérer le quiz avec populate pour les références
    const quiz = await QuizModel.findById(id)
      .populate("courseSource", "title description") // Optionnel : populate le cours
      .populate("teacher", "name email"); // Optionnel : populate l'enseignant

    // Vérifier si le quiz existe
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz non trouvé",
      });
    }

    // Filtrer pour ne garder que les questions avec status === true
    quiz.questions = quiz.questions.filter(
      (question) => question.status === true
    );

    // Trier les questions par ordre
    quiz.questions.sort((a, b) => a.order - b.order);

    return res.status(200).json({
      success: true,
      data: quiz,
      message: "Quiz récupéré avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération du quiz",
      error: error.message,
    });
  }
};

// Récupérer uniquement les questions d'un quiz (pour optimisation)
export const getQuizQuestions = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID de quiz invalide",
      });
    }

    const quiz = await QuizModel.findById(id).select("questions title");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz non trouvé",
      });
    }

    // Trier les questions par ordre
    quiz.questions.sort((a, b) => a.order - b.order);

    // Filter questions where status is true
    const validQuestions = quiz.questions.filter((q) => q.status === true);

    return res.status(200).json({
      success: true,
      data: {
        title: quiz.title,
        questions: validQuestions,
      },
      message: "Questions récupérées avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des questions:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des questions",
      error: error.message,
    });
  }
};


// Soumettre les réponses d'un quiz et calculer le score
export const submitQuizAnswers = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // Format: { questionIndex: answerIndex, ... }

    // Validation
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID de quiz invalide",
      });
    }

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "Format de réponses invalide",
      });
    }

    // Récupérer le quiz
    const quiz = await QuizModel.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz non trouvé",
      });
    }

    // IMPORTANT: Filter only validated questions (status === true)
    // This must match what the frontend received
    const validatedQuestions = quiz.questions.filter(
      (question) => question.status === true
    );

    // Sort by order to ensure consistency
    validatedQuestions.sort((a, b) => a.order - b.order);

    // Calculer le score
    let correctAnswers = 0;
    const totalQuestions = validatedQuestions.length;
    const detailedResults = [];

    validatedQuestions.forEach((question, index) => {
      const userAnswerIndex = answers[index];
      
      if (userAnswerIndex === undefined || userAnswerIndex === null) {
        // Question non répondue
        detailedResults.push({
          questionId: question._id,
          questionText: question.text,
          userAnswerIndex: null,
          correctAnswerIndex: question.answers.findIndex(a => a.isCorrect),
          isCorrect: false,
          answered: false,
        });
        return;
      }

      const correctAnswerIndex = question.answers.findIndex(
        (answer) => answer.isCorrect
      );
      const isCorrect = userAnswerIndex === correctAnswerIndex;

      if (isCorrect) {
        correctAnswers++;
      }

      detailedResults.push({
        questionId: question._id,
        questionText: question.text,
        questionOrder: question.order,
        userAnswerIndex: userAnswerIndex,
        userAnswerText: question.answers[userAnswerIndex]?.text || "Non répondu",
        correctAnswerIndex: correctAnswerIndex,
        correctAnswerText: question.answers[correctAnswerIndex]?.text,
        isCorrect: isCorrect,
        answered: true,
        allAnswers: question.answers.map((answer, idx) => ({
          text: answer.text,
          isCorrect: answer.isCorrect,
          wasSelected: idx === userAnswerIndex,
        })),
      });
    });

    // Calculer le pourcentage
    const scorePercentage = totalQuestions > 0 
      ? ((correctAnswers / totalQuestions) * 100).toFixed(2)
      : 0;

    // Déterminer le statut
    let status = "failed";
    if (scorePercentage >= 80) {
      status = "excellent";
    } else if (scorePercentage >= 60) {
      status = "good";
    } else if (scorePercentage >= 50) {
      status = "passed";
    }

    const result = {
      quizId: quiz._id,
      quizTitle: quiz.title,
      totalQuestions: totalQuestions,
      correctAnswers: correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      scorePercentage: parseFloat(scorePercentage),
      status: status,
      detailedResults: detailedResults,
      completedAt: new Date(),
    };

    // TODO: Sauvegarder le résultat dans une collection "QuizAttempts" si nécessaire
    // const attempt = new QuizAttempt({ userId, quizId, result });
    // await attempt.save();

    return res.status(200).json({
      success: true,
      data: result,
      message: "Quiz soumis avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la soumission du quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la soumission du quiz",
      error: error.message,
    });
  }
};
