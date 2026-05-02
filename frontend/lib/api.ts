import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
});

// TYPES
export type QuizListItem = {
  id: number;
  title: string;
  questionsCount: number;
};

export type QuizOption = {
  text: string;
  isCorrect: boolean;
};

export type QuizQuestion = {
  text: string;
  type: "boolean" | "input" | "checkbox";
  answerText?: string;
  answerBoolean?: boolean;
  options?: QuizOption[];
};

export type Quiz = {
  id: number;
  title: string;
  questions: {
    id: number;
    text: string;
    type: string;
    answerText: string | null;
    answerBoolean: boolean | null;
    options: {
      id: number;
      text: string;
      isCorrect: boolean;
    }[];
  }[];
};

// API FUNCTIONS

export const getQuizzes = async () => {
  const res = await api.get<QuizListItem[]>("/quizzes");
  return res.data;
};

export const getQuizById = async (id: number) => {
  const res = await api.get<Quiz>(`/quizzes/${id}`);
  return res.data;
};

export const createQuiz = async (data: {
  title: string;
  questions: QuizQuestion[];
}) => {
  const res = await api.post<Quiz>("/quizzes", data);
  return res.data;
};

export const deleteQuiz = async (id: number) => {
  await api.delete(`/quizzes/${id}`);
};
