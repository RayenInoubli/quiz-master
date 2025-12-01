import Course from "../models/Course.js";

export const uploadCourse = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier envoyé" });
    }

    const fileUrl = `${
      process.env.BASE_URL || "http://localhost:6000"
    }/uploads/${req.file.filename}`;

    const newCourse = new Course({
      name: req.file.originalname,
      url: fileUrl,
    });

    await newCourse.save();

    res.status(201).json({
      message: "Cours uploadé et enregistré avec succès !",
      course: {
        id: newCourse._id,
        name: newCourse.name,
        url: newCourse.url,
        uploadDate: newCourse.createdAt,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'upload du cours:", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de l'enregistrement" });
  }
};

// Récupérer tous les cours
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error("Erreur lors de la récupération des cours:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
