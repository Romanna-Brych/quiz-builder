"use client";

import { useState, useEffect } from "react";
import type { Question, Topic } from "@/types/question";
import { questions, topicLabels } from "@/data/questions";
import TrainerSettings from "../../components/TrainerSettings/TrainerSettings";
import TrainerResults from "../../components/TrainerResults/TrainerResults";
import QuestionCard from "@/components/QuestionCard/QuestionCard";

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
  const [selectedTopic, setSelectedTopic] = useState<Topic>("elementary-math");
  const [isUltimateMode, setIsUltimateMode] = useState(false);

  const currentQuestion = trainingQuestions[currentQuestionIndex];

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
    const questionsByTopic = questions.filter(
      (question) => question.topic === selectedTopic,
    );

    const shuffledQuestions = shuffleArray(questionsByTopic)
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

    if (isUltimateMode) {
      setTimeout(() => {
        setSelectedAnswer(null);
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 1500);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setSelectedAnswer(null);
    setTotalSeconds(0);
    setTrainingQuestions([]);
    setIsStarted(false);
  };

  const availableQuestionsCount = questions.filter(
    (question) => question.topic === selectedTopic,
  ).length;

  if (!isStarted) {
    return (
      <TrainerSettings
        selectedTopic={selectedTopic}
        questionCount={questionCount}
        isUltimateMode={isUltimateMode}
        availableQuestionsCount={availableQuestionsCount}
        topicLabels={topicLabels}
        onTopicChange={setSelectedTopic}
        onQuestionCountChange={setQuestionCount}
        onUltimateModeChange={setIsUltimateMode}
        onStart={handleStart}
      />
    );
  }

  if (currentQuestionIndex >= trainingQuestions.length) {
    return (
      <TrainerResults
        correctAnswers={correctAnswers}
        totalQuestions={trainingQuestions.length}
        totalSeconds={totalSeconds}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <QuestionCard
      question={currentQuestion}
      currentQuestionNumber={currentQuestionIndex + 1}
      totalQuestions={trainingQuestions.length}
      totalSeconds={totalSeconds}
      selectedAnswer={selectedAnswer}
      isUltimateMode={isUltimateMode}
      onAnswer={handleAnswer}
      onNext={handleNextQuestion}
    />
  );
}
