import { extractTextFromPDF, analyzeTextContent } from './pdf-extractor.js';
import fs from 'fs';
import path from 'path';

async function testPDFExtraction() {
  console.log('🧪 Testing PDF extraction...');
  
  try {
    // For testing, we'll create a simple test or you can provide a PDF file path
    const testPDFPath = './test-sample.pdf'; // You'll need to add a sample PDF
    
    if (fs.existsSync(testPDFPath)) {
      console.log('📁 Found test PDF file');
      
      const pdfBuffer = fs.readFileSync(testPDFPath);
      const extractedText = await extractTextFromPDF(pdfBuffer.buffer);
      
      console.log('✅ Extraction successful!');
      console.log('📝 Text preview:', extractedText.substring(0, 200) + '...');
      
      const analysis = analyzeTextContent(extractedText);
      console.log('📊 Content analysis:', analysis);
      
    } else {
      console.log('⚠️ No test PDF found. PDF extraction code is ready for web upload.');
      console.log('📁 Place a test PDF at:', testPDFPath, 'to test extraction');
    }
    
  } catch (error) {
    console.error('❌ PDF extraction test failed:', error.message);
  }
}

testPDFExtraction();
