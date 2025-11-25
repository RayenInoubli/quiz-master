import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import TeacherHome from "./pages/teacher/TeacherHome.jsx";
import StudentHome from "./pages/student/StudentHome.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/teacher/home" element={<TeacherHome />} />
      <Route path="/student/home" element={<StudentHome />} />
    </Routes>
  );
}

export default App;
