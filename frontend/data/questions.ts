import { Topic, type Question } from "@/types/question";

export const questions: Question[] = [
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

  {
    id: 4,
    topic: "algebra",
    text: "Розв'яжіть рівняння: x + 5 = 12",
    options: ["5", "6", "7", "8"],
    correctAnswer: "7",
  },
  {
    id: 5,
    topic: "algebra",
    text: "Розв'яжіть рівняння: 2x = 16",
    options: ["6", "7", "8", "9"],
    correctAnswer: "8",
  },
  {
    id: 6,
    topic: "algebra",
    text: "Розв'яжіть рівняння: x - 4 = 10",
    options: ["6", "12", "14", "16"],
    correctAnswer: "14",
  },

  {
    id: 7,
    topic: "geometry",
    text: "Скільки градусів має прямий кут?",
    options: ["45°", "60°", "90°", "180°"],
    correctAnswer: "90°",
  },
  {
    id: 8,
    topic: "geometry",
    text: "Чому дорівнює площа квадрата зі стороною 5 см?",
    options: ["10 см²", "20 см²", "25 см²", "30 см²"],
    correctAnswer: "25 см²",
  },
  {
    id: 9,
    topic: "geometry",
    text: "Скільки сторін має трикутник?",
    options: ["2", "3", "4", "5"],
    correctAnswer: "3",
  },
];

export const topicLabels: Record<Topic, string> = {
  "elementary-math": "Елементарна математика",
  algebra: "Алгебра",
  geometry: "Геометрія",
};
