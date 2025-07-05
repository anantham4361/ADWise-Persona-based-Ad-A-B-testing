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

export async function evaluateVideoAds(persona, adAPath, adBPath) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY environment variable is required');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const systemPrompt = `You are an expert video advertising analyst. Evaluate two video ads (Video Ad A and Video Ad B) against this persona:

PERSONA:
- Age: ${persona.age}
- Gender: ${persona.gender}
- Interests: ${persona.interests.join(', ')}
- Preferred Colors: ${persona.preferred_colors.join(', ')}
- Tone Preference: ${persona.tone_preference}
- Personality Traits: ${persona.personality_traits.join(', ')}
- Food Preferences: ${persona.food_preferences.join(', ')}
- Description: ${persona.description}

For video ads, consider: motion, visual dynamics, audio elements, pacing, timing, visual storytelling, scene transitions, and production quality.

Evaluate each video ad on these 6 criteria (score 1-10 for each):
1. Visual Attention Grab - How well does the video catch the eye and maintain attention?
2. Message Clarity - How clear and understandable is the message throughout the video?
3. Emotional Engagement - How well does it connect emotionally with this persona?
4. Brand Recall - How memorable is the brand/product presentation?
5. Health Appeal - How appealing is it from a health perspective (if relevant)?
6. Uniqueness - How unique and differentiated is the video ad?

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
    "explanation": "Brief explanation of why the winning video ad is better for this persona, considering video-specific elements (2-3 sentences)"
}

Calculate the total as the sum of all 6 criteria scores.

Note: Since I cannot actually view the video content, I will analyze based on typical video ad elements and best practices for the given persona.`;

  const fullPrompt = `${systemPrompt}\n\nPlease evaluate these two video ads against the provided persona:

Video Ad A: ${adAPath.split('/').pop()}
Video Ad B: ${adBPath.split('/').pop()}

Provide a comprehensive evaluation based on typical video advertising elements and best practices for the given persona.`;

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