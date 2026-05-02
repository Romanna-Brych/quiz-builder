"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getQuizById, type Quiz } from "@/lib/api";

type UserAnswers = Record<number, string | boolean | number[]>;

export default function QuizDetailsPage() {
  const params = useParams();
  const id = Number(params.id);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (Number.isNaN(id)) return;

      const data = await getQuizById(id);
      setQuiz(data);
    };

    fetchQuiz();
  }, [id]);

  if (!quiz) return <p>Loading...</p>;

  const updateAnswer = (
    questionId: number,
    value: string | boolean | number[],
  ) => {
    if (showResults) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const toggleCheckboxAnswer = (questionId: number, optionId: number) => {
    if (showResults) return;

    const currentAnswers = answers[questionId];
    const selectedOptions = Array.isArray(currentAnswers) ? currentAnswers : [];

    const nextSelectedOptions = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id) => id !== optionId)
      : [...selectedOptions, optionId];

    updateAnswer(questionId, nextSelectedOptions);
  };

  const isCorrectAnswer = (question: Quiz["questions"][number]) => {
    const userAnswer = answers[question.id];

    if (question.type === "input") {
      return (
        typeof userAnswer === "string" &&
        userAnswer.trim().toLowerCase() ===
          question.answerText?.trim().toLowerCase()
      );
    }

    if (question.type === "boolean") {
      return userAnswer === question.answerBoolean;
    }

    if (question.type === "checkbox") {
      const correctOptionIds = question.options
        .filter((option) => option.isCorrect)
        .map((option) => option.id)
        .sort();

      const selectedOptionIds = Array.isArray(userAnswer)
        ? [...userAnswer].sort()
        : [];

      return (
        JSON.stringify(correctOptionIds) === JSON.stringify(selectedOptionIds)
      );
    }

    return false;
  };

  const getCorrectAnswer = (question: Quiz["questions"][number]) => {
    if (question.type === "input") {
      return question.answerText || "No correct answer provided";
    }

    if (question.type === "boolean") {
      return question.answerBoolean ? "True" : "False";
    }

    if (question.type === "checkbox") {
      const correctOptions = question.options
        .filter((option) => option.isCorrect)
        .map((option) => option.text);

      return correctOptions.length > 0
        ? correctOptions.join(", ")
        : "No correct options provided";
    }

    return "";
  };

  const correctAnswersCount = quiz.questions.filter(isCorrectAnswer).length;

  return (
    <main>
      <Link href="/quizzes">← Back to quizzes</Link>

      <h1>{quiz.title}</h1>

      {quiz.questions.map((question, index) => {
        const isCorrect = isCorrectAnswer(question);

        return (
          <section key={question.id}>
            <h2>
              {index + 1}. {question.text}
            </h2>

            {question.type === "input" && (
              <input
                placeholder="Your answer"
                disabled={showResults}
                value={
                  typeof answers[question.id] === "string"
                    ? (answers[question.id] as string)
                    : ""
                }
                onChange={(event) =>
                  updateAnswer(question.id, event.target.value)
                }
              />
            )}

            {question.type === "boolean" && (
              <div>
                <label>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    disabled={showResults}
                    checked={answers[question.id] === true}
                    onChange={() => updateAnswer(question.id, true)}
                  />
                  True
                </label>

                <label>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    disabled={showResults}
                    checked={answers[question.id] === false}
                    onChange={() => updateAnswer(question.id, false)}
                  />
                  False
                </label>
              </div>
            )}

            {question.type === "checkbox" && (
              <div>
                {question.options.map((option) => {
                  const selectedOptions: number[] = Array.isArray(
                    answers[question.id],
                  )
                    ? (answers[question.id] as number[])
                    : [];

                  return (
                    <label key={option.id} style={{ display: "block" }}>
                      <input
                        type="checkbox"
                        disabled={showResults}
                        checked={selectedOptions.includes(option.id)}
                        onChange={() =>
                          toggleCheckboxAnswer(question.id, option.id)
                        }
                      />
                      {option.text}
                    </label>
                  );
                })}
              </div>
            )}

            {showResults && (
              <div>
                <p>{isCorrect ? "Correct" : "Incorrect"}</p>

                {!isCorrect && (
                  <p>
                    Correct answer:{" "}
                    <strong>{getCorrectAnswer(question)}</strong>
                  </p>
                )}
              </div>
            )}
          </section>
        );
      })}

      {!showResults && (
        <button type="button" onClick={() => setShowResults(true)}>
          Check answers
        </button>
      )}

      {showResults && (
        <p>
          Result: {correctAnswersCount} / {quiz.questions.length}
        </p>
      )}
    </main>
  );
}
