import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    answers: [answerSchema],
    status: {
      type: Boolean,
      default: null, // null = en attente, true = validée, false = rejetée
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    courseSource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherModel",
      required: false, // for now false because there is no auth system
    },
    questions: [questionSchema],
    questionsCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Middleware pour calculer automatiquement questionsCount
quizSchema.pre("save", async function() {
  this.questionsCount = this.questions.length;
});

export default mongoose.model("QuizModel", quizSchema, "quizzes");
