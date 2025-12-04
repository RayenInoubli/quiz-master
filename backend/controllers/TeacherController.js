import QuizModel from "../models/QuizModel.js";
import Course from "../models/Course.js";


export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await QuizModel.find()
      .populate({
        path: "courseSource",
        select: "name url", // Sélectionnez seulement le nom et l'URL du cours
      })
      .select("title description courseSource createdAt questionsCount")
      .sort({ createdAt: -1 })
      .lean();

    // Transformez les données pour avoir un format plus pratique
    const formattedQuizzes = quizzes.map((quiz) => ({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      courseSource: quiz.courseSource
        ? quiz.courseSource.name
        : "Cours inconnu",
      createdAt: quiz.createdAt,
      questionsCount: quiz.questionsCount,
    }));

    res.status(200).json(formattedQuizzes);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des quiz:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des quiz",
      error: error.message,
    });
  }
};


export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await QuizModel.findById(id)
      .populate({
        path: "courseSource",
        select: "name", // Inclure plus d'informations si besoin
      })
      .lean(); // .lean() retourne un objet JavaScript simple

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz non trouvé",
      });
    }

    // Puisque quiz est déjà un objet JavaScript (grâce à .lean()),
    // vous pouvez l'utiliser directement
    const formattedQuiz = {
      ...quiz,
      courseSource: quiz.courseSource
        ? quiz.courseSource.name
        : "Cours inconnu",
    };

    res.status(200).json(formattedQuiz);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du quiz:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération du quiz",
      error: error.message,
    });
  }
};

export const updateQuestionStatus = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const { status } = req.body;

    // Validation du statut
    if (typeof status !== "boolean") {
      return res.status(400).json({
        message: "Le statut doit être un booléen (true ou false)",
      });
    }

    // Trouver le quiz
    const quiz = await QuizModel.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz non trouvé",
      });
    }

    // Trouver la question dans le quiz
    const question = quiz.questions.id(questionId);

    if (!question) {
      return res.status(404).json({
        message: "Question non trouvée dans ce quiz",
      });
    }

    // Mettre à jour le statut
    question.status = status;
    await quiz.save();

    res.status(200).json({
      message: `Question ${status ? "validée" : "rejetée"} avec succès`,
      question: {
        _id: question._id,
        text: question.text,
        status: question.status,
      },
    });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du statut:", error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour du statut de la question",
      error: error.message,
    });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const { title, description, courseSource, questions } = req.body;

    // Validation des données
    if (!title || !description || !courseSource) {
      return res.status(400).json({
        message: "Le titre, la description et la source du cours sont requis",
      });
    }

    // Ajouter l'ordre aux questions si non fourni
    const questionsWithOrder =
      questions?.map((q, index) => ({
        ...q,
        order: q.order || index + 1,
        status: null, // Par défaut en attente
      })) || [];

    // Créer le quiz
    const newQuiz = new QuizModel({
      title,
      description,
      courseSource,
      questions: questionsWithOrder,
      questionsCount: questionsWithOrder.length,
    });

    await newQuiz.save();

    res.status(201).json({
      message: "Quiz créé avec succès",
      quiz: newQuiz,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la création du quiz:", error);
    res.status(500).json({
      message: "Erreur lors de la création du quiz",
      error: error.message,
    });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await QuizModel.findByIdAndDelete(id);

    if (!quiz) {
      console.log("❌ Quiz non trouvé");
      return res.status(404).json({
        message: "Quiz non trouvé",
      });
    }

    res.status(200).json({
      message: "Quiz supprimé avec succès",
      quiz: {
        _id: quiz._id,
        title: quiz.title,
      },
    });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du quiz:", error);
    res.status(500).json({
      message: "Erreur lors de la suppression du quiz",
      error: error.message,
    });
  }
};

export const publishQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await QuizModel.findById(id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz non trouvé",
      });
    }

    // Vérifier qu'au moins une question est validée
    const validatedQuestions = quiz.questions.filter((q) => q.status === true);

    if (validatedQuestions.length === 0) {
      return res.status(400).json({
        message: "Au moins une question doit être validée pour publier le quiz",
      });
    }

    quiz.isPublished = true;
    await quiz.save();

    res.status(200).json({
      message: "Quiz publié avec succès",
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        isPublished: quiz.isPublished,
        validatedQuestionsCount: validatedQuestions.length,
      },
    });
  } catch (error) {
    console.error("❌ Erreur lors de la publication du quiz:", error);
    res.status(500).json({
      message: "Erreur lors de la publication du quiz",
      error: error.message,
    });
  }
};

