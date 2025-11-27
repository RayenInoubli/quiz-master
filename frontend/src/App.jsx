import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import StudentHome from "./pages/student/StudentHome.jsx";
import Upload from "./pages/teacher/Upload.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/student/home" element={<StudentHome />} />
      <Route path="/teacher/upload" element={<Upload />} />
    </Routes>
  );
}

export default App;
