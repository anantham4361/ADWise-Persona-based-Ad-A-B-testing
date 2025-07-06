import React from 'react';
import { User, Heart, Palette, MessageCircle, Utensils } from 'lucide-react';
import { Persona } from '../App';

interface PersonaDisplayProps {
  persona: Persona;
}

const PersonaDisplay: React.FC<PersonaDisplayProps> = ({ persona }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <User className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-800">Generated Persona</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Basic Information</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Age:</span> {persona.age}</p>
              <p><span className="font-medium">Gender:</span> {persona.gender}</p>
              <p><span className="font-medium">Tone:</span> {persona.tone_preference}</p>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-4">
          <div className="flex items-center mb-2">
            <Heart className="w-4 h-4 text-red-500 mr-1" />
            <h3 className="font-semibold text-gray-700">Interests</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {persona.interests.map((interest, index) => (
              <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <div className="flex items-center mb-2">
            <Palette className="w-4 h-4 text-purple-500 mr-1" />
            <h3 className="font-semibold text-gray-700">Preferred Colors</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {persona.preferred_colors.map((color, index) => (
              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {color}
              </span>
            ))}
          </div>
        </div>

        {/* Personality Traits */}
        <div className="space-y-4">
          <div className="flex items-center mb-2">
            <MessageCircle className="w-4 h-4 text-blue-500 mr-1" />
            <h3 className="font-semibold text-gray-700">Personality Traits</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {persona.personality_traits.map((trait, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Food Preferences */}
        <div className="space-y-4">
          <div className="flex items-center mb-2">
            <Utensils className="w-4 h-4 text-green-500 mr-1" />
            <h3 className="font-semibold text-gray-700">Food Preferences</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {persona.food_preferences.map((food, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {food}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2 lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-gray-700">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{persona.description}</p>
        </div>
      </div>
    </div>
  );
};

export default PersonaDisplay;