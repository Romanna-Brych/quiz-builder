# Quiz Builder

Full-stack app to create, manage and solve quizzes.

## Features

- Create quizzes (text, true/false, multiple choice)
- Solve quizzes and check answers
- View all quizzes
- Delete quizzes
- Mobile-first UI

---

## Tech Stack

Frontend

- Next.js (App Router)
- TypeScript
- Formik + Yup
- CSS Modules

Backend

- Express
- TypeScript
- Prisma
- SQLite

---

## Project Structure

```txt
frontend/
  app/
    page.tsx              # Home page
    create/
      page.tsx            # Create quiz page
    quizzes/
      page.tsx            # Quiz list page
      [id]/
        page.tsx          # Quiz details / solving page

  lib/
    api.ts                # API layer

backend/
  src/                    # Express API
  prisma/                 # DB schema

## Pages

- / → Home
- /create → Create quiz
- /quizzes → List of quizzes
- /quizzes/[id] → Solve quiz

---

## Setup

### Backend

cd backend npm install npx prisma migrate dev npm run dev

### Frontend

cd frontend npm install npm run dev

---

## API

- GET /quizzes
- GET /quizzes/:id
- POST /quizzes
- DELETE /quizzes/:id
```
