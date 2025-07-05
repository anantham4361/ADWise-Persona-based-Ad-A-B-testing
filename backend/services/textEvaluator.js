import { GoogleGenerativeAI } from '@google/generative-ai';
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
  'Headline Impact',
  'Message Clarity',
  'Emotional Engagement', 
  'Brand Recall',
  'Health Appeal',
  'Uniqueness'
];

export async function evaluateTextAds(persona, adAText, adBText) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY environment variable is required');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const systemPrompt = `You are an expert copywriting and text advertising analyst. Evaluate two text advertisements (Text Ad A and Text Ad B) against this persona:

PERSONA:
- Age: ${persona.age}
- Gender: ${persona.gender}
- Interests: ${persona.interests.join(', ')}
- Preferred Colors: ${persona.preferred_colors.join(', ')}
- Tone Preference: ${persona.tone_preference}
- Personality Traits: ${persona.personality_traits.join(', ')}
- Food Preferences: ${persona.food_preferences.join(', ')}
- Description: ${persona.description}

For text ads, consider: headline effectiveness, copy clarity, tone alignment, persuasive language, emotional triggers, language complexity, and value proposition clarity.

Evaluate each text ad on these 6 criteria (score 1-10 for each):
1. Headline Impact - How compelling and attention-grabbing is the headline/opening?
2. Message Clarity - How clear, concise, and understandable is the copy?
3. Emotional Engagement - How well does the text connect emotionally with this persona?
4. Brand Recall - How memorable and distinctive is the brand messaging?
5. Health Appeal - How appealing is the health messaging (if relevant)?
6. Uniqueness - How unique and differentiated is the copy and positioning?

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
    "explanation": "Brief explanation of why the winning text ad is better for this persona, focusing on copywriting elements (2-3 sentences)"
}

Calculate the total as the sum of all 6 criteria scores.`;

  const fullPrompt = `${systemPrompt}\n\nPlease evaluate these two text advertisements against the provided persona:

TEXT AD A:
${adAText}

TEXT AD B:
${adBText}

Analyze the copy, tone, messaging, and overall effectiveness for the target persona.`;

  try {
    const result = await model.generateContent(fullPrompt);
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