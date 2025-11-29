// pages/teacher/Upload.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Upload.css";
import { 
  FaFilePdf, FaUpload, FaTrash, FaEye, FaDownload, FaCheckCircle, FaTimesCircle 
} from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Upload() {
  const [files, setFiles] = useState([]);
  const [uploadedCourses, setUploadedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const fileInputRef = useRef(null);

  // Charger tous les cours au montage
  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchAllCourses = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/courses`);
      setUploadedCourses(res.data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du chargement des cours");
    }
  };

  const handleAddFile = (e) => {
    const selected = Array.from(e.target.files);
    const mapped = selected.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      progress: 0,
      status: "pending"
    }));
    setFiles(prev => [...prev, ...mapped]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setLoading(true);

    for (let item of files) {
      if (item.status !== "pending") continue;

      const formData = new FormData();
      formData.append("pdf", item.file);

      try {
        setFiles(prev => prev.map(f => 
          f.id === item.id ? { ...f, status: "uploading" } : f
        ));

        await axios.post(`${BACKEND_URL}/api/v1/courses/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setFiles(prev => prev.map(f => 
              f.id === item.id ? { ...f, progress: percent } : f
            ));
          }
        });

        setFiles(prev => prev.map(f => 
          f.id === item.id ? { ...f, status: "success" } : f
        ));
      } catch (err) {
        setFiles(prev => prev.map(f => 
          f.id === item.id ? { ...f, status: "error" } : f
        ));
      }
    }

    setLoading(false);
    fetchAllCourses();
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="upload-container">
      {/* Header centré */}
      <div className="upload-header">
        <div className="header-content">
          <h1>Espace Cours - Enseignant</h1>
        </div>
      </div>

      {/* Zone de contenu principale */}
      <div className="main-content">
        {/* Barre d'actions améliorée */}
        <div className="actions-bar">
          <div className="actions-left">
            <button className="primary-btn" onClick={() => fileInputRef.current.click()}>
              <FaUpload /> Ajouter des fichiers
            </button>
            <input ref={fileInputRef} type="file" multiple style={{display: "none"}} onChange={handleAddFile} />

            {files.some(f => f.status === "pending") && (
              <button className="secondary-btn" onClick={handleUpload} disabled={loading}>
                {loading ? "Upload en cours..." : "Uploader"}
              </button>
            )}
          </div>

          <button 
            className="secondary-btn" 
            onClick={() => { setShowAllCourses(!showAllCourses); fetchAllCourses(); }}
          >
            {showAllCourses ? "Masquer les cours" : "Voir tous les cours"}
          </button>
        </div>

        {/* Fichiers en attente d'upload */}
        {files.length > 0 && (
          <div className="files-container">
            <h3>📤 Fichiers à uploader ({files.length})</h3>
            <div className="files-grid">
              {files.map(f => (
                <div key={f.id} className={`file-card ${f.status}`}>
                  <div className="file-header">
                    <FaFilePdf className="file-icon pdf" />
                    <div className="file-status">
                      {f.status === "uploading" && <div className="loading-spinner"></div>}
                      {f.status === "success" && <FaCheckCircle className="status-icon success" />}
                      {f.status === "error" && <FaTimesCircle className="status-icon error" />}
                    </div>
                  </div>
                  
                  <div className="file-content">
                    <div className="file-name">{f.name}</div>
                    <div className="file-meta">
                      <span className="file-size">{f.size}</span>
                      <span className="file-type-badge">PDF</span>
                    </div>
                    
                    {f.status === "uploading" && (
                      <div className="upload-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${f.progress}%` }}
                          ></div>
                        </div>
                        <div className="progress-text">{f.progress}%</div>
                      </div>
                    )}
                    
                    <div className="file-actions">
                      <button 
                        className="action-btn delete-btn" 
                        onClick={() => removeFile(f.id)}
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Liste de tous les cours uploadés - Améliorée */}
        {showAllCourses && (
          <div className="files-container">
            <h2>📚 Tous les cours ({uploadedCourses.length})</h2>
            {uploadedCourses.length === 0 ? (
              <div className="empty-state">
                <FaFilePdf className="empty-icon" />
                <h3>Aucun cours uploadé</h3>
                <p>Commencez par ajouter des fichiers PDF</p>
              </div>
            ) : (
              <div className="files-grid">
                {uploadedCourses.map(course => (
                  <div key={course._id} className="file-card success">
                    <div className="file-header">
                      <FaFilePdf className="file-icon pdf" />
                      <div className="file-status">
                        <FaCheckCircle className="status-icon success" />
                      </div>
                    </div>
                    
                    <div className="file-content">
                      <div className="file-name">{course.name}</div>
                      <div className="file-meta">
                        <span className="file-size">
                          {new Date(course.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="file-type-badge">PDF</span>
                      </div>
                      
                      <div className="file-actions">
                        <a 
                          href={course.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="action-btn preview-btn"
                          title="Voir le fichier"
                        >
                          <FaEye />
                        </a>
                        <a 
                          href={course.url} 
                          download
                          className="action-btn preview-btn"
                          title="Télécharger"
                        >
                          <FaDownload />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* État vide quand aucun fichier n'est sélectionné */}
        {files.length === 0 && !showAllCourses && (
          <div className="empty-state">
            <FaFilePdf className="empty-icon" />
            <h3>Aucun fichier sélectionné</h3>
            <p>Ajoutez des fichiers PDF pour commencer l'upload</p>
            <small>Formats acceptés: PDF uniquement</small>
            <button 
              className="browse-btn" 
              onClick={() => fileInputRef.current.click()}
            >
              <FaUpload /> Parcourir les fichiers
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;