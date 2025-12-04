const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

console.log('API URL configurée:', API_BASE_URL);

export const courseService = {
  async uploadCourse(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Upload vers:', `${API_BASE_URL}/api/v1/courses/upload`);

      const response = await fetch(`${API_BASE_URL}/api/v1/courses/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`Erreur serveur: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload fetch error:', error);
      throw new Error(`Impossible de se connecter au serveur: ${error.message}`);
    }
  },

  async getAllCourses() {
    try {
      console.log("Fetching from:", `${API_BASE_URL}/api/v1/courses`);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/courses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get courses fetch error:', error);
      throw new Error(`Impossible de charger les cours. Vérifiez que le serveur est démarré.`);
    }
  },

  async deleteCourse(courseId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/courses/${courseId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
};
