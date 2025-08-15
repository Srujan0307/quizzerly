import { generateText } from './gemini.js';
import { analyzeTextContent, getTextPreview } from './pdf-extractor.js';

export async function generateQuizFromText(text, numberOfQuestions = 5) {
  console.log('🤖 Starting AI quiz generation for', numberOfQuestions, 'questions...');
  
  try {
    // Analyze the text content
    const analysis = analyzeTextContent(text);
    console.log('📊 Content analysis:', analysis);

    // Optimize text length for API (Gemini has token limits)
    const maxTextLength = 4000;
    let processedText = text;
    
    if (text.length > maxTextLength) {
      // Take strategic sections: beginning, middle, and end
      const segmentLength = Math.floor(maxTextLength / 3);
      const middleStart = Math.floor((text.length - segmentLength) / 2);
      
      processedText = text.substring(0, segmentLength) + 
                    '\n\n[... content continues ...]\n\n' + 
                    text.substring(middleStart, middleStart + segmentLength) +
                    '\n\n[... content continues ...]\n\n' +
                    text.substring(text.length - segmentLength);
      
      console.log('📝 Text optimized for API, length:', processedText.length);
    }

    // Clean prompt that focuses purely on content
    const prompt = `You are creating a quiz based on the following educational content. Create exactly ${numberOfQuestions} multiple-choice questions that test understanding of the material presented.

CONTENT TO ANALYZE:
"""
${processedText}
"""

REQUIREMENTS:
- Create exactly ${numberOfQuestions} questions that directly test understanding of the content above
- Focus on key concepts, facts, and principles actually mentioned in the content
- Each question should have exactly 4 answer options
- Make questions clear and specific to the material provided
- Include a mix of factual recall and conceptual understanding questions
- Do NOT reference the document itself, filenames, or meta-information
- Questions should be answerable by someone who read and understood the content
- Only one answer should be correct for each question

Return ONLY valid JSON in this exact format (no additional text):
{
  "questions": [
    {
      "question": "What is [specific concept from the content]?",
      "options": ["Correct answer from content", "Plausible wrong answer", "Another wrong answer", "Third wrong answer"],
      "correct": 0
    }
  ]
}`;

    console.log('🤖 Sending request to Gemini AI...');
    const response = await generateText(prompt);
    
    console.log('✅ Received AI response, length:', response.length);
    
    // Clean the response to extract JSON
    let jsonStr = response.trim();
    
    // Remove markdown formatting if present
    jsonStr = jsonStr.replace(/``````\n?/g, '');
    
    // Find and extract the JSON object
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    
    // Parse the JSON
    const quizData = JSON.parse(jsonStr);
    
    // Validate the quiz structure
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error('Invalid quiz format: missing questions array');
    }

    if (quizData.questions.length === 0) {
      throw new Error('No questions generated');
    }

    // Validate each question
    quizData.questions.forEach((q, index) => {
      if (!q.question || !q.options || q.correct === undefined) {
        throw new Error(`Invalid question format at index ${index}`);
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question ${index + 1} must have exactly 4 options`);
      }
      if (q.correct < 0 || q.correct > 3) {
        throw new Error(`Question ${index + 1} correct answer must be 0-3`);
      }
    });

    console.log(`✅ Generated ${quizData.questions.length} valid questions via AI`);
    
    // Add metadata
    return {
      ...quizData,
      metadata: {
        contentType: analysis.contentType,
        wordCount: analysis.wordCount,
        generatedAt: new Date().toISOString(),
        generationMethod: 'AI',
        questionCount: quizData.questions.length
      }
    };
    
  } catch (error) {
    console.error('❌ AI quiz generation failed:', error.message);
    
    // Enhanced fallback based on content analysis
    console.log('🔄 Using enhanced fallback quiz generation...');
    
    const analysis = analyzeTextContent(text);
    
    // Create content-focused fallback questions
    const fallbackQuestions = [
      {
        question: `What type of content does this ${analysis.contentType.toLowerCase()} material primarily focus on?`,
        options: [
          `${analysis.contentType} concepts and principles`,
          'Personal opinions and stories',
          'Entertainment content',
          'Advertising material'
        ],
        correct: 0
      },
      {
        question: 'Based on the content structure, what learning approach does this material use?',
        options: [
          'Systematic presentation of concepts with examples',
          'Random collection of facts',
          'Pure memorization drills',
          'Creative writing exercises'
        ],
        correct: 0
      },
      {
        question: 'What is the primary educational value of this content?',
        options: [
          'Building foundational knowledge and understanding',
          'Entertainment purposes only',
          'Providing personal opinions',
          'Marketing products or services'
        ],
        correct: 0
      },
      {
        question: 'How is the information in this content typically organized?',
        options: [
          'Logically structured with clear explanations',
          'Randomly arranged without order',
          'Purely chronological events',
          'Personal diary entries'
        ],
        correct: 0
      },
      {
        question: 'What type of assessment would best evaluate understanding of this material?',
        options: [
          'Questions testing both facts and concepts',
          'Pure memorization tests',
          'Creative writing assignments',
          'Personal opinion surveys'
        ],
        correct: 0
      }
    ];
    
    return {
      questions: fallbackQuestions.slice(0, numberOfQuestions),
      metadata: {
        contentType: analysis.contentType,
        wordCount: analysis.wordCount,
        generatedAt: new Date().toISOString(),
        generationMethod: 'Fallback',
        questionCount: Math.min(numberOfQuestions, fallbackQuestions.length)
      }
    };
  }
}

export async function validateQuizContent(quiz) {
  const issues = [];
  
  if (!quiz.questions || quiz.questions.length === 0) {
    issues.push('No questions found');
  }
  
  quiz.questions?.forEach((q, index) => {
    if (!q.question?.trim()) {
      issues.push(`Question ${index + 1} is empty`);
    }
    
    if (q.options?.some(option => !option?.trim())) {
      issues.push(`Question ${index + 1} has empty options`);
    }
    
    if (q.options?.filter(Boolean).length !== 4) {
      issues.push(`Question ${index + 1} doesn't have 4 valid options`);
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues
  };
}
