import Link from 'next/link';

export default function LandingHero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-8">
              🚀 AI-Powered Learning Platform
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-8">
            Transform Any
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
              PDF into Quizzes
            </span>
            in Seconds
          </h1>

          <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Upload your documents and let our advanced AI create personalized, 
            interactive quizzes that help you learn faster and retain more information.
          </p>

          {/* UPDATED BUTTONS WITH AUTH OPTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/register" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              🎯 Create Free Account
            </Link>
            <Link 
              href="/quiz" 
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
            >
              🚀 Try Without Signup
            </Link>
          </div>

          {/* Added Sign In Link */}
          <div className="mb-16">
            <p className="text-gray-600">
              Already have an account? <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium underline">Sign in here</Link>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600">Quizzes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">10K+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">95%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">4.9/5</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
