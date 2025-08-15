export default function LandingStats() {
    return (
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-4xl lg:text-5xl font-black mb-8">
              Trusted by Students & Professionals Worldwide
            </h2>
            <p className="text-xl opacity-90 mb-16 max-w-3xl mx-auto">
              Join thousands of learners who have transformed their study experience with AI-powered quizzes.
            </p>
  
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-black mb-2 animate-pulse">
                  50K+
                </div>
                <div className="text-xl opacity-90">Quizzes Generated</div>
                <div className="text-sm opacity-75 mt-1">This month</div>
              </div>
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-black mb-2 animate-pulse animation-delay-1000">
                  10M+
                </div>
                <div className="text-xl opacity-90">Questions Answered</div>
                <div className="text-sm opacity-75 mt-1">Learning made fun</div>
              </div>
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-black mb-2 animate-pulse animation-delay-2000">
                  98%
                </div>
                <div className="text-xl opacity-90">Success Rate</div>
                <div className="text-sm opacity-75 mt-1">User satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-black mb-2 animate-pulse animation-delay-3000">
                  150+
                </div>
                <div className="text-xl opacity-90">Universities</div>
                <div className="text-sm opacity-75 mt-1">Trust Quizzerly</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  