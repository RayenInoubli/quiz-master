import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
     email: { 
        type: String 
    },
    phoneNumber: {
      type: String,
    },
    cin: {
      type: String,
    },
    registrationNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TeacherModel", teacherSchema, "teachers");
