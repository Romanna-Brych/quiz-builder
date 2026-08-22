import type { Topic } from "@/types/question";

type TrainerSettingsProps = {
  selectedTopic: Topic;
  questionCount: number;
  isUltimateMode: boolean;
  availableQuestionsCount: number;
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
  availableQuestionsCount,
  topicLabels,
  onTopicChange,
  onQuestionCountChange,
  onUltimateModeChange,
  onStart,
}: TrainerSettingsProps) {
  return (
    <main>
      <h1>Математичний тренажер</h1>

      <div>
        <label htmlFor="topic">Оберіть тему:</label>

        <select
          id="topic"
          value={selectedTopic}
          onChange={(event) => {
            onTopicChange(event.target.value as Topic);
            onQuestionCountChange(1);
          }}
        >
          {Object.entries(topicLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="questionCount">Кількість завдань:</label>

        <input
          id="questionCount"
          type="number"
          min="1"
          max={availableQuestionsCount}
          value={questionCount}
          onChange={(event) =>
            onQuestionCountChange(Number(event.target.value))
          }
        />
      </div>

      <label>
        <input
          type="checkbox"
          checked={isUltimateMode}
          onChange={(event) => onUltimateModeChange(event.target.checked)}
        />
        Ultimate режим
      </label>

      <button type="button" onClick={onStart}>
        Почати
      </button>
    </main>
  );
}
