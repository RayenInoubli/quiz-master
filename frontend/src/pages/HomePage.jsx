import { Card, Row, Col, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import StudentIcon from "../assets/student.png";
import TeacherIcon from "../assets/teacher.png";

const { Title, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (role) => {
    if (role === "teacher") {
      navigate("/teacher/home");
    } else if (role === "student") {
      navigate("/student/home");
    }
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
      {/* Header avec dégradé */}
      <header
        style={{
          padding: "24px 48px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <img
            src="https://vitejs.dev/logo.svg"
            alt="Logo QuizMaster"
            style={{
              width: "50px",
              height: "50px",
            }}
          />
          <Title
            level={2}
            style={{
              margin: 0,
              color: "white",
              fontSize: "28px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
            }}
          >
            QuizMaster
          </Title>
        </div>
      </header>

      {/* Contenu principal */}
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
        <Title
          level={1}
          style={{
            textAlign: "center",
            marginBottom: "60px",
            color: "#1a1a1a",
            fontSize: "2.5rem",
            fontWeight: "600",
            maxWidth: "600px",
            lineHeight: "1.3",
          }}
        >
          Choisissez votre rôle
        </Title>

        <Row
          gutter={[48, 48]}
          justify="center"
          style={{ width: "100%", maxWidth: "800px" }}
        >
          <Col xs={24} sm={12} md={10}>
            <Card
              hoverable
              style={{
                width: "100%",
                height: "300px",
                background: "white",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s ease",
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
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.borderColor = "#8b5cf6";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(139, 92, 246, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0, 0, 0, 0.08)";
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "16px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <img
                  src={TeacherIcon}
                  alt="Enseignant"
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                />
              </div>

              <Title
                level={3}
                style={{
                  margin: "0 0 12px 0",
                  color: "#1a1a1a",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                Enseignant
              </Title>

              <Text
                style={{
                  color: "#6b7280",
                  fontSize: "15px",
                  textAlign: "center",
                  lineHeight: "1.5",
                }}
              >
                Créer et gérer des quiz
              </Text>

              <div
                style={{
                  marginTop: "24px",
                  padding: "8px 16px",
                  background:
                    "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                  borderRadius: "8px",
                  color: "#8b5cf6",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Cliquer pour accéder
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={10}>
            <Card
              hoverable
              style={{
                width: "100%",
                height: "300px",
                background: "white",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s ease",
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
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(59, 130, 246, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0, 0, 0, 0.08)";
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "16px",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <img
                  src={StudentIcon}
                  alt="Étudiant"
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                />
              </div>

              <Title
                level={3}
                style={{
                  margin: "0 0 12px 0",
                  color: "#1a1a1a",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                Étudiant
              </Title>

              <Text
                style={{
                  color: "#6b7280",
                  fontSize: "15px",
                  textAlign: "center",
                  lineHeight: "1.5",
                }}
              >
                Passer des quiz 
              </Text>

              <div
                style={{
                  marginTop: "24px",
                  padding: "8px 16px",
                  background:
                    "linear-gradient(135deg, #3b82f615 0%, #1d4ed815 100%)",
                  borderRadius: "8px",
                  color: "#3b82f6",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Cliquer pour accéder
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
