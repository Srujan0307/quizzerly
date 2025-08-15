import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import { extractTextFromFile, analyzeTextContent } from '../../../lib/pdf-extractor';
import { generateQuizFromText, validateQuizContent } from '../../../lib/quiz-generator';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    // Await dynamic APIs
    const cookieStore = await cookies();
    const headerStore = await headers();

    const formData = await request.formData();
    const file = formData.get('file');
    const questionCount = parseInt(formData.get('questionCount') || '5', 10);

    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Please upload a valid PDF file.' }, { status: 400 });
    }

    // Extract and analyze text
    const text = await extractTextFromFile(file);
    const contentAnalysis = analyzeTextContent(text);

    // Generate and validate quiz
    const quizData = await generateQuizFromText(text, questionCount);
    const validation = await validateQuizContent(quizData);
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Invalid quiz generated.', details: validation.issues }, { status: 500 });
    }

    // Initialize Supabase server client with cookie & header handlers
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name) => cookieStore.get(name)?.value,
          set: (name, value, options) => cookieStore.set(name, value, options),
          delete: (name, options) => cookieStore.delete(name, options),
        },
        headers: {
          get: (name) => headerStore.get(name) ?? undefined,
        },
      }
    );

    // Persist quiz to database
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.id) {
      const score = quizData.questions.reduce((sum, q, idx) => {
        return sum + (q.correct === quizData.questions[idx].correct ? 1 : 0);
      }, 0);

      await supabase.from('quizzes').insert({
        user_id: user.id,
        title: `${contentAnalysis.contentType} Quiz`,
        questions: quizData.questions.length,
        score,
        duration: `${contentAnalysis.readingTime} min`,
      });
    }

    return NextResponse.json({ quiz: quizData, contentAnalysis }, { status: 200 });
  } catch (err) {
    console.error('Upload API error:', err);
    return NextResponse.json({ error: err.message ?? 'Internal Server Error' }, { status: 500 });
  }
}
