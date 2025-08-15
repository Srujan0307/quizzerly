export default function LandingFeatures() {
    const features = [
      {
        icon: '🤖',
        title: 'AI-Powered Generation',
        description: 'Our advanced AI analyzes your PDFs and creates relevant, challenging questions automatically.',
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        icon: '⚡',
        title: 'Lightning Fast',
        description: 'Generate comprehensive quizzes in seconds, not hours. Perfect for busy students and professionals.',
        gradient: 'from-purple-500 to-pink-500'
      },
      {
        icon: '🎯',
        title: 'Customizable',
        description: 'Choose question count, difficulty levels, and focus areas to match your learning goals.',
        gradient: 'from-green-500 to-teal-500'
      }
    ];
  
    return (
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Smart Learning</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to transform your documents into engaging, interactive learning experiences.
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  