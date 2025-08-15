import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              📚 Quizzerly
            </div>
            <p className="text-gray-300 mb-6">
              Transform any document into interactive quizzes with the power of AI. Learn smarter, not harder.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="text-2xl">📧</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="text-2xl">🐦</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="text-2xl">💼</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="text-2xl">📱</span>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-bold mb-6">Product</h3>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/demo" className="text-gray-300 hover:text-white transition-colors">Demo</Link></li>
              <li><Link href="/api" className="text-gray-300 hover:text-white transition-colors">API</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-6">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/docs" className="text-gray-300 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 Quizzerly. All rights reserved. Made with ❤️ for learners worldwide.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Powered by</span>
            <span className="text-blue-400 font-semibold">Google Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
