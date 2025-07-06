import React, { useState } from 'react';
import PersonaInput from './components/PersonaInput';
import AdTypeSelector from './components/AdTypeSelector';
import ImageUpload from './components/ImageUpload';
import VideoUpload from './components/VideoUpload';
import TextAdInput from './components/TextAdInput';
import PersonaDisplay from './components/PersonaDisplay';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { Brain } from 'lucide-react';

export interface Persona {
  age: number;
  gender: string;
  interests: string[];
  preferred_colors: string[];
  tone_preference: string;
  personality_traits: string[];
  food_preferences: string[];
  description: string;
}

export interface AdScore {
  visual_attention_grab: number;
  message_clarity: number;
  emotional_engagement: number;
  brand_recall: number;
  health_appeal: number;
  uniqueness: number;
  total: number;
}

export interface EvaluationResult {
  persona: Persona;
  ad_a_scores: AdScore;
  ad_b_scores: AdScore;
  winner: string;
  explanation: string;
  criteria_names: string[];
  ad_type: string;
}

export type AdType = 'image' | 'video' | 'text';

function App() {
  const [personaPrompt, setPersonaPrompt] = useState('');
  const [adType, setAdType] = useState<AdType>('image');
  
  // Image ads
  const [adImageA, setAdImageA] = useState<File | null>(null);
  const [adImageB, setAdImageB] = useState<File | null>(null);
  
  // Video ads
  const [adVideoA, setAdVideoA] = useState<File | null>(null);
  const [adVideoB, setAdVideoB] = useState<File | null>(null);
  
  // Text ads
  const [adTextA, setAdTextA] = useState('');
  const [adTextB, setAdTextB] = useState('');
  
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateInputs = () => {
    if (!personaPrompt.trim()) {
      return 'Please provide a persona description';
    }

    switch (adType) {
      case 'image':
        if (!adImageA || !adImageB) {
          return 'Please upload both ad images';
        }
        break;
      case 'video':
        if (!adVideoA || !adVideoB) {
          return 'Please upload both ad videos';
        }
        break;
      case 'text':
        if (!adTextA.trim() || !adTextB.trim()) {
          return 'Please provide both text advertisements';
        }
        break;
    }
    return null;
  };

  const handleEvaluate = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let endpoint = '';
      const formData = new FormData();
      formData.append('persona_prompt', personaPrompt);

      switch (adType) {
        case 'image':
          endpoint = `https://adwise-backend-5q0u.onrender.com/evaluate-ads`;
          formData.append('ad_a', adImageA!);
          formData.append('ad_b', adImageB!);
          break;
        case 'video':
          endpoint = `https://adwise-backend-5q0u.onrender.com/evaluate-video-ads`;
          formData.append('ad_a', adVideoA!);
          formData.append('ad_b', adVideoB!);
          break;
        case 'text':
          endpoint = `$https://adwise-backend-5q0u.onrender.com/evaluate-text-ads`;
          formData.append('ad_a_text', adTextA);
          formData.append('ad_b_text', adTextB);
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to evaluate ads');
      }

      const result = await response.json();
      setEvaluationResult({ ...result, ad_type: adType });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPersonaPrompt('');
    setAdType('image');
    setAdImageA(null);
    setAdImageB(null);
    setAdVideoA(null);
    setAdVideoB(null);
    setAdTextA('');
    setAdTextB('');
    setEvaluationResult(null);
    setError(null);
  };

  const renderAdInputs = () => {
    switch (adType) {
      case 'image':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <ImageUpload
              title="Ad A"
              image={adImageA}
              onImageChange={setAdImageA}
              disabled={loading}
            />
            <ImageUpload
              title="Ad B"
              image={adImageB}
              onImageChange={setAdImageB}
              disabled={loading}
            />
          </div>
        );
      case 'video':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <VideoUpload
              title="Video Ad A"
              video={adVideoA}
              onVideoChange={setAdVideoA}
              disabled={loading}
            />
            <VideoUpload
              title="Video Ad B"
              video={adVideoB}
              onVideoChange={setAdVideoB}
              disabled={loading}
            />
          </div>
        );
      case 'text':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <TextAdInput
              title="Text Ad A"
              value={adTextA}
              onChange={setAdTextA}
              disabled={loading}
            />
            <TextAdInput
              title="Text Ad B"
              value={adTextB}
              onChange={setAdTextB}
              disabled={loading}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ADWise: Persona based Ad A/B testing
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate detailed personas and evaluate ad performance across images, videos, and text with AI-powered analysis
          </p>
        </div>

        {!evaluationResult ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {/* Persona Input */}
            <PersonaInput
              value={personaPrompt}
              onChange={setPersonaPrompt}
              disabled={loading}
            />

            {/* Ad Type Selector */}
            <AdTypeSelector
              selectedType={adType}
              onTypeChange={setAdType}
              disabled={loading}
            />

            {/* Ad Inputs */}
            {renderAdInputs()}

            {/* Evaluate Button */}
            <div className="text-center">
              <button
                onClick={handleEvaluate}
                disabled={loading || !!validateInputs()}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? <LoadingSpinner /> : 'Analyze Ads'}
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Results */}
            <PersonaDisplay persona={evaluationResult.persona} />
            <ResultsDisplay result={evaluationResult} />
            
            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transform hover:scale-105 transition-all duration-200"
              >
                Start New Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;