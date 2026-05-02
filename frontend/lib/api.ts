import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
});

export type QuestionType = "input" | "boolean" | "checkbox";

export type QuizListItem = {
  id: number;
  title: string;
  questionsCount: number;
};

export type QuizOption = {
  id: number;
  text: string;
  isCorrect: boolean;
};

export type CreateQuizOption = {
  text: string;
  isCorrect: boolean;
};

export type CreateQuizQuestion = {
  text: string;
  type: QuestionType;
  answerText?: string;
  answerBoolean?: boolean;
  options?: CreateQuizOption[];
};

export type QuizQuestion = {
  id: number;
  text: string;
  type: QuestionType;
  answerText: string | null;
  answerBoolean: boolean | null;
  options: QuizOption[];
};

export type Quiz = {
  id: number;
  title: string;
  questions: QuizQuestion[];
};

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
  questions: CreateQuizQuestion[];
}) => {
  const res = await api.post<Quiz>("/quizzes", data);
  return res.data;
};

export const deleteQuiz = async (id: number) => {
  await api.delete(`/quizzes/${id}`);
};
