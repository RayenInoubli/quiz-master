import { Card, Typography, Space, Progress } from "antd";
import { useEffect } from "react";

const { Title, Text } = Typography;

function QuizQuestion({ 
  questionNumber, 
  totalQuestions, 
  questionText, 
  options, 
  selectedOption, 
  onSelectOption 
}) {
  
  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      
      // Vérifier si une touche numérique est pressée (1-4)
      if (key >= '1' && key <= '4') {
        const optionIndex = parseInt(key) - 1;
        if (optionIndex < options.length) {
          onSelectOption(optionIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    // Nettoyer l'écouteur d'événements
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [options.length, onSelectOption]);

  // Calculer le pourcentage de progression
  const progressPercent = (questionNumber / totalQuestions) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "900px",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* En-tête avec progression */}
        <div
          style={{
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: "20px",
              padding: "8px 20px",
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            {questionNumber} / {totalQuestions}
          </div>
          
          <Progress
            percent={progressPercent}
            showInfo={false}
            strokeColor={{
              '0%': '#667eea',
              '100%': '#764ba2',
            }}
            style={{ maxWidth: "600px", margin: "0 auto" }}
          />
        </div>

        {/* Question */}
        <div
          style={{
            marginBottom: "40px",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <Title
            level={3}
            style={{
              color: "#1a1a1a",
              fontSize: "24px",
              lineHeight: "1.5",
              fontWeight: "600",
              margin: 0,
            }}
          >
            {questionText}
          </Title>
        </div>

        {/* Options */}
        <Space
          direction="vertical"
          size={16}
          style={{ width: "100%", padding: "0 24px" }}
        >
          {options.map((option, index) => {
            const isSelected = selectedOption === index;
            
            return (
              <div
                key={index}
                onClick={() => onSelectOption(index)}
                style={{
                  padding: "20px 24px",
                  background: isSelected 
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                    : "#ffffff",
                  border: isSelected 
                    ? "2px solid #667eea" 
                    : "2px solid #e5e7eb",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transform: isSelected ? "translateX(8px)" : "translateX(0)",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "#8b5cf6";
                    e.currentTarget.style.background = "#f9fafb";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.transform = "translateX(0)";
                  }
                }}
              >
                <Text
                  style={{
                    fontSize: "16px",
                    color: isSelected ? "#ffffff" : "#1a1a1a",
                    fontWeight: isSelected ? "600" : "500",
                    flex: 1,
                  }}
                >
                  {option}
                </Text>
                
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: isSelected 
                      ? "rgba(255, 255, 255, 0.2)" 
                      : "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "700",
                    color: isSelected ? "#ffffff" : "#6b7280",
                    marginLeft: "16px",
                  }}
                >
                  {index + 1}
                </div>
              </div>
            );
          })}
        </Space>

        {/* Indication clavier */}
        <div
          style={{
            marginTop: "32px",
            padding: "16px",
            background: "#f9fafb",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <Text
            type="secondary"
            style={{
              fontSize: "13px",
              fontStyle: "italic",
            }}
          >
            💡 Astuce : Utilisez les touches 1, 2, 3, 4 pour répondre rapidement
          </Text>
        </div>
      </Card>
    </div>
  );
}

export default QuizQuestion;