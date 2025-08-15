export default function LandingTestimonials() {
    const testimonials = [
      {
        name: "Sarah Chen",
        role: "Medical Student",
        university: "Harvard Medical School",
        image: "👩‍⚕️",
        rating: 5,
        text: "Quizzerly transformed how I study! Converting my dense medical textbooks into interactive quizzes helped me ace my boards. The AI questions are incredibly relevant and challenging."
      },
      {
        name: "Marcus Rodriguez",
        role: "Software Engineer",
        company: "Google",
        image: "👨‍💻",
        rating: 5,
        text: "As someone who constantly needs to learn new technologies, Quizzerly is a game-changer. I can quickly convert documentation into quizzes and test my understanding immediately."
      },
      {
        name: "Dr. Emily Watson",
        role: "Professor",
        university: "MIT",
        image: "👩‍🏫",
        rating: 5,
        text: "I use Quizzerly to create assessments for my students. The quality of AI-generated questions rivals what I would create manually, but in a fraction of the time."
      },
      {
        name: "Alex Kumar",
        role: "MBA Student",
        university: "Stanford GSB",
        image: "👨‍🎓",
        rating: 5,
        text: "The analytics feature is incredible! I can see exactly which topics I need to focus on. My study efficiency has improved by 300% since using Quizzerly."
      },
      {
        name: "Lisa Park",
        role: "High School Teacher",
        company: "Lincoln High School",
        image: "👩‍🏫",
        rating: 5,
        text: "Creating quizzes for my students used to take hours. Now I can upload lesson materials and have engaging quizzes ready in minutes. My students love the interactive format!"
      },
      {
        name: "David Thompson",
        role: "Law Student",
        university: "Yale Law School",
        image: "⚖️",
        rating: 5,
        text: "Studying case law became so much easier with Quizzerly. The AI picks up on crucial details and creates questions that really test comprehension, not just memorization."
      }
    ];
  
    return (
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Loved by
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Learners Everywhere</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what students, professionals, and educators are saying about their Quizzerly experience.
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <p className="text-blue-600 text-sm font-medium">
                      {testimonial.university || testimonial.company}
                    </p>
                  </div>
                </div>
  
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
  
                <p className="text-gray-700 leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  