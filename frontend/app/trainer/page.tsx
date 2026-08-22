"use client";

import { useState, useEffect } from "react";

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

const shuffleArray = <T,>(array: T[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function TrainerPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(3);
  const [trainingQuestions, setTrainingQuestions] = useState<Question[]>([]);

  const currentQuestion = trainingQuestions[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!isStarted || currentQuestionIndex >= trainingQuestions.length) {
      return;
    }

    const timer = setInterval(() => {
      setTotalSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, currentQuestionIndex, trainingQuestions.length]);

  const handleStart = () => {
    const shuffledQuestions = shuffleArray(questions)
      .slice(0, questionCount)
      .map((question) => ({
        ...question,
        options: shuffleArray(question.options),
      }));

    setTrainingQuestions(shuffledQuestions);
    setIsStarted(true);
  };

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

  if (!isStarted) {
    return (
      <main>
        <h1>Математичний тренажер</h1>

        <div>
          <label htmlFor="topic">Оберіть тему:</label>

          <select id="topic" disabled>
            <option>Елементарна математика</option>
          </select>
        </div>

        <div>
          <label htmlFor="questionCount">Кількість завдань:</label>

          <input
            id="questionCount"
            type="number"
            min="1"
            max={questions.length}
            value={questionCount}
            onChange={(event) => setQuestionCount(Number(event.target.value))}
          />
        </div>

        <button type="button" onClick={handleStart}>
          Почати
        </button>
      </main>
    );
  }

  if (currentQuestionIndex >= trainingQuestions.length) {
    const averageTime = totalSeconds / trainingQuestions.length;

    return (
      <main>
        <h1>Тренування завершено</h1>

        <p>
          Правильних відповідей: {correctAnswers} / {trainingQuestions.length}
        </p>

        <p>Загальний час: {formatTime(totalSeconds)}</p>
        <p>Середній час: {averageTime.toFixed(1)} с</p>
      </main>
    );
  }

  return (
    <main>
      <p>
        Завдання {currentQuestionIndex + 1} з {trainingQuestions.length}
      </p>

      <p>Час: {formatTime(totalSeconds)}</p>

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
