import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }
});

export default mongoose.model("Course", CourseSchema);
