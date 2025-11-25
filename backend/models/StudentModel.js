import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    age: { 
        type: Number, 
        required: true 
    },
    classLevel: { 
        type: String 
    },
    email: { 
        type: String 
    },
    phoneNumber: { 
        type: String 
    },
    cin: { 
        type: String 
    },
  },
  { timestamps: true }
);

export default mongoose.model("StudentModel", studentSchema, "students");
