import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const CRITERIA = [
  'visual_attention_grab',
  'message_clarity', 
  'emotional_engagement',
  'brand_recall',
  'health_appeal',
  'uniqueness'
];

const CRITERIA_NAMES = [
  'Visual Attention Grab',
  'Message Clarity',
  'Emotional Engagement', 
  'Brand Recall',
  'Health Appeal',
  'Uniqueness'
];

function encodeImage(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString('base64');
  } catch (error) {
    throw new Error(`Failed to read image file: ${error.message}`);
  }
}

export async function evaluateAds(persona, adAPath, adBPath) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY environment variable is required');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

  // Encode images
  const adABase64 = encodeImage(adAPath);
  const adBBase64 = encodeImage(adBPath);

  const systemPrompt = `You are an expert advertising analyst. Evaluate two ads (Ad A and Ad B) against this persona:

PERSONA:
- Age: ${persona.age}
- Gender: ${persona.gender}
- Interests: ${persona.interests.join(', ')}
- Preferred Colors: ${persona.preferred_colors.join(', ')}
- Tone Preference: ${persona.tone_preference}
- Personality Traits: ${persona.personality_traits.join(', ')}
- Food Preferences: ${persona.food_preferences.join(', ')}
- Description: ${persona.description}

Evaluate each ad on these 6 criteria (score 1-10 for each):
1. Visual Attention Grab - How well does the ad catch the eye visually?
2. Message Clarity - How clear and understandable is the message?
3. Emotional Engagement - How well does it connect emotionally with this persona?
4. Brand Recall - How memorable is the brand/product?
5. Health Appeal - How appealing is it from a health perspective (if relevant)?
6. Uniqueness - How unique and differentiated is the ad?

Return your response as a valid JSON object with this exact structure:
{
    "ad_a_scores": {
        "visual_attention_grab": integer,
        "message_clarity": integer,
        "emotional_engagement": integer,
        "brand_recall": integer,
        "health_appeal": integer,
        "uniqueness": integer,
        "total": integer
    },
    "ad_b_scores": {
        "visual_attention_grab": integer,
        "message_clarity": integer,
        "emotional_engagement": integer,
        "brand_recall": integer,
        "health_appeal": integer,
        "uniqueness": integer,
        "total": integer
    },
    "winner": "Ad A" or "Ad B",
    "explanation": "Brief explanation of why the winning ad is better for this persona (2-3 sentences)"
}

Calculate the total as the sum of all 6 criteria scores.`;

  try {
    const imageParts = [
      {
        inlineData: {
          data: adABase64,
          mimeType: 'image/jpeg'
        }
      },
      {
        inlineData: {
          data: adBBase64,
          mimeType: 'image/jpeg'
        }
      }
    ];

    const result = await model.generateContent([
      systemPrompt + '\n\nPlease evaluate these two ads against the provided persona. Ad A is the first image, Ad B is the second image.',
      ...imageParts
    ]);

    const response = await result.response;
    const content = response.text();
    
    // Clean the response to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const evaluationData = JSON.parse(jsonMatch[0]);
    
    return {
      persona,
      ad_a_scores: evaluationData.ad_a_scores,
      ad_b_scores: evaluationData.ad_b_scores,
      winner: evaluationData.winner,
      explanation: evaluationData.explanation,
      criteria_names: CRITERIA_NAMES
    };
  } catch (error) {
    if (error.name === 'SyntaxError') {
      throw new Error(`Failed to parse evaluation JSON: ${error.message}`);
    } else {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }
}