import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import type { Topic } from "@/types/question";

type TrainerSettingsProps = {
  selectedTopic: Topic;
  questionCount: number;
  isUltimateMode: boolean;
  topicLabels: Record<Topic, string>;
  onTopicChange: (topic: Topic) => void;
  onQuestionCountChange: (count: number) => void;
  onUltimateModeChange: (value: boolean) => void;
  onStart: () => void;
};

export default function TrainerSettings({
  selectedTopic,
  questionCount,
  isUltimateMode,
  topicLabels,
  onTopicChange,
  onQuestionCountChange,
  onUltimateModeChange,
  onStart,
}: TrainerSettingsProps) {
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
          maxWidth: 520,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Математичний тренажер
        </Typography>

        <FormControl fullWidth>
          <InputLabel id="topic-label">Тема</InputLabel>

          <Select
            labelId="topic-label"
            id="topic"
            value={selectedTopic}
            label="Тема"
            onChange={(event) => {
              onTopicChange(event.target.value as Topic);
              onQuestionCountChange(5);
            }}
          >
            {Object.entries(topicLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              color: "text.secondary",
            }}
          >
            Кількість завдань
          </Typography>

          <ToggleButtonGroup
            value={questionCount}
            exclusive
            fullWidth
            onChange={(_, value: number | null) => {
              if (value !== null) {
                onQuestionCountChange(value);
              }
            }}
          >
            <ToggleButton value={5}>5</ToggleButton>
            <ToggleButton value={10}>10</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={isUltimateMode}
              onChange={(event) => onUltimateModeChange(event.target.checked)}
            />
          }
          label="Ultimate режим"
        />

        <Button
          variant="contained"
          size="large"
          onClick={onStart}
          sx={{
            py: 1.4,
          }}
        >
          Почати
        </Button>
      </Box>
    </Box>
  );
}
