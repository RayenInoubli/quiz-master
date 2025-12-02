import {
  Button,
  Card,
  Col,
  Empty,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import {
  EyeOutlined,
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import QuizDetailsModal from "../../components/QuizDetailsModal";
import QuizQuestion from "../../components/QuizQuestion";
import QuizResults from "../../components/QuizResults";
import {
  getAllQuizzes,
  getQuizById,
  submitQuizAnswers,
} from "../../services/StudentService";

const { Title, Text, Paragraph } = Typography;

function StudentQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      console.log("Début du fetch...");
      const res = await getAllQuizzes();
      console.log("Quiz reçus:", res);
      setQuizzes(res);
    } catch (err) {
      console.error("Erreur lors du chargement des quiz:", err);
    } finally {
      setLoading(false);
      console.log("Chargement terminé");
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

  const handleViewQuizDetails = (quiz) => {
    setSelectedQuiz(quiz);
    setIsModalVisible(true);
  };

  const handleStartQuiz = async (quiz) => {
    try {
      setLoading(true);

      // Récupérer le quiz complet avec toutes les questions depuis le backend
      console.log("Chargement du quiz complet:", quiz._id);
      const fullQuiz = await getQuizById(quiz._id);
      console.log("Quiz complet récupéré:", fullQuiz);

      // Vérifications avant de démarrer le quiz
      if (!fullQuiz.questions || fullQuiz.questions.length === 0) {
        console.error("Le quiz ne contient pas de questions");
        alert("Erreur : Ce quiz ne contient pas de questions.");
        return;
      }

      setCurrentQuiz(fullQuiz);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setIsTakingQuiz(true);
    } catch (error) {
      console.error("Erreur lors du chargement du quiz:", error);
      alert("Erreur lors du chargement du quiz. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: optionIndex,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      setLoading(true);

      // Vérifier que toutes les questions ont été répondues
      const unansweredQuestions = [];
      for (let i = 0; i < currentQuiz.questions.length; i++) {
        if (answers[i] === undefined || answers[i] === null) {
          unansweredQuestions.push(i + 1);
        }
      }

      if (unansweredQuestions.length > 0) {
        message.warning(
          `Veuillez répondre à toutes les questions. Questions non répondues: ${unansweredQuestions.join(
            ", "
          )}`
        );
        setLoading(false);
        return;
      }

      // Soumettre les réponses au backend
      console.log("Soumission des réponses:", answers);
      const result = await submitQuizAnswers(currentQuiz._id, answers);

      console.log("Résultat reçu:", result);
      setQuizResult(result);
      setShowResults(true);
      setIsTakingQuiz(false);

      message.success("Quiz terminé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la soumission du quiz:", error);
      message.error(
        "Erreur lors de la soumission du quiz. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setShowResults(false);
    setQuizResult(null);
    setCurrentQuiz(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
  };

  const handleRetakeQuiz = async () => {
    if (currentQuiz) {
      setShowResults(false);
      setQuizResult(null);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setIsTakingQuiz(true);
    }
  };

  // Si on affiche les résultats
  if (showResults && quizResult) {
    return (
      <QuizResults
        result={quizResult.data}
        onBackToList={handleBackToList}
        onRetakeQuiz={handleRetakeQuiz}
      />
    );
  }

  // Si l'utilisateur passe le quiz
  if (isTakingQuiz && currentQuiz) {
    // Vérification de sécurité
    if (!currentQuiz.questions || currentQuiz.questions.length === 0) {
      return (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <Title level={3}>Erreur : Ce quiz ne contient pas de questions</Title>
          <Button
            type="primary"
            onClick={() => {
              setIsTakingQuiz(false);
              setCurrentQuiz(null);
            }}
            style={{ marginTop: "20px" }}
          >
            Retour à la liste
          </Button>
        </div>
      );
    }

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];

    // Vérification supplémentaire pour la question actuelle
    if (!currentQuestion) {
      return (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <Title level={3}>Erreur : Question introuvable</Title>
          <Button
            type="primary"
            onClick={() => {
              setIsTakingQuiz(false);
              setCurrentQuiz(null);
            }}
            style={{ marginTop: "20px" }}
          >
            Retour à la liste
          </Button>
        </div>
      );
    }

    return (
      <div style={{ position: "relative" }}>
        <QuizQuestion
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={currentQuiz.questions.length}
          questionText={currentQuestion.text}
          options={currentQuestion.answers.map((answer) => answer.text)}
          selectedOption={answers[currentQuestionIndex]}
          onSelectOption={handleSelectOption}
        />
        <Modal
          title="Quitter le quiz"
          open={showExitModal}
          onCancel={() => setShowExitModal(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowExitModal(false)}>
              Annuler
            </Button>,
            <Button
              key="confirm"
              danger
              type="primary"
              onClick={() => {
                setIsTakingQuiz(false);
                setCurrentQuiz(null);
                setAnswers({});
                setShowExitModal(false);
              }}
            >
              Quitter
            </Button>,
          ]}
        >
          <p style={{ fontSize: "16px" }}>
            Êtes-vous sûr de vouloir quitter le quiz ? Votre progression sera
            perdue.
          </p>
        </Modal>
        {/* Boutons de navigation */}
        <div
          style={{
            position: "fixed",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "16px",
            zIndex: 1000,
          }}
        >
          {currentQuestionIndex > 0 && (
            <Button
              icon={<ArrowLeftOutlined />}
              size="large"
              onClick={handlePreviousQuestion}
              style={{
                height: "48px",
                padding: "0 32px",
                borderRadius: "24px",
                fontWeight: "600",
              }}
            >
              Précédent
            </Button>
          )}

          {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              size="large"
              onClick={handleNextQuestion}
              disabled={answers[currentQuestionIndex] === undefined}
              style={{
                height: "48px",
                padding: "0 32px",
                borderRadius: "24px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                fontWeight: "600",
              }}
            >
              Suivant
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              size="large"
              onClick={handleSubmitQuiz}
              disabled={answers[currentQuestionIndex] === undefined}
              style={{
                height: "48px",
                padding: "0 32px",
                borderRadius: "24px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                border: "none",
                fontWeight: "600",
              }}
            >
              Terminer le quiz
            </Button>
          )}

          <Button
            danger
            size="large"
            onClick={() => setShowExitModal(true)}
            style={{
              height: "48px",
              padding: "0 32px",
              borderRadius: "24px",
              fontWeight: "600",
            }}
          >
            Quitter
          </Button>
        </div>
      </div>
    );
  }

  // Vue liste des quiz
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
            Espace Quiz - Etudiant
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
                          direction="vertical"
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
                        onClick={() => handleStartQuiz(quiz)}
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
                        Commencer le quiz
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card>
      </main>

      {/* Popup de détails du quiz */}
      <QuizDetailsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        quiz={selectedQuiz}
      />
    </div>
  );
}

export default StudentQuiz;
