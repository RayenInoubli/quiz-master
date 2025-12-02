import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import StudentHome from "./pages/student/StudentHome.jsx";
import Upload from "./pages/teacher/Upload.jsx";
import StudentCourses from "./pages/student/StudentCourses.jsx";
import TeacherHome from "./pages/teacher/TeacherHome.jsx";
import TeacherQuiz from "./pages/teacher/TeacherQuiz.jsx";
import StudentQuiz from "./pages/student/StudentQuizzes.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/student/home" element={<StudentHome />} />
      <Route path="/student/courses" element={<StudentCourses />} />
      <Route path="/teacher/home" element={<TeacherHome />} />
      <Route path="teacher/quiz" element={<TeacherQuiz />} />
      <Route path="/teacher/upload" element={<Upload />} />
      <Route path="/student/quizzes" element={<StudentQuiz />} />
    </Routes>
  );
}

export default App;
