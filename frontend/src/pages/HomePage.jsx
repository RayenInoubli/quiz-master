import { Card, Row, Col } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import StudentIcon from "../assets/student.png";
import TeacherIcon from "../assets/teacher.png";

const HomePage = () => {
    const navigate = useNavigate();

  const handleNavigation = (role) => {
    console.log(`Navigating to ${role}/home page`);
    navigate(`/${role}/home`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        padding: 0,
        margin: 0,
      }}
    >
      <header
        style={{
          padding: "24px 48px",
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <img
          src="https://vitejs.dev/logo.svg"
          alt="Vite Logo"
          style={{ height: "28px", width: "28px" }}
        />
        <h1
          style={{
            margin: 0,
            color: "#1a1a1a",
            fontSize: "20px",
            fontWeight: "600",
            letterSpacing: "-0.3px",
          }}
        >
          QuizMaster
        </h1>
      </header>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 77px)",
          padding: "60px 24px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "60px",
            color: "#1a1a1a",
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: "500",
            maxWidth: "600px",
            lineHeight: "1.4",
            letterSpacing: "-0.5px",
          }}
        >
          Choose your role
        </h2>

        <Row
          gutter={[24, 24]}
          justify="center"
          style={{ width: "100%", maxWidth: "700px" }}
        >
          <Col xs={24} sm={12} md={12}>
            <Card
              hoverable
              style={{
                width: "100%",
                maxWidth: "320px",
                margin: "0 auto",
                height: "220px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "18px",
                textAlign: "center",
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "none",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              bodyStyle={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "32px",
              }}
              onClick={() => handleNavigation("teacher")}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(59, 130, 246, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "12px",
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={TeacherIcon}
                  alt="Teacher"
                  style={{ width: "70px", height: "70px" }}
                />
              </div>
              <span
                style={{
                  fontWeight: "500",
                  color: "#1a1a1a",
                  fontSize: "16px",
                }}
              >
                Teacher
              </span>
              <span
                style={{
                  fontWeight: "400",
                  color: "#6b7280",
                  fontSize: "14px",
                  marginTop: "8px",
                }}
              >
                Create and manage quizzes
              </span>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={12}>
            <Card
              hoverable
              style={{
                width: "100%",
                maxWidth: "320px",
                margin: "0 auto",
                height: "220px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "18px",
                textAlign: "center",
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "none",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              bodyStyle={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "32px",
              }}
              onClick={() => handleNavigation("student")}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#8b5cf6";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(139, 92, 246, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "12px",
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={StudentIcon}
                  alt="Student"
                  style={{ width: "70px", height: "70px" }}
                />
              </div>
              <span
                style={{
                  fontWeight: "500",
                  color: "#1a1a1a",
                  fontSize: "16px",
                }}
              >
                Student
              </span>
              <span
                style={{
                  fontWeight: "400",
                  color: "#6b7280",
                  fontSize: "14px",
                  marginTop: "8px",
                }}
              >
                Take quizzes and view results
              </span>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
