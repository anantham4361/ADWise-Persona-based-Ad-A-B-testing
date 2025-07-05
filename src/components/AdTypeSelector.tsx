import React from 'react';
import { Image, Video, FileText } from 'lucide-react';
import { AdType } from '../App';

interface AdTypeSelectorProps {
  selectedType: AdType;
  onTypeChange: (type: AdType) => void;
  disabled?: boolean;
}

const AdTypeSelector: React.FC<AdTypeSelectorProps> = ({ selectedType, onTypeChange, disabled = false }) => {
  const adTypes = [
    {
      type: 'image' as AdType,
      label: 'Image Ads',
      icon: Image,
      description: 'Analyze static image advertisements',
      color: 'blue'
    },
    {
      type: 'video' as AdType,
      label: 'Video Ads',
      icon: Video,
      description: 'Analyze video advertisements',
      color: 'purple'
    },
    {
      type: 'text' as AdType,
      label: 'Text Ads',
      icon: FileText,
      description: 'Analyze text-based advertisements',
      color: 'green'
    }
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      blue: {
        bg: isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200',
        icon: isSelected ? 'text-blue-600' : 'text-gray-400',
        text: isSelected ? 'text-blue-900' : 'text-gray-700',
        hover: 'hover:border-blue-300 hover:bg-blue-50'
      },
      purple: {
        bg: isSelected ? 'bg-purple-50 border-purple-300' : 'bg-white border-gray-200',
        icon: isSelected ? 'text-purple-600' : 'text-gray-400',
        text: isSelected ? 'text-purple-900' : 'text-gray-700',
        hover: 'hover:border-purple-300 hover:bg-purple-50'
      },
      green: {
        bg: isSelected ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200',
        icon: isSelected ? 'text-green-600' : 'text-gray-400',
        text: isSelected ? 'text-green-900' : 'text-gray-700',
        hover: 'hover:border-green-300 hover:bg-green-50'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded mr-2"></div>
        <h2 className="text-2xl font-semibold text-gray-800">Select Ad Type</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {adTypes.map(({ type, label, icon: Icon, description, color }) => {
          const isSelected = selectedType === type;
          const colorClasses = getColorClasses(color, isSelected);
          
          return (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              disabled={disabled}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${colorClasses.bg} ${colorClasses.hover} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer transform hover:scale-105'}`}
            >
              <div className="flex items-center mb-3">
                <Icon className={`w-8 h-8 ${colorClasses.icon} mr-3`} />
                <h3 className={`text-lg font-semibold ${colorClasses.text}`}>
                  {label}
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                {description}
              </p>
              {isSelected && (
                <div className="mt-3 flex items-center">
                  <div className={`w-2 h-2 rounded-full ${colorClasses.icon.replace('text-', 'bg-')} mr-2`}></div>
                  <span className="text-xs font-medium text-gray-600">Selected</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium">💡 Tip:</span> Each ad type uses specialized AI analysis tailored to the medium. 
          Image ads focus on visual elements, video ads analyze motion and audio cues, and text ads evaluate messaging and copy effectiveness.
        </p>
      </div>
    </div>
  );
};

export default AdTypeSelector;