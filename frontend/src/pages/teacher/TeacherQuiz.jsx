import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Space,
  message,
  Empty,
  Spin,
  FloatButton,
  Tooltip,
} from "antd";
import {
  EyeOutlined,
  QuestionCircleOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import QuizDetailsModal from "../../components/QuizDetailsModal";
import { teacherService } from "../../services/TeacherService";

const { Title, Text, Paragraph } = Typography;

function TeacherQuizz() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      console.log("Début du fetch des quiz...");
      const data = await teacherService.getAllQuizzes();
      console.log("Quiz reçus:", data);
      setQuizzes(data);
    } catch (err) {
      console.error("Erreur lors du chargement des quiz:", err);
      message.error(err.message || "Impossible de charger les quiz");
      setQuizzes([]);
    } finally {
      setLoading(false);
      console.log("Chargement des quiz terminé");
    }
  };

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

  const handleViewQuizDetails = async (quiz) => {
    try {
      // Charger les détails complets du quiz avec les questions
      const quizDetails = await teacherService.getQuizDetails(quiz._id);
      console.log("Détails du quiz:", quizDetails);
      setSelectedQuiz(quizDetails);
      setIsModalVisible(true);
    } catch (err) {
      console.error("Erreur lors du chargement des détails:", err);
      message.error("Impossible de charger les détails du quiz");
    }
  };

  const handleGenerateQuiz = () => {
    navigate("/teacher/generate-quiz");
  };

  const handleQuestionStatusChange = async (quizId, questionId, status) => {
    try {

      await teacherService.updateQuestionStatus(quizId, questionId, status);
      message.success(
        `Question ${status ? "validée" : "rejetée"}`
      );

      // Recharger les détails du quiz pour mettre à jour l'affichage
      const updatedQuiz = await teacherService.getQuizDetails(quizId);
      setSelectedQuiz(updatedQuiz);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut:", err);
      message.error("Impossible de mettre à jour le statut de la question");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        position: "relative",
      }}
    >
      {/* Header avec titre centré */}
      <header
        style={{
          padding: "32px 24px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <Title
            level={1}
            style={{
              color: "white",
              margin: 0,
              fontSize: "2.5rem",
              fontWeight: 700,
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              letterSpacing: "-0.5px",
            }}
          >
            Espace Quiz - Enseignant
          </Title>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 24px 80px 24px",
        }}
      >
        <Card
          style={{
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            background: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            padding: "32px",
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 0",
              }}
            >
              <Spin size="large" />
              <Text
                type="secondary"
                style={{ marginTop: "20px", fontSize: "16px" }}
              >
                Chargement des quiz...
              </Text>
            </div>
          ) : quizzes.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div style={{ textAlign: "center" }}>
                  <Title
                    level={3}
                    style={{ color: "#1a1a1a", marginBottom: "12px" }}
                  >
                    Aucun quiz disponible
                  </Title>
                  <Text
                    type="secondary"
                    style={{ fontSize: "16px", display: "block" }}
                  >
                    Commencez par générer votre premier quiz
                  </Text>
                </div>
              }
              style={{ margin: "60px 0" }}
            />
          ) : (
            <Row gutter={[24, 32]}>
              {quizzes.map((quiz) => (
                <Col key={quiz._id} xs={24} sm={12} lg={8}>
                  <Card
                    hoverable
                    style={{
                      height: "100%",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      overflow: "hidden",
                    }}
                    styles={{
                      body: {
                        padding: "0",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      },
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 24px rgba(139, 92, 246, 0.15)";
                      e.currentTarget.style.borderColor = "#8b5cf6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                    }}
                  >
                    {/* Header de la carte */}
                    <div
                      style={{
                        padding: "24px 24px 16px 24px",
                        background:
                          "linear-gradient(135deg, #f8f9fa 0%, #f1f3f9 100%)",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "16px",
                          marginBottom: "16px",
                        }}
                      >
                        <div
                          style={{
                            width: "56px",
                            height: "56px",
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <QuestionCircleOutlined
                            style={{ fontSize: "28px", color: "white" }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <Title
                            level={4}
                            style={{
                              margin: 0,
                              color: "#1a1a1a",
                              lineHeight: "1.4",
                              fontSize: "18px",
                            }}
                          >
                            {quiz.title}
                          </Title>
                        </div>
                      </div>
                    </div>

                    {/* Contenu de la carte */}
                    <div
                      style={{
                        padding: "24px",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Paragraph
                        type="secondary"
                        style={{
                          flex: 1,
                          fontSize: "14px",
                          lineHeight: "1.6",
                          marginBottom: "24px",
                          color: "#6b7280",
                        }}
                      >
                        {quiz.description}
                      </Paragraph>

                      {/* Métadonnées */}
                      <div
                        style={{
                          padding: "16px",
                          background: "#f9fafb",
                          borderRadius: "8px",
                          marginBottom: "24px",
                        }}
                      >
                        <Space
                          orientation="vertical"
                          size={12}
                          style={{ width: "100%" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              type="secondary"
                              style={{ fontSize: "13px", fontWeight: "500" }}
                            >
                              Date création
                            </Text>
                            <Text
                              style={{ fontSize: "13px", fontWeight: "600" }}
                            >
                              {formatDate(quiz.createdAt)}
                            </Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              type="secondary"
                              style={{ fontSize: "13px", fontWeight: "500" }}
                            >
                              Questions
                            </Text>
                            <Text
                              style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                color: "#8b5cf6",
                              }}
                            >
                              {quiz.questionsCount || 0}
                            </Text>
                          </div>
                        </Space>
                      </div>

                      {/* Bouton d'action */}
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewQuizDetails(quiz)}
                        block
                        style={{
                          height: "42px",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        Voir les détails
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card>
      </main>

      {/* Bouton flottant de génération de quiz */}
      <Tooltip title="Générer un quiz" placement="left" color="#8b5cf6">
        <FloatButton
          type="primary"
          icon={<RobotOutlined />}
          onClick={handleGenerateQuiz}
          style={{
            right: 24,
            bottom: 24,
            width: 56,
            height: 56,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)",
          }}
        />
      </Tooltip>

      {/* Popup de détails du quiz */}
      <QuizDetailsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        quiz={selectedQuiz}
        onQuestionStatusChange={handleQuestionStatusChange}
      />
    </div>
  );
}

export default TeacherQuizz;
