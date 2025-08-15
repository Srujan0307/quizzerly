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
      formData.append('file', file);
      formData.append('questionCount', questionCount.toString());

      console.log('📤 Uploading file:', file.name, 'Questions:', questionCount);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Quiz generated successfully:', data);
        setQuiz(data.quiz);
        setContentAnalysis(data.contentAnalysis);
        setUserAnswers(new Array(data.quiz.questions.length).fill(null));
        setCurrentQuestion(0);
        setShowResults(false);
      } else {
        console.error('❌ Quiz generation failed:', data.error);
        setError(data.error || 'Failed to generate quiz');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      setError('Error uploading file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
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

  const finishQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!quiz || !userAnswers) return { correct: 0, total: 0 };
    
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct) {
        correct++;
      }
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

  // FANCY RESULTS VIEW
  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score.correct / score.total) * 100);
    
    // Determine performance level and colors
    let performanceLevel = '';
    let performanceColor = '';
    let performanceEmoji = '';
    let gradientFrom = '';
    let gradientTo = '';
    
    if (percentage >= 90) {
      performanceLevel = 'Outstanding!';
      performanceColor = 'text-emerald-600';
      performanceEmoji = '🏆';
      gradientFrom = 'from-emerald-400';
      gradientTo = 'to-cyan-500';
    } else if (percentage >= 80) {
      performanceLevel = 'Excellent!';
      performanceColor = 'text-green-600';
      performanceEmoji = '🌟';
      gradientFrom = 'from-green-400';
      gradientTo = 'to-blue-500';
    } else if (percentage >= 70) {
      performanceLevel = 'Great Job!';
      performanceColor = 'text-blue-600';
      performanceEmoji = '👏';
      gradientFrom = 'from-blue-400';
      gradientTo = 'to-purple-500';
    } else if (percentage >= 60) {
      performanceLevel = 'Good Work!';
      performanceColor = 'text-yellow-600';
      performanceEmoji = '👍';
      gradientFrom = 'from-yellow-400';
      gradientTo = 'to-orange-500';
    } else {
      performanceLevel = 'Keep Learning!';
      performanceColor = 'text-orange-600';
      performanceEmoji = '📚';
      gradientFrom = 'from-orange-400';
      gradientTo = 'to-red-500';
    }
    
    return (
      <div className="max-w-6xl mx-auto p-8">
        {/* Header Section with Gradient */}
        <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-3xl p-12 mb-8 text-white shadow-2xl`}>
          <div className="text-center">
            <div className="text-8xl mb-6 animate-bounce">
              {performanceEmoji}
            </div>
            <h1 className="text-5xl font-black mb-4 tracking-tight">
              Quiz Results
            </h1>
            <div className="text-2xl font-medium opacity-90">
              {performanceLevel}
            </div>
          </div>
        </div>

        {/* Score Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8 border-t-8 border-blue-500">
          <div className="text-center mb-12">
            {/* Animated Score Display */}
            <div className="relative">
              <div className="text-8xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-pulse">
                {score.correct}/{score.total}
              </div>
              <div className={`text-4xl font-bold ${performanceColor} mb-6`}>
                {percentage}% Correct
              </div>
              
              {/* Progress Circle */}
              <div className="relative w-48 h-48 mx-auto mb-8">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-700">
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Message */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                🎯 Performance Analysis
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {percentage >= 90 
                  ? "Exceptional work! You've mastered this material with outstanding comprehension."
                  : percentage >= 80 
                  ? "Excellent performance! You have a strong grasp of the key concepts."
                  : percentage >= 70 
                  ? "Great job! You understand most of the material with room for minor improvements."
                  : percentage >= 60 
                  ? "Good effort! You've got the basics down, consider reviewing some concepts."
                  : "Keep studying! This is a great learning opportunity to strengthen your understanding."
                }
              </p>
            </div>

            {/* Document Analysis */}
            {contentAnalysis && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center justify-center">
                  <span className="text-3xl mr-3">📊</span>
                  Document Insights
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center bg-white rounded-xl p-4 shadow-md">
                    <div className="text-3xl mb-2">📝</div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Content Type</div>
                    <div className="font-bold text-indigo-600">{contentAnalysis.contentType}</div>
                  </div>
                  <div className="text-center bg-white rounded-xl p-4 shadow-md">
                    <div className="text-3xl mb-2">📖</div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Word Count</div>
                    <div className="font-bold text-blue-600">{contentAnalysis.wordCount.toLocaleString()}</div>
                  </div>
                  <div className="text-center bg-white rounded-xl p-4 shadow-md">
                    <div className="text-3xl mb-2">⏱️</div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Reading Time</div>
                    <div className="font-bold text-purple-600">{contentAnalysis.readingTime} min</div>
                  </div>
                  <div className="text-center bg-white rounded-xl p-4 shadow-md">
                    <div className="text-3xl mb-2">📄</div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Paragraphs</div>
                    <div className="font-bold text-green-600">{contentAnalysis.paragraphs}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
          
        {/* Detailed Review Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-center mb-8">
            <span className="text-4xl mr-4">🔍</span>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Question by Question Review
            </h3>
          </div>
          
          <div className="space-y-8">
            {quiz.questions.map((question, index) => {
              const isCorrect = userAnswers[index] === question.correct;
              return (
                <div key={index} className={`border-l-8 rounded-xl p-6 shadow-lg transition-all hover:shadow-xl ${
                  isCorrect 
                    ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50' 
                    : 'border-red-500 bg-gradient-to-r from-red-50 to-pink-50'
                }`}>
                  <div className="flex items-start mb-4">
                    <span className="text-3xl mr-4">
                      {isCorrect ? '✅' : '❌'}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-4">
                        Question {index + 1}: {question.question}
                      </h4>
                      
                      <div className="grid gap-3">
                        {question.options.map((option, optionIndex) => {
                          const isCorrectAnswer = optionIndex === question.correct;
                          const isUserAnswer = userAnswers[index] === optionIndex;
                          
                          let className = 'p-4 rounded-lg border-2 text-sm font-medium transition-all ';
                          if (isCorrectAnswer) {
                            className += 'bg-green-100 border-green-400 text-green-800 shadow-md';
                          } else if (isUserAnswer && !isCorrectAnswer) {
                            className += 'bg-red-100 border-red-400 text-red-800 shadow-md';
                          } else {
                            className += 'bg-gray-50 border-gray-200 text-gray-700';
                          }
                          
                          return (
                            <div key={optionIndex} className={className}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="font-bold text-lg mr-3 bg-white px-2 py-1 rounded">
                                    {String.fromCharCode(65 + optionIndex)}
                                  </span>
                                  <span>{option}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {isCorrectAnswer && (
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                      ✓ CORRECT
                                    </span>
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                      ✗ YOUR CHOICE
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-4 text-center">
                        <span className={`inline-flex items-center px-6 py-2 rounded-full text-lg font-bold ${
                          isCorrect 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {isCorrect ? '🎉 Correct!' : '📚 Review Needed'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center bg-white rounded-3xl shadow-2xl p-8">
          <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 sm:justify-center">
            <button 
              onClick={resetQuiz}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-12 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              🚀 Try Another Quiz
            </button>
            
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 px-12 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              🖨️ Print Results
            </button>
          </div>
          
          <div className="mt-8 text-gray-600">
            <p className="text-lg">
              🎓 <strong>Keep Learning!</strong> Every question is a step toward mastery.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Quiz taking view
  if (quiz) {
    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-800">Quiz</h2>
            <span className="text-sm text-gray-600">
              {currentQuestion + 1} of {quiz.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {question.question}
          </h3>
        </div>
        
        {/* Options */}
        <div className="space-y-4 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                userAnswers[currentQuestion] === index
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <span className="font-bold text-lg mr-4 text-blue-600">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-gray-800">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            ← Previous
          </button>
          
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>
          
          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={finishQuiz}
              disabled={userAnswers[currentQuestion] === null}
              className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors font-semibold"
            >
              Finish Quiz 🏁
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={userAnswers[currentQuestion] === null}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    );
  }

  // Upload view
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          📚 Quizzerly
        </h1>
        <p className="text-xl text-gray-600">
          Transform any PDF into an interactive AI-powered quiz!
        </p>
      </div>

      {/* Upload section */}
      <div className="space-y-6">
        <div>
          <label htmlFor="pdf-upload" className="block text-lg font-semibold text-gray-700 mb-3">
            📄 Choose Your PDF Document
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:outline-none transition-colors"
          />
          <p className="text-sm text-gray-500 mt-2">
            Upload any PDF document (max 10MB) to generate quiz questions
          </p>
        </div>

        {/* Question count input */}
        <div>
          <label htmlFor="question-count" className="block text-lg font-semibold text-gray-700 mb-3">
            🎯 Number of Questions
          </label>
          <div className="flex items-center space-x-4">
            <input
              id="question-count"
              type="number"
              min="1"
              max="20"
              value={questionCount}
              onChange={(e) => setQuestionCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 5)))}
              className="w-24 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-center font-semibold"
            />
            <div className="flex-1">
              <input
                type="range"
                min="1"
                max="20"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <span className="text-sm text-gray-600 font-medium">Max: 20</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Choose between 1-20 questions for your quiz
          </p>
        </div>

        {/* File info */}
        {file && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📄</span>
              <div>
                <p className="font-semibold text-blue-800">{file.name}</p>
                <p className="text-sm text-blue-600">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document • {questionCount} Questions
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-3">⚠️</span>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={generateQuiz}
          disabled={!file || loading}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
            !file || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Generating {questionCount} Questions...
            </div>
          ) : (
            `🤖 Generate ${questionCount} AI Questions`
          )}
        </button>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-center">
          <div className="p-4">
            <span className="text-2xl">🤖</span>
            <h3 className="font-semibold text-gray-800">AI-Powered</h3>
            <p className="text-sm text-gray-600">Uses Google Gemini to create relevant questions</p>
          </div>
          <div className="p-4">
            <span className="text-2xl">📊</span>
            <h3 className="font-semibold text-gray-800">Customizable</h3>
            <p className="text-sm text-gray-600">Choose 1-20 questions based on your needs</p>
          </div>
          <div className="p-4">
            <span className="text-2xl">⚡</span>
            <h3 className="font-semibold text-gray-800">Content-Focused</h3>
            <p className="text-sm text-gray-600">Questions directly from your document content</p>
          </div>
        </div>
      </div>
    </div>
  );
}
