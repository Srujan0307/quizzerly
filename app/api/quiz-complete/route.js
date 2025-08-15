import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { title, questions, userAnswers, duration } = await request.json();

    if (!title || !Array.isArray(questions) || !Array.isArray(userAnswers)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const result = {
      saved: !!user,
      summary: {
        title,
        totalQuestions: questions.length,
        answered: userAnswers.filter((v) => v != null).length,
        duration,
      },
    };

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}


