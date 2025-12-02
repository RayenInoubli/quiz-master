import { Card, Typography, Button, Space, Progress, Tag } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  HomeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

function QuizResults({ result, onBackToList, onRetakeQuiz }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "#10b981";
      case "good":
        return "#3b82f6";
      case "passed":
        return "#f59e0b";
      case "failed":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "excellent":
        return "Excellent ! 🎉";
      case "good":
        return "Très bien ! 👏";
      case "passed":
        return "Réussi 👍";
      case "failed":
        return "Échoué 😔";
      default:
        return "Terminé";
    }
  };

  const statusColor = getStatusColor(result.status);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* En-tête avec score */}
        <Card
          style={{
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            marginBottom: "24px",
            background: `linear-gradient(135deg, ${statusColor}15 0%, ${statusColor}05 100%)`,
          }}
        >
          <div style={{ textAlign: "center", padding: "32px 24px" }}>
            <TrophyOutlined
              style={{
                fontSize: "64px",
                color: statusColor,
                marginBottom: "24px",
              }}
            />
            
            <Title level={2} style={{ margin: 0, marginBottom: "8px" }}>
              {getStatusText(result.status)}
            </Title>
            
            <Text type="secondary" style={{ fontSize: "16px", display: "block", marginBottom: "24px" }}>
              {result.quizTitle}
            </Text>

            <div style={{ marginBottom: "24px" }}>
              <Progress
                type="circle"
                percent={result.scorePercentage}
                strokeColor={statusColor}
                width={140}
                format={(percent) => (
                  <div>
                    <div style={{ fontSize: "32px", fontWeight: "700" }}>
                      {percent}%
                    </div>
                    <div style={{ fontSize: "14px", color: "#6b7280" }}>
                      Score
                    </div>
                  </div>
                )}
              />
            </div>

            <Space size={24} style={{ justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#10b981" }}>
                  {result.correctAnswers}
                </div>
                <Text type="secondary">Correctes</Text>
              </div>
              
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#ef4444" }}>
                  {result.incorrectAnswers}
                </div>
                <Text type="secondary">Incorrectes</Text>
              </div>
              
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#6b7280" }}>
                  {result.totalQuestions}
                </div>
                <Text type="secondary">Total</Text>
              </div>
            </Space>

            <Space size={16} style={{ marginTop: "32px" }}>
              <Button
                type="primary"
                icon={<HomeOutlined />}
                size="large"
                onClick={onBackToList}
                style={{
                  height: "48px",
                  padding: "0 32px",
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  fontWeight: "600",
                }}
              >
                Retour à la liste
              </Button>
              
              <Button
                icon={<ReloadOutlined />}
                size="large"
                onClick={onRetakeQuiz}
                style={{
                  height: "48px",
                  padding: "0 32px",
                  borderRadius: "24px",
                  fontWeight: "600",
                }}
              >
                Refaire le quiz
              </Button>
            </Space>
          </div>
        </Card>

        {/* Détail des réponses */}
        <Title level={3} style={{ marginBottom: "24px" }}>
          Détail des réponses
        </Title>

        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {result.detailedResults.map((detail, index) => (
            <Card
              key={detail.questionId}
              style={{
                borderRadius: "12px",
                border: `2px solid ${detail.isCorrect ? "#10b981" : "#ef4444"}`,
                background: "white",
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <Space>
                  <Tag color={detail.isCorrect ? "success" : "error"}>
                    Question {index + 1}
                  </Tag>
                  {detail.isCorrect ? (
                    <CheckCircleOutlined style={{ fontSize: "20px", color: "#10b981" }} />
                  ) : (
                    <CloseCircleOutlined style={{ fontSize: "20px", color: "#ef4444" }} />
                  )}
                </Space>
              </div>

              <Paragraph
                strong
                style={{
                  fontSize: "16px",
                  marginBottom: "16px",
                  color: "#1a1a1a",
                }}
              >
                {detail.questionText}
              </Paragraph>

              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {detail.allAnswers.map((answer, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      background: answer.isCorrect
                        ? "#10b98120"
                        : answer.wasSelected
                        ? "#ef444420"
                        : "#f9fafb",
                      border: `2px solid ${
                        answer.isCorrect
                          ? "#10b981"
                          : answer.wasSelected
                          ? "#ef4444"
                          : "#e5e7eb"
                      }`,
                    }}
                  >
                    <Space>
                      {answer.isCorrect && (
                        <CheckCircleOutlined style={{ color: "#10b981" }} />
                      )}
                      {answer.wasSelected && !answer.isCorrect && (
                        <CloseCircleOutlined style={{ color: "#ef4444" }} />
                      )}
                      <Text
                        style={{
                          fontWeight: answer.isCorrect || answer.wasSelected ? "600" : "400",
                        }}
                      >
                        {answer.text}
                      </Text>
                      {answer.isCorrect && (
                        <Tag color="success">Bonne réponse</Tag>
                      )}
                      {answer.wasSelected && (
                        <Tag color={answer.isCorrect ? "success" : "error"}>
                          Votre réponse
                        </Tag>
                      )}
                    </Space>
                  </div>
                ))}
              </Space>
            </Card>
          ))}
        </Space>
      </div>
    </div>
  );
}

export default QuizResults;