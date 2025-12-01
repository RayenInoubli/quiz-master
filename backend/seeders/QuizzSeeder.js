import mongoose from "mongoose";
import dotenv from "dotenv";
import QuizModel from "../models/QuizModel.js";

dotenv.config();

const seedQuizzes = async () => {
  try {
    // Connexion à la DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB");

    // Nettoyer les quiz existants
    await QuizModel.deleteMany({});
    console.log("🧹 Quiz existants supprimés");

    // Créer des quiz de test
    const quizzes = [
      {
        title: "Quiz Algorithmique Avancée",
        description:
          "Ce quiz couvre les concepts avancés d'algorithmique, y compris les algorithmes de tri, de recherche et les structures de données complexes. Il est conçu pour évaluer la compréhension des étudiants sur les performances algorithmiques et l'analyse de complexité.",
        courseSource: new mongoose.Types.ObjectId("692b36268d6a14441ccb8b2c"),
        questionsCount: 5,
        questions: [
          {
            text: "Quelle est la complexité temporelle de l'algorithme QuickSort dans le pire des cas?",

            order: 1,
            status: true,
            answers: [
              { text: "O(n log n)", isCorrect: false },
              { text: "O(n²)", isCorrect: true },
              { text: "O(log n)", isCorrect: false },
              { text: "O(1)", isCorrect: false },
            ],
          },
          {
            text: "Quelle structure de données utilise une approche LIFO?",

            order: 2,
            status: false,
            answers: [
              { text: "File d'attente", isCorrect: false },
              { text: "Pile", isCorrect: true },
              { text: "Arbre", isCorrect: false },
              { text: "Liste chaînée", isCorrect: false },
            ],
          },
          {
            text: "Quelle est la différence entre une liste chaînée et un tableau?",

            order: 3,
            status: null,
            answers: [
              {
                text: "Les listes chaînées ont un accès direct aux éléments",
                isCorrect: false,
              },
              {
                text: "Les tableaux ont une taille fixe, les listes chaînées sont dynamiques",
                isCorrect: true,
              },
              {
                text: "Les listes chaînées sont plus rapides pour l'accès aléatoire",
                isCorrect: false,
              },
              {
                text: "Les tableaux utilisent plus de mémoire",
                isCorrect: false,
              },
            ],
          },
          {
            text: "Qu'est-ce qu'un arbre binaire de recherche?",

            order: 4,
            status: true,
            answers: [
              {
                text: "Un arbre où chaque nœud a au plus deux enfants",
                isCorrect: false,
              },
              {
                text: "Un arbre où les valeurs des nœuds de gauche sont inférieures au nœud parent",
                isCorrect: true,
              },
              { text: "Un arbre toujours équilibré", isCorrect: false },
              {
                text: "Un arbre utilisé seulement pour le tri",
                isCorrect: false,
              },
            ],
          },
          {
            text: "Quelle est la différence entre BFS et DFS?",

            order: 5,
            status: false,
            answers: [
              {
                text: "BFS utilise une pile, DFS utilise une file",
                isCorrect: false,
              },
              {
                text: "BFS explore niveau par niveau, DFS explore en profondeur d'abord",
                isCorrect: true,
              },
              { text: "DFS est toujours plus rapide", isCorrect: false },
              {
                text: "BFS est utilisé pour les graphes non orientés",
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        title: "Structures de Données",
        description:
          "Quiz complet sur les différentes structures de données : listes, piles, files, arbres, graphes et tables de hachage. Évalue la capacité des étudiants à choisir la structure appropriée pour résoudre des problèmes spécifiques.",
        courseSource: new mongoose.Types.ObjectId("692b36268d6a14441ccb8b2c"),
        questionsCount: 3,
        questions: [
          {
            text: "Quelle est la complexité d'insertion dans une liste chaînée?",

            order: 1,
            status: true,
            answers: [
              { text: "O(1) au début", isCorrect: true },
              { text: "O(n) toujours", isCorrect: false },
              { text: "O(log n)", isCorrect: false },
              { text: "O(n²)", isCorrect: false },
            ],
          },
          {
            text: "Qu'est-ce qu'une table de hachage?",

            order: 2,
            status: null,
            answers: [
              {
                text: "Une structure qui utilise une fonction de hachage pour mapper des clés",
                isCorrect: true,
              },
              { text: "Un type d'arbre binaire", isCorrect: false },
              { text: "Une liste triée", isCorrect: false },
              { text: "Un graphe orienté", isCorrect: false },
            ],
          },
          {
            text: "Quelle structure est la plus adaptée pour un parcours FIFO?",

            order: 3,
            status: true,
            answers: [
              { text: "Pile", isCorrect: false },
              { text: "File", isCorrect: true },
              { text: "Arbre", isCorrect: false },
              { text: "Graphe", isCorrect: false },
            ],
          },
        ],
      },
      {
        title: "Base de Données SQL",
        description:
          "Évaluation des connaissances en SQL, y compris la création de schémas, les requêtes complexes, les jointures, les sous-requêtes et l'optimisation. Comprend également des questions sur la normalisation et les transactions.",
        courseSource: new mongoose.Types.ObjectId("692b36268d6a14441ccb8b2c"),
        questionsCount: 4,
        questions: [
          {
            text: "Qu'est-ce qu'une clé primaire?",

            order: 1,
            status: true,
            answers: [
              {
                text: "Un identifiant unique pour chaque ligne",
                isCorrect: true,
              },
              { text: "Une clé étrangère", isCorrect: false },
              { text: "Un index", isCorrect: false },
              { text: "Une contrainte", isCorrect: false },
            ],
          },
          {
            text: "Quelle clause SQL est utilisée pour filtrer les résultats?",

            order: 2,
            status: true,
            answers: [
              { text: "SELECT", isCorrect: false },
              { text: "WHERE", isCorrect: true },
              { text: "FROM", isCorrect: false },
              { text: "ORDER BY", isCorrect: false },
            ],
          },
          {
            text: "Qu'est-ce qu'un JOIN en SQL?",

            order: 3,
            status: null,
            answers: [
              {
                text: "Une opération pour combiner des données de plusieurs tables",
                isCorrect: true,
              },
              { text: "Une fonction d'agrégation", isCorrect: false },
              { text: "Une contrainte d'intégrité", isCorrect: false },
              { text: "Un type de données", isCorrect: false },
            ],
          },
          {
            text: "Quelle est la différence entre DELETE et TRUNCATE?",

            order: 4,
            status: false,
            answers: [
              {
                text: "DELETE peut avoir une clause WHERE, TRUNCATE supprime tout",
                isCorrect: true,
              },
              { text: "Aucune différence", isCorrect: false },
              {
                text: "TRUNCATE est plus lent que DELETE",
                isCorrect: false,
              },
              {
                text: "DELETE ne peut pas être annulé",
                isCorrect: false,
              },
            ],
          },
        ],
      },
    ];

    // Insérer les quiz
    const createdQuizzes = await QuizModel.insertMany(quizzes);
    console.log(`✅ ${createdQuizzes.length} quiz créés avec succès`);

    // Afficher les détails
    createdQuizzes.forEach((quiz) => {
      console.log(`\n📝 ${quiz.title}`);
      console.log(`   ID: ${quiz._id}`);
      console.log(`   Questions: ${quiz.questionsCount}`);
      console.log(`   Source: ${quiz.courseSource}`);
    });

    console.log("\n✅ Seed terminé avec succès");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
    process.exit(1);
  }
};

seedQuizzes();
