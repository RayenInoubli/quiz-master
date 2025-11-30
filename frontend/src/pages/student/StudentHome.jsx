import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StudentHome.css";
import { FaFilePdf, FaEye } from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function StudentHome() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cachedCourses = localStorage.getItem("student-courses");
    const cacheTimestamp = localStorage.getItem("student-courses-timestamp");
    const isCacheValid =
      cacheTimestamp && Date.now() - cacheTimestamp < 5 * 60 * 1000;

    if (cachedCourses && isCacheValid) {
      console.log("Chargement depuis le cache");
      setCourses(JSON.parse(cachedCourses));
    } else {
      console.log("Chargement depuis l'API");
      fetchCourses();
    }
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      console.log("Début du fetch...");
      const res = await axios.get(`${BACKEND_URL}/api/v1/courses`);
      console.log("Cours reçus:", res.data);

      setCourses(res.data);

      localStorage.setItem("student-courses", JSON.stringify(res.data));
      localStorage.setItem("student-courses-timestamp", Date.now().toString());
    } catch (err) {
      console.error("Erreur lors du chargement des cours:", err);
    } finally {
      setLoading(false);
      console.log("Chargement terminé");
    }
  };

  // Fonction pour formater la date en jj.mm.aaaa
  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="student-container">
      <div className="student-header">
        <div className="header-content">
          <h1>Espace Cours - Étudiant </h1>
        </div>
      </div>

      <div className="student-main-content">
        <div className="courses-section">
          <h2 className="courses-title">
            📚 Cours Disponibles ({courses.length})
          </h2>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Chargement des cours...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <FaFilePdf className="empty-icon" />
              <h3>Aucun cours disponible</h3>
              <p>
                Les cours apparaîtront ici une fois uploadés par l'enseignant
              </p>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => (
                <div key={course._id} className="course-card">
                  <div className="course-icon">
                    <FaFilePdf className="file-icon pdf" />
                  </div>

                  <div className="course-content">
                    <div className="course-name">{course.name}</div>
                    <div className="course-date">
                      {formatDate(course.createdAt)}
                    </div>

                    <div className="course-actions">
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="preview-btn"
                        title="Voir le fichier"
                      >
                        <FaEye />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentHome;
