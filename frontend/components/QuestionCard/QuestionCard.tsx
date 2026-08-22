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
  return (
    <main>
      <p>
        Завдання {currentQuestionNumber} з {totalQuestions}
      </p>

      <p>Час: {formatTime(totalSeconds)}</p>

      <h1>{question.text}</h1>

      <div>
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={selectedAnswer !== null}
            onClick={() => onAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {selectedAnswer && (
        <div>
          <p>
            {selectedAnswer === question.correctAnswer
              ? "Правильно"
              : "Неправильно"}
          </p>

          {selectedAnswer !== question.correctAnswer && (
            <p>
              Правильна відповідь: <strong>{question.correctAnswer}</strong>
            </p>
          )}

          {!isUltimateMode && (
            <button type="button" onClick={onNext}>
              Далі
            </button>
          )}
        </div>
      )}
    </main>
  );
}
