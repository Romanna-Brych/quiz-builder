type TrainerResultsProps = {
  correctAnswers: number;
  totalQuestions: number;
  totalSeconds: number;
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
}: TrainerResultsProps) {
  const averageTime = totalQuestions > 0 ? totalSeconds / totalQuestions : 0;

  return (
    <main>
      <h1>Тренування завершено</h1>

      <p>
        Правильних відповідей: {correctAnswers} / {totalQuestions}
      </p>

      <p>Загальний час: {formatTime(totalSeconds)}</p>
      <p>Середній час: {averageTime.toFixed(1)} с</p>
    </main>
  );
}
