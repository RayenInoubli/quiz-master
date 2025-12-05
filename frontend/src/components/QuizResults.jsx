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
        background: "linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)",
        padding: "40px 24px 80px 24px",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* En-tête avec score */}
        <Card
          style={{
            borderRadius: "20px",
            border: "none",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            marginBottom: "32px",
            background: `linear-gradient(135deg, ${statusColor}15 0%, ${statusColor}05 100%)`,
          }}
        >
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                margin: "0 auto 24px",
                background: `linear-gradient(135deg, ${statusColor} 0%, ${statusColor}dd 100%)`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 24px ${statusColor}40`,
              }}
            >
              <TrophyOutlined
                style={{
                  fontSize: "48px",
                  color: "white",
                }}
              />
            </div>

            <Title
              level={2}
              style={{ margin: 0, marginBottom: "8px", fontSize: "32px" }}
            >
              {getStatusText(result.status)}
            </Title>

            <Text
              type="secondary"
              style={{
                fontSize: "17px",
                display: "block",
                marginBottom: "40px",
              }}
            >
              {result.quizTitle}
            </Text>

            <div style={{ marginBottom: "40px" }}>
              <Progress
                type="circle"
                percent={result.scorePercentage}
                strokeColor={{
                  "0%": statusColor,
                  "100%": `${statusColor}cc`,
                }}
                width={160}
                strokeWidth={8}
                format={(percent) => (
                  <div>
                    <div
                      style={{
                        fontSize: "36px",
                        fontWeight: "700",
                        color: statusColor,
                      }}
                    >
                      {percent}%
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        fontWeight: "500",
                      }}
                    >
                      Score
                    </div>
                  </div>
                )}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "32px",
                marginBottom: "40px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "20px 32px",
                  background: "white",
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  minWidth: "140px",
                }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "#10b981",
                    marginBottom: "8px",
                  }}
                >
                  {result.correctAnswers}
                </div>
                <Text
                  type="secondary"
                  style={{ fontSize: "14px", fontWeight: "500" }}
                >
                  Correctes
                </Text>
              </div>

              <div
                style={{
                  textAlign: "center",
                  padding: "20px 32px",
                  background: "white",
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  minWidth: "140px",
                }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "#ef4444",
                    marginBottom: "8px",
                  }}
                >
                  {result.incorrectAnswers}
                </div>
                <Text
                  type="secondary"
                  style={{ fontSize: "14px", fontWeight: "500" }}
                >
                  Incorrectes
                </Text>
              </div>

              <div
                style={{
                  textAlign: "center",
                  padding: "20px 32px",
                  background: "white",
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  minWidth: "140px",
                }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  {result.totalQuestions}
                </div>
                <Text
                  type="secondary"
                  style={{ fontSize: "14px", fontWeight: "500" }}
                >
                  Total
                </Text>
              </div>
            </div>

            <Space size={16}>
              <Button
                type="primary"
                icon={<HomeOutlined />}
                size="large"
                onClick={onBackToList}
                style={{
                  height: "52px",
                  padding: "0 36px",
                  borderRadius: "26px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  fontWeight: "600",
                  fontSize: "15px",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)",
                }}
              >
                Retour à la liste
              </Button>

              <Button
                icon={<ReloadOutlined />}
                size="large"
                onClick={onRetakeQuiz}
                style={{
                  height: "52px",
                  padding: "0 36px",
                  borderRadius: "26px",
                  fontWeight: "600",
                  fontSize: "15px",
                  border: "2px solid #667eea",
                  color: "#667eea",
                }}
              >
                Refaire le quiz
              </Button>
            </Space>
          </div>
        </Card>

        {/* Détail des réponses */}
        <div style={{ marginBottom: "24px" }}>
          <Title level={3} style={{ fontSize: "24px", fontWeight: "600" }}>
            Détail des réponses
          </Title>
          <Text type="secondary" style={{ fontSize: "15px" }}>
            Revoyez vos réponses et les corrections
          </Text>
        </div>

        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          {result.detailedResults.map((detail, index) => (
            <Card
              key={detail.questionId}
              style={{
                borderRadius: "16px",
                border: "none",
                background: "white",
                boxShadow: detail.isCorrect
                  ? "0 4px 16px rgba(16, 185, 129, 0.15)"
                  : "0 4px 16px rgba(239, 68, 68, 0.15)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "4px 20px",
                  background: detail.isCorrect
                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Space>
                  <Tag
                    style={{
                      background: "rgba(255, 255, 255, 0.25)",
                      color: "white",
                      border: "none",
                      fontWeight: "600",
                      padding: "4px 12px",
                    }}
                  >
                    Question {index + 1}
                  </Tag>
                </Space>
                {detail.isCorrect ? (
                  <CheckCircleOutlined
                    style={{ fontSize: "22px", color: "white" }}
                  />
                ) : (
                  <CloseCircleOutlined
                    style={{ fontSize: "22px", color: "white" }}
                  />
                )}
              </div>

              <div style={{ padding: "0 20px 20px 20px" }}>
                <Paragraph
                  strong
                  style={{
                    fontSize: "17px",
                    marginBottom: "24px",
                    color: "#1a1a1a",
                    lineHeight: "1.6",
                  }}
                >
                  {detail.questionText}
                </Paragraph>

                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  {detail.allAnswers.map((answer, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "16px 20px",
                        borderRadius: "12px",
                        background: answer.isCorrect
                          ? "#10b98115"
                          : answer.wasSelected
                          ? "#ef444415"
                          : "#f9fafb",
                        border: `2px solid ${
                          answer.isCorrect
                            ? "#10b981"
                            : answer.wasSelected
                            ? "#ef4444"
                            : "#e5e7eb"
                        }`,
                        transition: "all 0.2s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "12px",
                        }}
                      >
                        <Space>
                          {answer.isCorrect && (
                            <CheckCircleOutlined
                              style={{ color: "#10b981", fontSize: "18px" }}
                            />
                          )}
                          {answer.wasSelected && !answer.isCorrect && (
                            <CloseCircleOutlined
                              style={{ color: "#ef4444", fontSize: "18px" }}
                            />
                          )}
                          <Text
                            style={{
                              fontWeight:
                                answer.isCorrect || answer.wasSelected
                                  ? "600"
                                  : "400",
                              fontSize: "15px",
                            }}
                          >
                            {answer.text}
                          </Text>
                        </Space>
                        <Space>
                          {answer.isCorrect && (
                            <Tag
                              color="success"
                              style={{
                                borderRadius: "8px",
                                padding: "4px 12px",
                                fontWeight: "600",
                              }}
                            >
                              Bonne réponse
                            </Tag>
                          )}
                          {answer.wasSelected && (
                            <Tag
                              color={answer.isCorrect ? "success" : "error"}
                              style={{
                                borderRadius: "8px",
                                padding: "4px 12px",
                                fontWeight: "600",
                              }}
                            >
                              Votre réponse
                            </Tag>
                          )}
                        </Space>
                      </div>
                    </div>
                  ))}
                </Space>
              </div>
            </Card>
          ))}
        </Space>
      </div>
    </div>
  );
}

export default QuizResults;
