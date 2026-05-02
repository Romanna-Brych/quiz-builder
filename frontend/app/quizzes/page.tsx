"use client";

import { useEffect, useState } from "react";
import { getQuizzes, type QuizListItem } from "@/lib/api";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getQuizzes();
      setQuizzes(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Quizzes</h1>

      {quizzes.map((q) => (
        <div key={q.id}>
          <a href={`/quizzes/${q.id}`}>
            {q.title} ({q.questionsCount})
          </a>
        </div>
      ))}
    </div>
  );
}