// Générer un quiz à partir d'un cours en utilisant Grok (xAI)
export const generateQuizFromCourse = async (req, res) => {
  try {
    const {
      courseId,
      title,
      description,
      numberOfQuestions = 10,
    } = req.body;

    if (!courseId || !title || !description) {
      return res.status(400).json({
        message: "courseId, title et description sont requis",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return res.status(500).json({
        message: "Clé API Groq manquante. Définissez GROQ_API_KEY dans .env",
      });
    }

    let courseText = "";
    try {
      const pdfResponse = await fetch(course.url);
      if (!pdfResponse.ok) {
        throw new Error(`Téléchargement PDF échoué: ${pdfResponse.status}`);
      }
      const pdfArrayBuffer = await pdfResponse.arrayBuffer();
      const { default: pdfParse } = await import("pdf-parse");
      const parsed = await pdfParse(Buffer.from(pdfArrayBuffer));
      courseText = (parsed.text || "").trim();
      if (courseText.length > 20000) {
        courseText = courseText.slice(0, 20000);
      }
    } catch (e) {
      console.warn("⚠️ Impossible d'extraire le texte du PDF:", e.message);
      courseText = `Cours: ${course.name}. Consignes: ${description}`;
    }

    const completionResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Tu génères des quiz QCM strictement au format JSON demandé.",
          },
          {
            role: "user",
            content: [
              "Génère un quiz au format JSON conforme au schéma suivant:",
              "{",
              "  \"title\": string,",
              "  \"description\": string,",
              "  \"questions\": [",
              "    {",
              "      \"text\": string,",
              "      \"answers\": [",
              "        { \"text\": string, \"isCorrect\": boolean },",
              "        { \"text\": string, \"isCorrect\": boolean },",
              "        { \"text\": string, \"isCorrect\": boolean },",
              "        { \"text\": string, \"isCorrect\": boolean }",
              "      ]",
              "    }",
              "  ]",
              "}",
              "Contraintes:",
              "- Génère exactement "+numberOfQuestions+" questions.",
              "- Chaque question doit avoir 4 réponses et une seule réponse avec isCorrect=true.",
              "- Les réponses doivent être courtes et claires.",
              "- Utilise le contenu du cours ci-dessous.",
              "Contenu du cours:",
              courseText,
            ].join("\n"),
          },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
        max_tokens: 1200,
      }),
    });

    if (!completionResponse.ok) {
      const errTxt = await completionResponse.text();
      throw new Error(`Groq API error: ${completionResponse.status} ${errTxt}`);
    }

    const completion = await completionResponse.json();
    const content = completion?.choices?.[0]?.message?.content || "{}";

    let generated;
    try {
      generated = JSON.parse(content);
    } catch (parseErr) {
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      if (start !== -1 && end !== -1) {
        generated = JSON.parse(content.slice(start, end + 1));
      } else {
        throw new Error("Réponse Grok non JSON");
      }
    }

    const questionsWithOrder = (generated.questions || []).map((q, idx) => ({
      text: q.text,
      answers: (q.answers || []).map((a) => ({
        text: a.text,
        isCorrect: !!a.isCorrect,
      })),
      status: null,
      order: idx + 1,
    }));

    const newQuiz = new QuizModel({
      title: title || generated.title || `Quiz du cours ${course.name}`,
      description: description || generated.description || "Quiz généré automatiquement",
      courseSource: course._id,
      questions: questionsWithOrder,
      questionsCount: questionsWithOrder.length,
      isPublished: false,
    });

    await newQuiz.save();

    res.status(201).json({
      message: "Quiz généré et enregistré",
      quiz: {
        _id: newQuiz._id,
        title: newQuiz.title,
        description: newQuiz.description,
        questionsCount: newQuiz.questionsCount,
        isPublished: newQuiz.isPublished,
      },
    });
  } catch (error) {
    console.error("❌ Erreur lors de la génération du quiz:", error);
    res.status(500).json({
      message: "Erreur lors de la génération du quiz",
      error: error.message,
    });
  }
};
