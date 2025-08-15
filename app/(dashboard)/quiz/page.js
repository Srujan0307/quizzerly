'use client';
import FileUpload from '../../../components/Fileupload';

export default function QuizPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated floating shapes */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-400 to-rose-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-25 rounded-full blur-3xl animate-ping"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-20 w-64 h-64 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-15 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-40 right-10 w-56 h-56 bg-gradient-to-r from-green-400 to-emerald-400 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <FileUpload />
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 right-8 text-gray-600 text-sm font-semibold opacity-70 z-20 backdrop-blur-sm bg-white/30 px-4 py-2 rounded-full">
        © {new Date().getFullYear()} All rights reserved — Srujan Jadhav
      </footer>
    </div>
  );
}
