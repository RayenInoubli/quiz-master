import Course from "../models/Course.js";

export const uploadCourse = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier envoyé" });
    }

    const fileUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

    const newCourse = new Course({
      name: req.file.originalname,
      url: fileUrl
    });

    await newCourse.save();

    res.json({
      message: "Cours uploadé et enregistré avec succès !",
      course: newCourse
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
