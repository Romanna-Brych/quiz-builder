import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.badge}>Full-stack quiz builder</p>

        <h1 className={styles.title}>Create and manage custom quizzes</h1>

        <p className={styles.text}>
          Build quizzes with input, true/false and multiple choice questions.
          View all quizzes, open details and check answers.
        </p>

        <div className={styles.actions}>
          <Link href="/create" className={styles.primaryLink}>
            Create quiz
          </Link>

          <Link href="/quizzes" className={styles.secondaryLink}>
            View quizzes
          </Link>
        </div>
      </section>
    </main>
  );
}
