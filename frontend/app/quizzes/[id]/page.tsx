"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getQuizById, type Quiz, type QuestionType } from "@/lib/api";
import styles from "./quiz-details.module.css";

type UserAnswers = Record<number, string | boolean | number[]>;

export default function QuizDetailsPage() {
  const params = useParams();
  const id = Number(params.id);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (Number.isNaN(id)) {
          setError("Invalid quiz id.");
          return;
        }

        const data = await getQuizById(id);
        setQuiz(data);
      } catch {
        setError("Failed to load quiz.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const updateAnswer = (
    questionId: number,
    value: string | boolean | number[],
  ) => {
    if (showResults) return;

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const toggleCheckboxAnswer = (questionId: number, optionId: number) => {
    if (showResults) return;

    const currentAnswer = answers[questionId];
    const selectedOptions: number[] = Array.isArray(currentAnswer)
      ? (currentAnswer as number[])
      : [];

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
        ? [...(userAnswer as number[])].sort()
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

  const questionTypeLabels: Record<QuestionType, string> = {
    input: "Write your answer",
    boolean: "True or False",
    checkbox: "Multiple choice",
  };

  if (isLoading) {
    return (
      <main className={styles.page}>
        <p className={styles.stateText}>Loading quiz...</p>
      </main>
    );
  }

  if (error || !quiz) {
    return (
      <main className={styles.page}>
        <Link href="/quizzes" className={styles.backLink}>
          ← Back to quizzes
        </Link>
        <p className={styles.errorText}>{error || "Quiz not found."}</p>
      </main>
    );
  }

  const correctAnswersCount = quiz.questions.filter(isCorrectAnswer).length;

  return (
    <main className={styles.page}>
      <Link href="/quizzes" className={styles.backLink}>
        ← Back to quizzes
      </Link>

      <section className={styles.header}>
        <p className={styles.badge}>Quiz</p>
        <h1 className={styles.title}>{quiz.title}</h1>
        <p className={styles.description}>
          Answer all questions and check your result at the end.
        </p>
      </section>

      <section className={styles.questions}>
        {quiz.questions.map((question, index) => {
          const isCorrect = isCorrectAnswer(question);
          const inputValue =
            typeof answers[question.id] === "string"
              ? (answers[question.id] as string)
              : "";

          return (
            <article className={styles.card} key={question.id}>
              <div className={styles.questionTop}>
                <span className={styles.questionNumber}>
                  Question {index + 1}
                </span>
                <span className={styles.questionType}>
                  {questionTypeLabels[question.type]}
                </span>
              </div>

              <h2 className={styles.questionText}>{question.text}</h2>

              {question.type === "input" && (
                <input
                  className={styles.input}
                  placeholder="Your answer"
                  disabled={showResults}
                  value={inputValue}
                  onChange={(event) =>
                    updateAnswer(question.id, event.target.value)
                  }
                />
              )}

              {question.type === "boolean" && (
                <div className={styles.options}>
                  <label className={styles.optionLabel}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      disabled={showResults}
                      checked={answers[question.id] === true}
                      onChange={() => updateAnswer(question.id, true)}
                    />
                    True
                  </label>

                  <label className={styles.optionLabel}>
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
                <div className={styles.options}>
                  {question.options.map((option) => {
                    const selectedOptions: number[] = Array.isArray(
                      answers[question.id],
                    )
                      ? (answers[question.id] as number[])
                      : [];

                    return (
                      <label className={styles.optionLabel} key={option.id}>
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
                <div
                  className={
                    isCorrect ? styles.correctResult : styles.incorrectResult
                  }
                >
                  <p className={styles.resultText}>
                    {isCorrect ? "Correct" : "Incorrect"}
                  </p>

                  {!isCorrect && (
                    <p className={styles.correctAnswer}>
                      Correct answer:{" "}
                      <strong>{getCorrectAnswer(question)}</strong>
                    </p>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section className={styles.footer}>
        {!showResults ? (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => setShowResults(true)}
          >
            Check answers
          </button>
        ) : (
          <div className={styles.scoreCard}>
            <p className={styles.scoreLabel}>Your result</p>
            <p className={styles.scoreValue}>
              {correctAnswersCount} / {quiz.questions.length}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
