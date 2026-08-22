"use client";

import { useState } from "react";

type Question = {
  id: number;
  topic: string;
  text: string;
  options: string[];
  correctAnswer: string;
};

const questions: Question[] = [
  {
    id: 1,
    topic: "elementary-math",
    text: "15 + 27 = ?",
    options: ["40", "41", "42", "43"],
    correctAnswer: "42",
  },
  {
    id: 2,
    topic: "elementary-math",
    text: "8 × 7 = ?",
    options: ["54", "56", "58", "64"],
    correctAnswer: "56",
  },
  {
    id: 3,
    topic: "elementary-math",
    text: "100 - 37 = ?",
    options: ["53", "63", "67", "73"],
    correctAnswer: "63",
  },
];

export default function TrainerPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);

    if (answer === currentQuestion.correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  if (currentQuestionIndex >= questions.length) {
    return (
      <main>
        <h1>Тренування завершено</h1>

        <p>
          Правильних відповідей: {correctAnswers} / {questions.length}
        </p>
      </main>
    );
  }

  return (
    <main>
      <p>
        Завдання {currentQuestionIndex + 1} з {questions.length}
      </p>

      <h1>{currentQuestion.text}</h1>

      <div>
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={selectedAnswer !== null}
            onClick={() => handleAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {selectedAnswer && (
        <div>
          <p>
            {selectedAnswer === currentQuestion.correctAnswer
              ? "Правильно"
              : "Неправильно"}
          </p>

          {selectedAnswer !== currentQuestion.correctAnswer && (
            <p>
              Правильна відповідь:{" "}
              <strong>{currentQuestion.correctAnswer}</strong>
            </p>
          )}

          <button type="button" onClick={handleNextQuestion}>
            Далі
          </button>
        </div>
      )}
    </main>
  );
}
