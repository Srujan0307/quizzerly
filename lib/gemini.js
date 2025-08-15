export async function generateText(prompt, retries = 3) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
  
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${retries}...`);
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topP: 0.8,
              topK: 40,
              maxOutputTokens: 2048,
            }
          })
        });
  
        console.log(`📡 Response status: ${response.status}`);
  
        if (response.ok) {
          const data = await response.json();
          
          // Step by step debugging
          console.log('🔍 Step 1 - data exists:', !!data);
          console.log('🔍 Step 2 - data.candidates exists:', !!data.candidates);
          console.log('🔍 Step 3 - data.candidates is array:', Array.isArray(data.candidates));
          console.log('🔍 Step 4 - data.candidates.length:', data.candidates?.length);
          
          if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            console.log('🔍 Step 5 - first candidate exists:', !!candidate);
            console.log('🔍 Step 6 - candidate.content exists:', !!candidate.content);
            
            if (candidate.content) {
              console.log('🔍 Step 7 - candidate.content.parts exists:', !!candidate.content.parts);
              console.log('🔍 Step 8 - parts is array:', Array.isArray(candidate.content.parts));
              console.log('🔍 Step 9 - parts.length:', candidate.content.parts?.length);
              
              if (candidate.content.parts && candidate.content.parts.length > 0) {
                const part = candidate.content.parts[0];
                console.log('🔍 Step 10 - first part exists:', !!part);
                console.log('🔍 Step 11 - part.text exists:', !!part.text);
                console.log('🔍 Step 12 - part.text value:', part.text);
                
                if (part.text) {
                  console.log(`✅ SUCCESS! Extracted text: "${part.text}"`);
                  return part.text;
                }
              }
            }
          }
          
          // If we get here, the structure is unexpected
          console.log('❌ Full response for debugging:');
          console.log(JSON.stringify(data, null, 2));
          throw new Error('Could not extract text from response');
          
        } else if (response.status === 503 && attempt < retries) {
          console.log(`⏳ Server overloaded, waiting ${attempt * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 2000));
          continue;
        } else {
          const error = await response.text();
          throw new Error(`Gemini API error: ${response.status} - ${error}`);
        }
  
      } catch (error) {
        if (attempt === retries) {
          console.error('Error generating text:', error);
          throw new Error('Failed to generate text: ' + error.message);
        }
        
        console.log(`⏳ Retrying in ${attempt} seconds...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    }
  }
  