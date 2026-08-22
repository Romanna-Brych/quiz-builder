export type Topic = "elementary-math" | "algebra" | "geometry";

export type Question = {
  id: number;
  topic: Topic;
  text: string;
  options: string[];
  correctAnswer: string;
};
