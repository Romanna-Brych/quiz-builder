import "dotenv/config";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import { prisma } from "./prisma";

type QuestionType = "boolean" | "input" | "checkbox";

type QuizOptionInput = {
  text: string;
  isCorrect: boolean;
};

type QuizQuestionInput = {
  text: string;
  type: QuestionType;
  answerText?: string;
  answerBoolean?: boolean;
  options?: QuizOptionInput[];
};

type CreateQuizBody = {
  title: string;
  questions: QuizQuestionInput[];
};

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// CREATE
app.post("/quizzes", async (req, res) => {
  const { title, questions } = req.body as CreateQuizBody;

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return res
      .status(400)
      .json({ message: "Title and questions are required" });
  }

  const quiz = await prisma.quiz.create({
    data: {
      title,
      questions: {
        create: questions.map((q) => ({
          text: q.text,
          type: q.type,
          answerText: q.answerText ?? null,
          answerBoolean: q.answerBoolean ?? null,

          ...(q.options?.length && {
            options: {
              create: q.options.map((o) => ({
                text: o.text,
                isCorrect: o.isCorrect,
              })),
            },
          }),
        })),
      },
    },
    include: {
      questions: {
        include: { options: true },
      },
    },
  });

  res.status(201).json(quiz);
});

// GET ALL
app.get("/quizzes", async (_req, res) => {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { questions: true },
      },
    },
  });

  res.json(
    quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      questionsCount: quiz._count.questions,
    })),
  );
});

// GET ONE
app.get("/quizzes/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: { include: { options: true } },
    },
  });

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  res.json(quiz);
});

// DELETE
app.delete("/quizzes/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const result = await prisma.quiz.deleteMany({
    where: { id },
  });

  if (result.count === 0) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  res.status(204).send();
});

// 404
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ERROR
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const isProd = process.env.NODE_ENV === "production";

  res.status(500).json({
    message: isProd ? "Something went wrong" : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
