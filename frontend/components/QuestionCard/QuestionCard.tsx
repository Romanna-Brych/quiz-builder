import { Box, Button, LinearProgress, Paper, Typography } from "@mui/material";

import type { Question } from "@/types/question";

type QuestionCardProps = {
  question: Question;
  currentQuestionNumber: number;
  totalQuestions: number;
  totalSeconds: number;
  selectedAnswer: string | null;
  isUltimateMode: boolean;
  onAnswer: (answer: string) => void;
  onNext: () => void;
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default function QuestionCard({
  question,
  currentQuestionNumber,
  totalQuestions,
  totalSeconds,
  selectedAnswer,
  isUltimateMode,
  onAnswer,
  onNext,
}: QuestionCardProps) {
  const progress = (currentQuestionNumber / totalQuestions) * 100;

  const getAnswerColor = (option: string) => {
    if (selectedAnswer === null) {
      return "primary";
    }

    if (option === question.correctAnswer) {
      return "success";
    }

    if (option === selectedAnswer) {
      return "error";
    }

    return "primary";
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 650,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Завдання {currentQuestionNumber} з {totalQuestions}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Час: {formatTime(totalSeconds)}
          </Typography>
        </Box>

        <LinearProgress variant="determinate" value={progress} sx={{ mb: 3 }} />

        <Paper
          elevation={1}
          sx={{
            p: {
              xs: 2,
              sm: 4,
            },
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 600,
              mb: 3,
            }}
          >
            {question.text}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            {question.options.map((option) => (
              <Button
                key={option}
                type="button"
                variant={
                  selectedAnswer === option ||
                  (selectedAnswer !== null && option === question.correctAnswer)
                    ? "contained"
                    : "outlined"
                }
                color={getAnswerColor(option)}
                onClick={() => onAnswer(option)}
                sx={{
                  minHeight: 56,
                  textTransform: "none",
                  fontSize: "1rem",
                  pointerEvents: selectedAnswer !== null ? "none" : "auto",
                }}
              >
                {option}
              </Button>
            ))}
          </Box>

          {selectedAnswer !== null && (
            <Box sx={{ mt: 3 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  color:
                    selectedAnswer === question.correctAnswer
                      ? "success.main"
                      : "error.main",
                }}
              >
                {selectedAnswer === question.correctAnswer
                  ? "Правильно"
                  : "Неправильно"}
              </Typography>

              {selectedAnswer !== question.correctAnswer && (
                <Typography sx={{ mt: 1 }} color="text.secondary">
                  Правильна відповідь: <strong>{question.correctAnswer}</strong>
                </Typography>
              )}

              {!isUltimateMode && (
                <Button
                  variant="contained"
                  type="button"
                  onClick={onNext}
                  sx={{
                    mt: 3,
                    textTransform: "none",
                  }}
                >
                  Далі
                </Button>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
