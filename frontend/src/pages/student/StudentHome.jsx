import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography } from "antd";
import { FileSearchOutlined, QuestionCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function StudentHome() {
  const navigate = useNavigate();

  const handleNavigation = (type) => {
    if (type === "courses") {
      navigate("/student/courses");
    } else if (type === "quizzes") {
      navigate("/student/quizzes");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header avec Logo */}
      <div
        style={{
          padding: "32px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
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
              height: "40px",
              width: "40px",
            }}
          />
          <Title level={1} style={{ color: "white", margin: 0 }}>
            QuizMaster
          </Title>
        </div>
        <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "18px" }}>
          Espace étudiant
        </Text>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <Title
          level={2}
          style={{
            color: "white",
            marginBottom: "48px",
            textAlign: "center",
            fontWeight: "400",
          }}
        >
          Que souhaitez-vous faire ?
        </Title>

        <Row
          gutter={[32, 32]}
          justify="center"
          style={{ width: "100%", maxWidth: "600px" }}
        >
          <Col xs={24} sm={12}>
            <Card
              hoverable
              onClick={() => handleNavigation("courses")}
              style={{
                height: "220px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "white",
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              }}
              bodyStyle={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                padding: "24px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <FileSearchOutlined
                  style={{
                    fontSize: "32px",
                    color: "#1d4ed8",
                  }}
                />
              </div>
              <Title
                level={3}
                style={{ margin: 0, color: "#1a1a1a", textAlign: "center" }}
              >
                Consulter les cours
              </Title>
              <Text
                type="secondary"
                style={{
                  marginTop: "8px",
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                Accéder à tous les cours disponibles
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12}>
            <Card
              hoverable
              onClick={() => handleNavigation("quizzes")}
              style={{
                height: "220px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "white",
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              }}
              bodyStyle={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                padding: "24px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <QuestionCircleOutlined
                  style={{
                    fontSize: "32px",
                    color: "#0369a1",
                  }}
                />
              </div>
              <Title
                level={3}
                style={{ margin: 0, color: "#1a1a1a", textAlign: "center" }}
              >
                Consulter les quiz
              </Title>
              <Text
                type="secondary"
                style={{
                  marginTop: "8px",
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                Passer des quiz et voir vos résultats
              </Text>
            </Card>
          </Col>
        </Row>

        {/* Message de bienvenue */}
        <div
          style={{
            maxWidth: "500px",
            marginTop: "48px",
            textAlign: "center",
          }}
        >
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.85)",
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            Bienvenue dans votre espace étudiant. Ici, vous pouvez accéder aux
            cours et aux quiz préparés par vos enseignants.
          </Text>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "24px",
          textAlign: "center",
        }}
      >
        <Text
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <img
            src="https://vitejs.dev/logo.svg"
            alt="Logo Vite"
            style={{
              height: "16px",
              width: "16px",
              filter: "brightness(0) invert(0.6)",
            }}
          />
          © {new Date().getFullYear()} QuizMaster - Plateforme d'apprentissage
        </Text>
      </div>
    </div>
  );
}

export default StudentHome;
