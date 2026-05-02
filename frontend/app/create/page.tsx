"use client";

import { FieldArray, Form, Formik, getIn } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { createQuiz } from "@/lib/api";

type QuestionType = "boolean" | "input" | "checkbox";

type QuizOption = {
  text: string;
  isCorrect: boolean;
};

type Question = {
  text: string;
  type: QuestionType;
  answerText?: string;
  answerBoolean?: boolean;
  options: QuizOption[];
};

type QuizFormValues = {
  title: string;
  questions: Question[];
};

const initialQuestion: Question = {
  text: "",
  type: "input",
  answerText: "",
  answerBoolean: true,
  options: [],
};

const initialValues: QuizFormValues = {
  title: "",
  questions: [initialQuestion],
};

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Quiz title is required"),
  questions: Yup.array()
    .of(
      Yup.object({
        text: Yup.string().trim().required("Question text is required"),
        type: Yup.string()
          .oneOf(["boolean", "input", "checkbox"])
          .required("Question type is required"),
        answerText: Yup.string().when("type", {
          is: "input",
          then: (schema) => schema.trim().required("Answer is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        options: Yup.array().when("type", {
          is: "checkbox",
          then: (schema) =>
            schema
              .of(
                Yup.object({
                  text: Yup.string().trim().required("Option text is required"),
                  isCorrect: Yup.boolean().required(),
                }),
              )
              .min(2, "Add at least two options")
              .test(
                "has-correct-option",
                "Select at least one correct option",
                (options) =>
                  Boolean(options?.some((option) => option.isCorrect)),
              ),
          otherwise: (schema) => schema.notRequired(),
        }),
      }),
    )
    .min(1, "Add at least one question")
    .required(),
});

export default function CreatePage() {
  const router = useRouter();

  const handleSubmit = async (values: QuizFormValues) => {
    await createQuiz({
      title: values.title.trim(),
      questions: values.questions,
    });

    router.push("/quizzes");
  };

  return (
    <div>
      <h1>Create Quiz</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form>
            <div>
              <input
                name="title"
                placeholder="Quiz title"
                value={values.title}
                onChange={handleChange}
              />
              {getIn(touched, "title") && getIn(errors, "title") && (
                <p>{getIn(errors, "title")}</p>
              )}
            </div>

            <FieldArray name="questions">
              {({ push, remove }) => (
                <div>
                  <button
                    type="button"
                    onClick={() => push({ ...initialQuestion })}
                  >
                    Add question
                  </button>

                  {values.questions.map((question, questionIndex) => (
                    <div
                      key={questionIndex}
                      style={{
                        border: "1px solid #ddd",
                        padding: "12px",
                        margin: "12px 0",
                      }}
                    >
                      <input
                        name={`questions.${questionIndex}.text`}
                        placeholder="Question text"
                        value={question.text}
                        onChange={handleChange}
                      />

                      {getIn(touched, `questions.${questionIndex}.text`) &&
                        getIn(errors, `questions.${questionIndex}.text`) && (
                          <p>
                            {getIn(errors, `questions.${questionIndex}.text`)}
                          </p>
                        )}

                      <select
                        name={`questions.${questionIndex}.type`}
                        value={question.type}
                        onChange={(event) => {
                          const type = event.target.value as QuestionType;

                          setFieldValue(
                            `questions.${questionIndex}.type`,
                            type,
                          );
                          setFieldValue(
                            `questions.${questionIndex}.answerText`,
                            type === "input" ? "" : undefined,
                          );
                          setFieldValue(
                            `questions.${questionIndex}.answerBoolean`,
                            type === "boolean" ? true : undefined,
                          );
                          setFieldValue(
                            `questions.${questionIndex}.options`,
                            type === "checkbox"
                              ? [
                                  { text: "", isCorrect: false },
                                  { text: "", isCorrect: false },
                                ]
                              : [],
                          );
                        }}
                      >
                        <option value="input">Input</option>
                        <option value="boolean">Boolean</option>
                        <option value="checkbox">Checkbox</option>
                      </select>

                      {question.type === "input" && (
                        <div>
                          <input
                            name={`questions.${questionIndex}.answerText`}
                            placeholder="Correct answer"
                            value={question.answerText ?? ""}
                            onChange={handleChange}
                          />

                          {getIn(
                            touched,
                            `questions.${questionIndex}.answerText`,
                          ) &&
                            getIn(
                              errors,
                              `questions.${questionIndex}.answerText`,
                            ) && (
                              <p>
                                {getIn(
                                  errors,
                                  `questions.${questionIndex}.answerText`,
                                )}
                              </p>
                            )}
                        </div>
                      )}

                      {question.type === "boolean" && (
                        <div>
                          <label>
                            <input
                              type="radio"
                              checked={question.answerBoolean === true}
                              onChange={() =>
                                setFieldValue(
                                  `questions.${questionIndex}.answerBoolean`,
                                  true,
                                )
                              }
                            />
                            True
                          </label>

                          <label>
                            <input
                              type="radio"
                              checked={question.answerBoolean === false}
                              onChange={() =>
                                setFieldValue(
                                  `questions.${questionIndex}.answerBoolean`,
                                  false,
                                )
                              }
                            />
                            False
                          </label>
                        </div>
                      )}

                      {question.type === "checkbox" && (
                        <FieldArray name={`questions.${questionIndex}.options`}>
                          {({ push: pushOption, remove: removeOption }) => (
                            <div>
                              <button
                                type="button"
                                onClick={() =>
                                  pushOption({ text: "", isCorrect: false })
                                }
                              >
                                Add option
                              </button>

                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex}>
                                  <input
                                    name={`questions.${questionIndex}.options.${optionIndex}.text`}
                                    placeholder="Option text"
                                    value={option.text}
                                    onChange={handleChange}
                                  />

                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={option.isCorrect}
                                      onChange={(event) =>
                                        setFieldValue(
                                          `questions.${questionIndex}.options.${optionIndex}.isCorrect`,
                                          event.target.checked,
                                        )
                                      }
                                    />
                                    Correct
                                  </label>

                                  {question.options.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => removeOption(optionIndex)}
                                    >
                                      Remove option
                                    </button>
                                  )}

                                  {getIn(
                                    touched,
                                    `questions.${questionIndex}.options.${optionIndex}.text`,
                                  ) &&
                                    getIn(
                                      errors,
                                      `questions.${questionIndex}.options.${optionIndex}.text`,
                                    ) && (
                                      <p>
                                        {getIn(
                                          errors,
                                          `questions.${questionIndex}.options.${optionIndex}.text`,
                                        )}
                                      </p>
                                    )}
                                </div>
                              ))}

                              {typeof getIn(
                                errors,
                                `questions.${questionIndex}.options`,
                              ) === "string" && (
                                <p>
                                  {getIn(
                                    errors,
                                    `questions.${questionIndex}.options`,
                                  )}
                                </p>
                              )}
                            </div>
                          )}
                        </FieldArray>
                      )}

                      {values.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(questionIndex)}
                        >
                          Remove question
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>

            <button type="submit">Create quiz</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
