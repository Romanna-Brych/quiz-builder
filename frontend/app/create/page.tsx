"use client";

import { FieldArray, Form, Formik, getIn } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { createQuiz } from "@/lib/api";
import styles from "./create.module.css";
import Link from "next/link";

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
    <main className={styles.page}>
      <Link href="/quizzes" className={styles.backLink}>
        ← Back
      </Link>
      <section className={styles.header}>
        <p className={styles.badge}>Quiz builder</p>
        <h1 className={styles.title}>Create a new quiz</h1>
        <p className={styles.description}>
          Add different question types, mark correct answers and save your quiz.
        </p>
      </section>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          setFieldValue,
          isSubmitting,
        }) => (
          <Form className={styles.form}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="title">
                Quiz title
              </label>
              <input
                id="title"
                name="title"
                className={styles.input}
                placeholder="e.g. JavaScript basics"
                value={values.title}
                onChange={handleChange}
              />
              {getIn(touched, "title") && getIn(errors, "title") && (
                <p className={styles.error}>{getIn(errors, "title")}</p>
              )}
            </div>

            <FieldArray name="questions">
              {({ push, remove }) => (
                <div className={styles.questions}>
                  <div className={styles.sectionTop}>
                    <h2 className={styles.sectionTitle}>Questions</h2>
                    <button
                      className={styles.secondaryButton}
                      type="button"
                      onClick={() => push({ ...initialQuestion })}
                    >
                      Add question
                    </button>
                  </div>

                  {values.questions.map((question, questionIndex) => (
                    <article className={styles.card} key={questionIndex}>
                      <div className={styles.cardTop}>
                        <h3 className={styles.cardTitle}>
                          Question {questionIndex + 1}
                        </h3>

                        {values.questions.length > 1 && (
                          <button
                            className={styles.dangerButton}
                            type="button"
                            onClick={() => remove(questionIndex)}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Question text</label>
                        <input
                          className={styles.input}
                          name={`questions.${questionIndex}.text`}
                          placeholder="Enter question"
                          value={question.text}
                          onChange={handleChange}
                        />
                        {getIn(touched, `questions.${questionIndex}.text`) &&
                          getIn(errors, `questions.${questionIndex}.text`) && (
                            <p className={styles.error}>
                              {getIn(errors, `questions.${questionIndex}.text`)}
                            </p>
                          )}
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Question type</label>
                        <select
                          className={styles.input}
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
                          <option value="input">Short text answer</option>
                          <option value="boolean">True / False</option>
                          <option value="checkbox">Multiple choice</option>
                        </select>
                      </div>

                      {question.type === "input" && (
                        <div className={styles.fieldGroup}>
                          <label className={styles.label}>Correct answer</label>
                          <input
                            className={styles.input}
                            name={`questions.${questionIndex}.answerText`}
                            placeholder="Enter correct answer"
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
                              <p className={styles.error}>
                                {getIn(
                                  errors,
                                  `questions.${questionIndex}.answerText`,
                                )}
                              </p>
                            )}
                        </div>
                      )}

                      {question.type === "boolean" && (
                        <div className={styles.radioGroup}>
                          <label className={styles.optionLabel}>
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

                          <label className={styles.optionLabel}>
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
                            <div className={styles.options}>
                              <div className={styles.sectionTop}>
                                <h4 className={styles.smallTitle}>Options</h4>
                                <button
                                  className={styles.secondaryButton}
                                  type="button"
                                  onClick={() =>
                                    pushOption({ text: "", isCorrect: false })
                                  }
                                >
                                  Add option
                                </button>
                              </div>

                              {question.options.map((option, optionIndex) => (
                                <div
                                  className={styles.optionRow}
                                  key={optionIndex}
                                >
                                  <input
                                    className={styles.input}
                                    name={`questions.${questionIndex}.options.${optionIndex}.text`}
                                    placeholder={`Option ${optionIndex + 1}`}
                                    value={option.text}
                                    onChange={handleChange}
                                  />

                                  <label className={styles.checkboxLabel}>
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
                                      className={styles.dangerButton}
                                      type="button"
                                      onClick={() => removeOption(optionIndex)}
                                    >
                                      Remove
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
                                      <p className={styles.error}>
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
                                <p className={styles.error}>
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
                    </article>
                  ))}
                </div>
              )}
            </FieldArray>

            <button
              className={styles.primaryButton}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create quiz"}
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
}
