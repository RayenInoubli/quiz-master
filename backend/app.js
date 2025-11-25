import express from "express";
import connectDB from "./configs/Db.js";
import TeacherRoutes from "./routes/TeacherRoutes.js";
import StudentRoutes from "./routes/StudentRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

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

export default app;
