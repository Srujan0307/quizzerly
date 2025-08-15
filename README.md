<div align="center">
  <img src="./public/quizzerly-logo.svg" alt="Quizzerly" width="520" style="margin: 0 auto; display: block;" />
</div>

<h1 align="center">Quizzerly</h1>

<p align="center">Get exam ready only with <b>Quizzerly</b>! Upload a PDF, extract content, and generate a clean multiple‑choice quiz with AI.</p>

---

## Getting Started

- <b>Sign Up/Log In</b>: Use the auth pages to create an account and access the app.
- <b>Dashboard</b>: View your activity and saved quizzes.
- <b>Quiz Generator</b>: Upload a PDF and generate an interactive quiz, or extract text client‑side for large files.

Quizzerly makes it simple to turn study material into concise, answerable questions with clear feedback.

## Features

- <b>Upload PDFs</b>: Drag and drop or select a PDF to analyze.
- <b>Client‑side text extraction</b>: For large PDFs, text is extracted in the browser with `pdfjs-dist` to avoid server limits.
- <b>AI quiz generation</b>: Uses Gemini to create exactly N multiple‑choice questions.
- <b>Results view</b>: Score, rank, and printable results page.
- <b>Supabase auth</b>: Email/password authentication with protected routes.

## Usage

1. Open Quizzerly in your browser.
2. Upload a PDF and choose the number of questions.
3. Generate the quiz and answer interactively.
4. View your results and print or try again.

## Installation

<details>
<summary>Click Me</summary>

```bash
# 1) Install
npm install

# 2) Environment variables (create .env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key

# 3) Dev
npm run dev
```

</details>

## Deployment (Vercel)

Set these env vars in Vercel Project Settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

Auth/Protected routes and the dashboard are configured as dynamic to avoid prerender env lookups.

## Tech Stack

- Next.js App Router, React
- Supabase (auth)
- pdfjs‑dist, pdf‑parse (optional)
- Gemini (text generation)
