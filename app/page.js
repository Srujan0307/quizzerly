import Link from 'next/link';
import LandingHero from '../components/landing/LandingHero';
import LandingFeatures from '../components/landing/LandingFeatures';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* UPDATED Navigation with Auth Options */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                📚 Quizzerly
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </div>

            {/* Auth Options - ADDED THIS SECTION */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900">
                <span className="text-2xl">☰</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="pt-16">
        <LandingHero />
        <LandingFeatures />
        
        {/* Updated CTA Section with Auth Links */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-4xl lg:text-5xl font-black mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-12">
              Join thousands of learners using AI-powered quizzes!
            </p>
            
            {/* Multiple CTA Options */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/register" 
                className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200"
              >
                🎯 Create Free Account
              </Link>
              <Link 
                href="/quiz" 
                className="bg-white/20 backdrop-blur-sm text-white px-10 py-5 rounded-2xl font-bold text-xl border-2 border-white/30 hover:bg-white/30 transition-all duration-200"
              >
                🚀 Try Without Signup
              </Link>
            </div>
            
            <div className="mt-8 text-white/80">
              <p>Already have an account? <Link href="/login" className="underline hover:text-white">Sign in here</Link></p>
            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                📚 Quizzerly
              </div>
              <p className="text-gray-300">
                Transform any document into interactive quizzes with AI.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/quiz" className="text-gray-300 hover:text-white transition-colors">Quiz Generator</Link></li>
                <li><Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/register" className="text-gray-300 hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>

            {/* Auth */}
            <div>
              <h3 className="text-lg font-bold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-gray-300 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/register" className="text-gray-300 hover:text-white transition-colors">Create Account</Link></li>
                <li><Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300 text-sm">
              © 2024 Quizzerly. Made with ❤️ for learners worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
