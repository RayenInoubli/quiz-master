import React, { useState } from "react";
import {
  Modal,
  Typography,
  Tag,
  Divider,
  Switch,
  Card,
  Space,
  Button,
  Flex,
  Collapse,
  Badge,
  message,
  Popconfirm,
} from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  CloseOutlined,
  CheckOutlined,
  CloseOutlined as CloseIcon,
  RightOutlined,
  DownOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { teacherService } from "../services/TeacherService";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const QuizDetailsModal = ({
  visible,
  onClose,
  quiz,
  onQuestionStatusChange,
  onPublished,
}) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [localQuestions, setLocalQuestions] = useState(quiz?.questions || []);
  const [updatingQuestions, setUpdatingQuestions] = useState({});
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);

  // Update local questions when quiz changes
  React.useEffect(() => {
    if (quiz?.questions) {
      setLocalQuestions(quiz.questions);
    }
  }, [quiz]);

  const handleStatusChange = async (questionId, checked) => {
    if (!quiz) return;

    // Prevent accordion from opening
    if (event) {
      event.stopPropagation();
    }

    // Optimistic update
    const previousQuestions = [...localQuestions];
    const updatedQuestions = localQuestions.map((q) =>
      q._id === questionId ? { ...q, status: checked } : q
    );

    // Update local state immediately
    setLocalQuestions(updatedQuestions);
    setUpdatingQuestions((prev) => ({ ...prev, [questionId]: true }));

    try {
      // Call API - suppress default success message if possible
      const result = await teacherService.updateQuestionStatus(
        quiz._id,
        questionId,
        checked
      );

      // Update parent component if callback exists - tell it not to show message
      if (onQuestionStatusChange) {
        onQuestionStatusChange(quiz._id, questionId, checked, true); // Add a flag to suppress message
      }

      // Show success message ONLY in the modal
      // message.success({
      //   content: `Question ${checked ? "validée" : "rejetée"} avec succès`,
      //   key: "question-status-update", // Use a unique key to prevent duplicate
      //   duration: 2,
      // });
    } catch (err) {
      // Revert optimistic update on error
      setLocalQuestions(previousQuestions);
      message.error({
        content:
          err?.message ||
          "Impossible de mettre à jour le statut de la question",
        key: "question-status-error",
        duration: 3,
      });
    } finally {
      setUpdatingQuestions((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const handlePanelChange = (key) => {
    setExpandedKeys(key);
  };

  if (!quiz) return null;

  const approvedCount = localQuestions.filter((q) => q.status === true).length;
  const totalCount = localQuestions.length;
  const isPublished = quiz?.isPublished === true;

  // Handle publish/unpublish toggle
  const handlePublishToggle = async () => {
    if (!quiz) return;

    try {
      if (isPublished) {
        setUnpublishing(true);
        await teacherService.unpublishQuiz(quiz._id);
        message.success("Quiz dépublié avec succès");
      } else {
        setPublishing(true);
        await teacherService.publishQuiz(quiz._id);
        message.success("Quiz publié avec succès");
      }

      if (onPublished) onPublished();
    } catch (err) {
      message.error(
        err?.message ||
          `Impossible de ${isPublished ? "dépublier" : "publier"} le quiz`
      );
    } finally {
      setPublishing(false);
      setUnpublishing(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={1000}
      closeIcon={<CloseOutlined />}
      footer={null}
      styles={{
        body: {
          padding: 0,
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 100px)",
          maxHeight: "900px",
        },
      }}
      style={{
        top: "50px",
        maxHeight: "calc(100vh - 100px)",
      }}
    >
      {/* Header fixe */}
      <div
        style={{
          padding: "20px 24px",
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          flexShrink: 0,
        }}
      >
        <Flex justify="space-between" align="center">
          <Space align="center">
            <QuestionCircleOutlined
              style={{
                fontSize: "24px",
                color: "#8b5cf6",
                marginRight: "12px",
              }}
            />
            <div>
              <Title level={3} style={{ margin: 0, color: "#1a1a1a" }}>
                {quiz.title}
              </Title>
              <Text type="secondary" style={{ fontSize: "14px" }}>
                Détails du quiz et gestion des questions
              </Text>
            </div>
          </Space>
          <Space>
            <Tag color="blue" icon={<FileTextOutlined />}>
              Cours: {quiz.courseSource || "N/A"}
            </Tag>
            <Tag color="green" icon={<QuestionCircleOutlined />}>
              {totalCount} questions
            </Tag>
            {isPublished && (
              <Tag color="purple" icon={<EyeOutlined />}>
                Publié
              </Tag>
            )}
          </Space>
        </Flex>
      </div>

      {/* Contenu de la modal (scrollable) */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
        }}
      >
        {/* Description du quiz */}
        <Card
          style={{
            background: "#f8f9fa",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
          styles={{
            body: {
              padding: "32px",
            },
          }}
        >
          <Paragraph
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            {quiz.description}
          </Paragraph>
          <div style={{ marginTop: "12px" }}>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              Créé le:{" "}
              {quiz.createdAt
                ? new Date(quiz.createdAt).toLocaleDateString("fr-FR")
                : "N/A"}
            </Text>
            {isPublished && quiz.updatedAt && (
              <Text
                type="secondary"
                style={{ fontSize: "13px", marginLeft: "16px" }}
              >
                Publié le:{" "}
                {new Date(quiz.updatedAt).toLocaleDateString("fr-FR")}
              </Text>
            )}
          </div>
        </Card>

        {/* Liste des questions */}
        <Divider
          orientation="center"
          style={{
            fontSize: "16px",
            fontWeight: "500",
            marginTop: "8px",
            marginBottom: "16px",
          }}
        >
          Questions ({totalCount})
        </Divider>

        <div style={{ marginBottom: "16px" }}>
          <Collapse
            activeKey={expandedKeys}
            onChange={handlePanelChange}
            expandIconPosition="right"
            bordered={false}
            style={{ background: "transparent" }}
          >
            {localQuestions.map((question, index) => (
              <Panel
                key={question._id}
                header={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      padding: "8px 0",
                    }}
                    onClick={(e) => {
                      // Toggle panel only when clicking outside the switch
                      if (!e.target.closest(".question-switch-container")) {
                        const newExpandedKeys = expandedKeys.includes(
                          question._id
                        )
                          ? expandedKeys.filter((key) => key !== question._id)
                          : [...expandedKeys, question._id];
                        setExpandedKeys(newExpandedKeys);
                      }
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <Space align="start">
                        <Badge
                          count={index + 1}
                          style={{
                            backgroundColor:
                              question.type === "QCM" ? "#1890ff" : "#722ed1",
                            marginRight: "12px",
                          }}
                        />
                        <div>
                          <Text
                            strong
                            style={{
                              fontSize: "14px",
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            {question.text || question.question}
                          </Text>
                        </div>
                      </Space>
                    </div>
                    <div
                      style={{
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div
                        className="question-switch-container"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          minWidth: "180px",
                          justifyContent: "flex-end",
                        }}
                        onClick={(e) => e.stopPropagation()} // Prevent panel toggle
                      >
                        <Switch
                          checked={question.status === true}
                          checkedChildren={
                            updatingQuestions[question._id] ? (
                              <span style={{ fontSize: "10px" }}>...</span>
                            ) : (
                              <CheckCircleOutlined />
                            )
                          }
                          unCheckedChildren={
                            updatingQuestions[question._id] ? (
                              <span style={{ fontSize: "10px" }}>...</span>
                            ) : (
                              <CloseCircleOutlined />
                            )
                          }
                          onChange={(checked) => {
                            // Prevent default event bubbling
                            handleStatusChange(question._id, checked);
                          }}
                          onClick={(e) => e.stopPropagation()} // Additional prevention
                          size="small"
                          loading={updatingQuestions[question._id]}
                          style={{
                            background:
                              question.status === true
                                ? "#52c41a"
                                : question.status === false
                                ? "#ff4d4f"
                                : "#d9d9d9",
                          }}
                        />
                        <Text
                          type="secondary"
                          style={{
                            fontSize: "12px",
                            minWidth: "70px",
                            textAlign: "center",
                          }}
                        >
                          {updatingQuestions[question._id]
                            ? "Mise à jour..."
                            : question.status === true
                            ? "Validée"
                            : question.status === false
                            ? "Rejetée"
                            : "À valider"}
                        </Text>
                      </div>
                      {expandedKeys.includes(question._id) ? (
                        <DownOutlined
                          style={{
                            color: "#8b5cf6",
                            fontSize: "12px",
                            marginLeft: "8px",
                          }}
                        />
                      ) : (
                        <RightOutlined
                          style={{
                            color: "#8c8c8c",
                            fontSize: "12px",
                            marginLeft: "8px",
                          }}
                        />
                      )}
                    </div>
                  </div>
                }
                style={{
                  marginBottom: "12px",
                  background: "white",
                  borderRadius: "8px",
                  border: `1px solid ${
                    question.status === true
                      ? "#d9f7be"
                      : question.status === false
                      ? "#ffccc7"
                      : "#ffe7ba"
                  }`,
                  borderLeft: `4px solid ${
                    question.status === true
                      ? "#52c41a"
                      : question.status === false
                      ? "#ff4d4f"
                      : "#faad14"
                  }`,
                }}
              >
                {/* Contenu de l'accordéon */}
                <div style={{ padding: "16px 0 8px 0" }}>
                  <div>
                    <Text
                      strong
                      style={{
                        display: "block",
                        marginBottom: "16px",
                        color: "#1a1a1a",
                      }}
                    >
                      Réponses possibles :
                    </Text>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      {(question.answers || question.options || []).map(
                        (answer, idx) => (
                          <Card
                            key={answer._id || idx}
                            style={{
                              border:
                                answer.isCorrect || answer.is_correct
                                  ? "2px solid #52c41a"
                                  : "1px solid #e5e7eb",
                              background:
                                answer.isCorrect || answer.is_correct
                                  ? "#f6ffed"
                                  : "white",
                              borderRadius: "6px",
                              marginBottom: "8px",
                            }}
                            styles={{
                              body: { padding: "12px 16px" },
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Space>
                                {answer.isCorrect || answer.is_correct ? (
                                  <CheckOutlined
                                    style={{
                                      color: "#52c41a",
                                      fontSize: "16px",
                                    }}
                                  />
                                ) : (
                                  <CloseIcon
                                    style={{
                                      color: "#ff4d4f",
                                      fontSize: "16px",
                                      opacity: 0.5,
                                    }}
                                  />
                                )}
                                <Text style={{ fontSize: "14px" }}>
                                  {answer.text || answer.option}
                                </Text>
                              </Space>
                              {(answer.isCorrect || answer.is_correct) && (
                                <Tag color="success" icon={<CheckOutlined />}>
                                  Réponse correcte
                                </Tag>
                              )}
                            </div>
                          </Card>
                        )
                      )}
                    </Space>
                  </div>

                  {/* Actions spécifiques */}
                  <div
                    style={{
                      marginTop: "20px",
                      paddingTop: "16px",
                      borderTop: "1px solid #f0f0f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Space>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Question #{index + 1}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Statut:{" "}
                        {question.status === true
                          ? "Validée"
                          : question.status === false
                          ? "Rejetée"
                          : "À valider"}
                      </Text>
                    </Space>
                  </div>
                </div>
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>

      {/* Footer fixe */}
      <div
        style={{
          padding: "16px 24px",
          background: "white",
          borderTop: "1px solid #e5e7eb",
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Text strong style={{ marginRight: "16px" }}>
            Taux de validation:{" "}
            <span style={{ color: "#52c41a" }}>
              {totalCount > 0
                ? Math.round((approvedCount / totalCount) * 100)
                : 0}
              %
            </span>
          </Text>
          <Text type="secondary" style={{ fontSize: "13px" }}>
            ({approvedCount} / {totalCount} questions)
          </Text>
        </div>
        <Space>
          <Button onClick={onClose}>Fermer</Button>
          {isPublished ? (
            <Popconfirm
              title="Dépublier le quiz"
              description="Êtes-vous sûr de vouloir dépublier ce quiz ? Les étudiants ne pourront plus y accéder."
              onConfirm={handlePublishToggle}
              okText="Oui, dépublier"
              cancelText="Annuler"
            >
              <Button
                type="primary"
                danger
                loading={unpublishing}
                icon={<EyeInvisibleOutlined />}
                style={{
                  background:
                    "linear-gradient(135deg, #f56565 0%, #c53030 100%)",
                  border: "none",
                }}
              >
                Dépublier le quiz
              </Button>
            </Popconfirm>
          ) : (
            <Button
              type="primary"
              onClick={handlePublishToggle}
              disabled={approvedCount === 0}
              loading={publishing}
              icon={<EyeOutlined />}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
              }}
            >
              Publier le quiz
            </Button>
          )}
        </Space>
      </div>
    </Modal>
  );
};

export default QuizDetailsModal;
