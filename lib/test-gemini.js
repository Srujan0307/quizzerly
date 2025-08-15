import { generateText } from './gemini.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testGemini() {
  try {
    console.log('🧪 Testing Gemini API...');
    console.log('API Key present:', !!process.env.GEMINI_API_KEY);
    
    const response = await generateText('Say hello in exactly 5 words');
    console.log('✅ Gemini API works!');
    console.log('Response:', response);
  } catch (error) {
    console.error('❌ Gemini API failed:', error.message);
    
    if (!process.env.GEMINI_API_KEY) {
      console.log('💡 Make sure to add GEMINI_API_KEY to your .env.local file');
      console.log('💡 Get your API key from: https://ai.google.dev/');
    }
  }
}

testGemini();
