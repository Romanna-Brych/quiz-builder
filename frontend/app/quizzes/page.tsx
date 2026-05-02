"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteQuiz, getQuizzes, type QuizListItem } from "@/lib/api";
import styles from "./quizzes.module.css";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzes();
        setQuizzes(data);
      } catch {
        setError("Failed to load quizzes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteQuiz(id);
      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== id));
    } catch {
      alert("Failed to delete quiz.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div>
          <p className={styles.badge}>Dashboard</p>
          <h1 className={styles.title}>Your quizzes</h1>
          <p className={styles.description}>
            View, open and manage all created quizzes.
          </p>
        </div>

        <Link href="/create" className={styles.createLink}>
          Create quiz
        </Link>
      </section>

      {isLoading && <p className={styles.stateText}>Loading quizzes...</p>}

      {!isLoading && error && <p className={styles.errorText}>{error}</p>}

      {!isLoading && !error && quizzes.length === 0 && (
        <section className={styles.emptyState}>
          <h2>No quizzes yet</h2>
          <p>Create your first quiz to see it here.</p>
          <Link href="/create" className={styles.createLink}>
            Create quiz
          </Link>
        </section>
      )}

      {!isLoading && !error && quizzes.length > 0 && (
        <section className={styles.grid}>
          {quizzes.map((quiz) => (
            <article className={styles.card} key={quiz.id}>
              <Link href={`/quizzes/${quiz.id}`} className={styles.cardLink}>
                <h2 className={styles.cardTitle}>{quiz.title}</h2>
                <p className={styles.cardMeta}>
                  {quiz.questionsCount}{" "}
                  {quiz.questionsCount === 1 ? "question" : "questions"}
                </p>
              </Link>

              <button
                type="button"
                className={styles.deleteButton}
                disabled={deletingId === quiz.id}
                onClick={() => handleDelete(quiz.id)}
              >
                {deletingId === quiz.id ? "Deleting..." : "Delete"}
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
