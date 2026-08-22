import { Box, Button, Paper, Typography } from "@mui/material";

type TrainerResultsProps = {
  correctAnswers: number;
  totalQuestions: number;
  totalSeconds: number;
  onRestart: () => void;
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default function TrainerResults({
  correctAnswers,
  totalQuestions,
  totalSeconds,
  onRestart,
}: TrainerResultsProps) {
  const averageTime = totalQuestions > 0 ? totalSeconds / totalQuestions : 0;

  const percentage =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

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
      <Paper
        elevation={1}
        sx={{
          width: "100%",
          maxWidth: 520,
          p: {
            xs: 3,
            sm: 4,
          },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Тренування завершено
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Результати вашого тренування
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Правильні відповіді
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {correctAnswers} / {totalQuestions}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Результат
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {percentage}%
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Загальний час
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {formatTime(totalSeconds)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Середній час
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {averageTime.toFixed(1)} с
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={onRestart}
          sx={{
            textTransform: "none",
          }}
        >
          Пройти ще раз
        </Button>
      </Paper>
    </Box>
  );
}
