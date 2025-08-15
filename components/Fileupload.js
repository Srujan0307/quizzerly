'use client';
import { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [contentAnalysis, setContentAnalysis] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [completionLoading, setCompletionLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a PDF file');
      setFile(null);
    }
  };

  const generateQuiz = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('questionCount', questionCount.toString());

      // If the file is larger than ~4.5MB, extract text client-side to avoid request size limits
      if (file.size > 4.5 * 1024 * 1024) {
        // Configure pdf.js worker from CDN to avoid bundler worker setup
        const pdfjsLib = await import('pdfjs-dist/build/pdf');
        const version = pdfjsLib.version || 'latest';
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extracted = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((it) => ('str' in it ? it.str : ''));
          extracted += strings.join(' ') + '\n\n';
        }
        formData.append('text', extracted);
      } else {
        formData.append('file', file);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      let data;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text.slice(0, 200));
      }

      if (response.ok) {
        setQuiz(data.quiz);
        setContentAnalysis(data.contentAnalysis);
        setUserAnswers(new Array(data.quiz.questions.length).fill(null));
        setCurrentQuestion(0);
        setShowResults(false);
      } else {
        setError(data.error || 'Failed to generate quiz');
      }
    } catch (err) {
      setError('Error uploading file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleAnswerSelect = (idx) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = idx;
    setUserAnswers(newAnswers);
  };

  const finishQuiz = async () => {
    setCompletionLoading(true);
    try {
      const response = await fetch('/api/quiz-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: `${contentAnalysis.contentType} Quiz`,
          questions: quiz.questions,
          userAnswers,
          duration: `${contentAnalysis.readingTime} min`,
        }),
      });
      if (response.ok) {
        setShowResults(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save quiz');
        setShowResults(true);
      }
    } catch {
      setError('Error saving quiz results');
      setShowResults(true);
    } finally {
      setCompletionLoading(false);
    }
  };

  const calculateScore = () => {
    if (!quiz) return { correct: 0, total: 0 };
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (userAnswers[i] === q.correct) correct++;
    });
    return { correct, total: quiz.questions.length };
  };

  const resetQuiz = () => {
    setFile(null);
    setQuiz(null);
    setUserAnswers([]);
    setCurrentQuestion(0);
    setShowResults(false);
    setError('');
    setContentAnalysis(null);
  };

  // Results view with logo, analysis, print button, footer
  if (showResults) {
    const { correct, total } = calculateScore();
    const percentage = total ? Math.round((correct / total) * 100) : 0;
    const rank =
      percentage >= 80
        ? 'Top Performer'
        : percentage >= 60
        ? 'Well Prepared'
        : 'Keep Practicing';
    return (
      <div className="z-10 flex flex-col items-center w-full">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center mt-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/quizzerly-logo.png" alt="Quizzerly Logo" className="h-14" />
          </div>
          {/* Score Summary */}
          <h2 className="text-5xl font-extrabold text-gray-900 mb-3">Well done!</h2>
          <div className="text-xl font-semibold text-purple-600 mb-8">Here are your results:</div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl py-8 px-4 mb-8">
            <div className="text-2xl font-bold text-white mb-2">Your Score</div>
            <div className="text-6xl font-extrabold text-white mb-2">{correct}/{total}</div>
            <div className="text-3xl font-semibold text-white mb-4">{percentage}%</div>
          </div>
          {/* Analysis */}
          <div className="mb-8">
            <div className="text-lg text-gray-800 font-semibold mb-1">Quiz Analysis</div>
            <div className="bg-purple-50 rounded-xl py-3 px-4 font-medium text-gray-700 shadow">
              <p>You ranked as <span className="font-bold text-purple-600">{rank}</span>!</p>
              <p>
                {percentage >= 80
                  ? "Excellent work! You're ready for your exams."
                  : percentage >= 60
                  ? "Solid progress! Review the incorrect answers to improve even more."
                  : "Don't worry, keep practicing with Quizzerly to boost your score."}
              </p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg mb-6 hover:scale-105"
          >
            🖨️ Print Result
          </button>
          <button
            onClick={resetQuiz}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all"
          >
            🚀 Try Another Quiz
          </button>
        </div>
        <footer className="mt-6 text-gray-600 text-sm font-semibold opacity-70">
          © {new Date().getFullYear()} All rights reserved — Srujan Jadhav
        </footer>
      </div>
    );
  }

  // Quiz question page: bold and visible, with logo
  if (quiz) {
    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
    const isLast = currentQuestion === quiz.questions.length - 1;
    return (
      <div className="z-10 flex flex-col items-center w-full">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 mb-10 mt-4">
          <div className="flex flex-col items-center mb-8">
            <img src="/quizzerly-logo.png" alt="Quizzerly Logo" className="h-14 mb-4" />
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Quizzerly Quiz Generator</h1>
          </div>
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mt-2">
              <span>Progress: {Math.round(progress)}%</span>
              <span>{quiz.questions.length - currentQuestion - 1} left</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 mb-4 font-bold">
              Question {currentQuestion + 1}
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{question.question}</h2>
            <div className="space-y-4">
              {question.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  className={`w-full text-left p-6 rounded-2xl border-2 font-bold text-gray-900 transition-all 
                    ${
                      userAnswers[currentQuestion] === idx
                        ? 'border-purple-500 bg-purple-100'
                        : 'border-gray-300 hover:border-purple-400 hover:bg-gray-100'
                    }`}
                >
                  <div className="flex items-center text-lg">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 ${
                      userAnswers[currentQuestion] === idx
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-300 text-gray-800'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="text-gray-700 disabled:opacity-50 font-semibold"
            >
              ← Previous
            </button>
            {isLast ? (
              <button
                onClick={finishQuiz}
                disabled={userAnswers[currentQuestion] == null || completionLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-2xl font-bold shadow-xl disabled:opacity-50"
              >
                {completionLoading ? 'Saving...' : '🏁 Finish Quiz'}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={userAnswers[currentQuestion] == null}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-2xl font-bold shadow-xl disabled:opacity-50"
              >
                Next →
              </button>
            )}
          </div>
        </div>
        <footer className="mt-6 text-gray-600 text-sm font-semibold opacity-70">
          © {new Date().getFullYear()} All rights reserved — Srujan Jadhav
        </footer>
      </div>
    );
  }

  // Upload view (with logo)
  return (
    <div className="relative z-10 flex flex-col items-center w-full mt-8">
      {/* Header with logo */}
      <div className="flex flex-col items-center mb-8">
        <img src="/quizzerly-logo.png" alt="Quizzerly Logo" className="h-16 mb-4 animate-bounce" />
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2 text-center">
          Quizzerly Quiz Generator
        </h1>
        <div className="text-lg font-semibold text-purple-600 tracking-wide mb-3 animate-pulse">
          Get exam ready only with Quizzerly!
        </div>
      </div>
      <div className="max-w-xl mx-auto w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 mb-12 border border-purple-200">
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center mb-8 transition-all ${
            file
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }`}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            {file ? (
              <>
                <div className="text-6xl mb-2">✅</div>
                <p className="text-lg font-extrabold text-purple-700">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • PDF
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-2">📄</div>
                <p className="text-lg font-bold text-gray-800">Choose File or Drag Here</p>
                <p className="text-sm text-gray-500 font-semibold">
                  Upload a PDF to generate your quiz
                </p>
              </>
            )}
          </label>
        </div>
        <div className="mb-8">
          <label className="flex items-center text-lg font-extrabold mb-4">
            <span className="text-2xl mr-2">📊</span>
            <span className="text-gray-800 font-extrabold">Number of Questions:</span>
            <span className="ml-2 text-purple-600">{questionCount}</span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={questionCount}
            onChange={e => setQuestionCount(+e.target.value)}
            className="w-full h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg cursor-pointer appearance-none"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #ec4899 100%)`,
            }}
          />
        </div>
        <button
          onClick={generateQuiz}
          disabled={!file || loading}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg ${
            !file || loading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Quiz'}
        </button>
        {error && <div className="mt-4 text-red-600 font-bold">{error}</div>}
      </div>
    </div>
  );
}
