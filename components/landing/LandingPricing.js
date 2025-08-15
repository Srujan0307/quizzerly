import Link from 'next/link';

export default function LandingPricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 quizzes per month",
        "Up to 10 questions per quiz",
        "Basic PDF processing",
        "Standard AI questions",
        "Email support"
      ],
      cta: "Start Free",
      popular: false,
      gradient: "from-gray-500 to-gray-600"
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "For serious learners",
      features: [
        "Unlimited quizzes",
        "Up to 50 questions per quiz",
        "Advanced PDF processing",
        "Smart AI questions",
        "Performance analytics",
        "Export options",
        "Priority support"
      ],
      cta: "Start Pro Trial",
      popular: true,
      gradient: "from-blue-600 to-purple-600"
    },
    {
      name: "Team",
      price: "$29",
      period: "per month",
      description: "For educators & teams",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "Collaborative quizzes",
        "Advanced analytics",
        "Custom branding",
        "API access",
        "Dedicated support",
        "LMS integration"
      ],
      cta: "Start Team Trial",
      popular: false,
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
            Simple,
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your learning needs. All plans include our core AI-powered quiz generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-white rounded-2xl shadow-xl ${plan.popular ? 'ring-4 ring-blue-500 transform scale-105' : ''} transition-all duration-300 hover:shadow-2xl`}>
              {plan.popular && (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-t-2xl font-bold">
                  🔥 Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="text-green-500 mr-3">✅</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/register" 
                  className={`w-full block text-center py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            🎓 <strong>Student Discount:</strong> Get 50% off Pro plan with valid student email
          </p>
          <p className="text-gray-600">
            💼 <strong>Enterprise:</strong> Need a custom solution? <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
