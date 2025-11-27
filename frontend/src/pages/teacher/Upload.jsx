import React, { useState, useRef } from "react";
import "./Upload.css";
import { 
  FaFilePdf, 
  FaUpload, 
  FaTrash, 
  FaEye, 
  FaFileWord, 
  FaFileImage,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

function Upload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddFile = (e) => {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;

    // Types autorisés étendus
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip',
      'application/x-rar-compressed',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'text/plain',
      'application/json'
    ];

    // Augmentation à 100MB
    const maxSize = 100 * 1024 * 1024;
    const validFiles = selected.filter(
      (f) => allowedTypes.includes(f.type) && f.size <= maxSize
    );

    if (validFiles.length !== selected.length) {
      alert("Certains fichiers ne sont pas autorisés ou dépassent 100MB");
      return;
    }

    const mapped = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      time: new Date().toLocaleString(),
      size: formatFileSize(file.size),
      type: getFileType(file.type),
      status: 'pending', // pending, uploading, success, error
      progress: 0
    }));

    setFiles((prev) => [...prev, ...mapped]);
  };

  const handleUploadFiles = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    for (const fileObj of pendingFiles) {
      try {
        // Simulation de progression
        for (let progress = 0; progress <= 100; progress += 10) {
          setFiles(prev => prev.map(f => 
            f.id === fileObj.id ? { 
              ...f, 
              status: 'uploading', 
              progress: progress 
            } : f
          ));
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'success', progress: 100 } : f
        ));
        
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'error' } : f
        ));
      }
    }
    
    setUploading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (mimeType) => {
    const typeMap = {
      'application/pdf': 'pdf',
      'application/msword': 'word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
      'application/vnd.ms-excel': 'excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
      'application/vnd.ms-powerpoint': 'powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'powerpoint',
      'application/zip': 'archive',
      'application/x-rar-compressed': 'archive',
      'image/jpeg': 'image',
      'image/png': 'image',
      'image/gif': 'image',
      'image/webp': 'image',
      'image/svg+xml': 'image',
      'text/plain': 'text',
      'application/json': 'json'
    };
    
    return typeMap[mimeType] || 'other';
  };

  const getFileIcon = (fileType) => {
    const icons = {
      pdf: <FaFilePdf className="file-icon pdf" />,
      word: <FaFileWord className="file-icon word" />,
      excel: <FaFileExcel className="file-icon excel" />,
      powerpoint: <FaFilePowerpoint className="file-icon powerpoint" />,
      image: <FaFileImage className="file-icon image" />,
      archive: <FaFileArchive className="file-icon archive" />,
      text: <FaFileWord className="file-icon text" />,
      json: <FaFileWord className="file-icon json" />
    };
    
    return icons[fileType] || <FaFilePdf className="file-icon other" />;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle className="status-icon success" />;
      case 'error':
        return <FaTimesCircle className="status-icon error" />;
      case 'uploading':
        return <div className="loading-spinner" />;
      default:
        return null;
    }
  };

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const pendingFilesCount = files.filter(f => f.status === 'pending').length;
  const uploadedFilesCount = files.filter(f => f.status === 'success').length;

  return (
    <div className="upload-container">
      
      {/* HEADER MODERNE */}
      <div className="upload-header">
        <div className="header-content">
          <h1>📚 Espace de Cours</h1>
          <p className="subtitle">Gérez tous vos supports pédagogiques en un seul endroit</p>
          <div className="file-stats">
            <div className="stat">
              <span className="stat-number">{files.length}</span>
              <span className="stat-label">Fichiers totaux</span>
            </div>
            <div className="stat">
              <span className="stat-number">{uploadedFilesCount}</span>
              <span className="stat-label">Uploadés</span>
            </div>
            <div className="stat">
              <span className="stat-number">100MB</span>
              <span className="stat-label">Max par fichier</span>
            </div>
          </div>
        </div>
      </div>

      {/* BARRE D'ACTIONS AMÉLIORÉE */}
      <div className="actions-bar">
        <div className="actions-left">
          <button
            className="primary-btn"
            onClick={() => fileInputRef.current.click()}
          >
            <FaCloudUploadAlt /> Ajouter des fichiers
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.svg,.zip,.rar,.txt,.json"
            multiple
            style={{ display: "none" }}
            onChange={handleAddFile}
          />

          {pendingFilesCount > 0 && (
            <button 
              className="secondary-btn"
              onClick={handleUploadFiles}
              disabled={uploading}
            >
              {uploading ? 'Upload en cours...' : `Uploader ${pendingFilesCount} fichier(s)`}
            </button>
          )}
        </div>

        <div className="file-types-info">
          Formats supportés: PDF, Word, Excel, PowerPoint, Images, Archives, Texte
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="main-content">
        {files.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaCloudUploadAlt />
            </div>
            <h3>Aucun fichier ajouté</h3>
            <p>Commencez par ajouter vos supports de cours</p>
            <small>Supporte la plupart des formats - Maximum 100MB par fichier</small>
           
          </div>
        ) : (
          <div className="files-container">
            <div className="files-grid">
              {files.map((file) => (
                <div key={file.id} className={`file-card ${file.status}`}>
                  <div className="file-header">
                    {getFileIcon(file.type)}
                    <div className="file-status">
                      {getStatusIcon(file.status)}
                    </div>
                  </div>

                  <div className="file-content">
                    <h4 className="file-name" title={file.file.name}>
                      {file.file.name}
                    </h4>
                    
                    <div className="file-meta">
                      <span className="file-type-badge">{file.type.toUpperCase()}</span>
                      <span className="file-size">{file.size}</span>
                    </div>

                    <div className="file-time">{file.time}</div>

                    {file.status === 'uploading' && (
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${file.progress}%` }}
                        />
                        <span className="progress-text">{file.progress}%</span>
                      </div>
                    )}
                  </div>

                  <div className="file-actions">
                    <button
                      className="action-btn preview-btn"
                      onClick={() => window.open(URL.createObjectURL(file.file), '_blank')}
                      title="Aperçu"
                    >
                      <FaEye />
                    </button>
                    
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => removeFile(file.id)}
                      title="Supprimer"
                      disabled={file.status === 'uploading'}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;