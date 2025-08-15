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
    const cookieStore = await cookies();
    const headerStore = await headers();

    const formData = await request.formData();
    const file = formData.get('file');
    const inlineText = formData.get('text');
    const questionCount = parseInt(formData.get('questionCount') || '5', 10);

    let text = '';
    if (inlineText && typeof inlineText === 'string') {
      // Client-side extracted text (used for large PDFs)
      text = inlineText;
    } else {
      if (!file || file.type !== 'application/pdf') {
        return NextResponse.json({ error: 'Please upload a valid PDF file.' }, { status: 400 });
      }
      text = await extractTextFromFile(file);
    }
    const contentAnalysis = analyzeTextContent(text);

    const quizData = await generateQuizFromText(text, questionCount);

    const validation = await validateQuizContent(quizData);
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Invalid quiz generated', details: validation.issues }, { status: 500 });
    }

    // IMPORTANT: Always return JSON response
    return NextResponse.json({ quiz: quizData, contentAnalysis }, { status: 200 });

  } catch (err) {
    console.error('Upload API error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
