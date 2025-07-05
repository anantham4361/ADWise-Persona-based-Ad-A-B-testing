import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export async function generatePersona(prompt) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY environment variable is required');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const systemPrompt = `Generate a detailed user persona based on the provided description. 

Return your response as a valid JSON object with the following structure:
{
    "age": integer,
    "gender": "string",
    "interests": ["array", "of", "strings"],
    "preferred_colors": ["array", "of", "color", "names"],
    "tone_preference": "string (e.g., fun, serious, professional, casual)",
    "personality_traits": ["array", "of", "traits"],
    "food_preferences": ["array", "of", "food", "preferences"],
    "description": "A comprehensive 2-3 sentence description of this persona"
}

Make realistic details that align with the description. If specific details aren't mentioned, make reasonable assumptions.`;

  const fullPrompt = `${systemPrompt}\n\nGenerate a detailed persona based on this description: ${prompt}`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const content = response.text();
    
    // Clean the response to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const personaData = JSON.parse(jsonMatch[0]);
    return personaData;
  } catch (error) {
    if (error.name === 'SyntaxError') {
      throw new Error(`Failed to parse persona JSON: ${error.message}`);
    } else {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }
}