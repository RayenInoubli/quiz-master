import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // ⚠️ doit être au tout début !!

import connectDB from "./configs/Db.js";
import TeacherRoutes from "./routes/TeacherRoutes.js";
import StudentRoutes from "./routes/StudentRoutes.js";
import CourseRoutes from "./routes/CourseRoutes.js";

const app = express();

// connect to DB
connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/v1/teachers", TeacherRoutes);
app.use("/api/v1/students", StudentRoutes);
app.use("/api/v1/courses", CourseRoutes);

export default app;
