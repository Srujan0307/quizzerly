import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    console.log('🤖 Available Models:');
    data.models.forEach(model => {
      console.log(`- ${model.name}`);
      console.log(`  Description: ${model.description}`);
      console.log(`  Supported: ${model.supportedGenerationMethods?.join(', ')}`);
      console.log();
    });
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();
