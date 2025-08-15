'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase/client';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizHistory, setQuizHistory] = useState([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Fetch real quiz history for this user
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setQuizHistory(data);
      }
      setLoading(false);
    }

    init();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalQuizzes = quizHistory.length;
  const totalQuestions = quizHistory.reduce((sum, q) => sum + q.questions, 0);
  const totalScore = quizHistory.reduce((sum, q) => sum + q.score, 0);
  const averageScore = totalQuizzes > 0
    ? Math.round((totalScore / totalQuestions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              📚 Quizzerly
            </Link>
            <div className="flex items-center space-x-6">
              <span className="text-gray-700 font-medium">
                Welcome, {user.user_metadata?.full_name || user.email}!
              </span>
              <button
                onClick={handleSignOut}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Dashboard</h1>
          <p className="text-xl text-gray-600">Track your learning progress and create new quizzes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">{totalQuizzes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Questions Answered</p>
                <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Quiz Button */}
        <div className="mb-8">
          <Link
            href="/quiz"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            🚀 Create New Quiz
          </Link>
        </div>

        {/* Recent Quizzes Section */}
        <section className="mt-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Your Recent Quizzes</h2>

          {quizHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-2xl border border-dashed border-gray-300">
              <div className="text-6xl mb-4 text-blue-400">📚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No quizzes yet</h3>
              <p className="text-lg text-gray-600 mb-6">
                Take your first quiz to see your results here!
              </p>
              <Link
                href="/quiz"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                🚀 Create Quiz
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {quizHistory.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex justify-between items-center p-6 bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 border-l-8 border-blue-500"
                >
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">{quiz.title}</h3>
                    <p className="mt-1 text-gray-600">
                      {quiz.questions} Questions • {quiz.duration}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(quiz.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-6 text-right">
                    <div className="text-4xl font-extrabold text-green-600">
                      {quiz.score}/{quiz.questions}
                    </div>
                    <div className="text-lg font-semibold text-gray-700">
                      {Math.round((quiz.score / quiz.questions) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
