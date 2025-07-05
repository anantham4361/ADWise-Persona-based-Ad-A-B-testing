import React from 'react';
import { FileText, Type } from 'lucide-react';

interface TextAdInputProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const TextAdInput: React.FC<TextAdInputProps> = ({ title, value, onChange, disabled = false }) => {
  const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = value.length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <FileText className="w-6 h-6 text-green-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor={`text-ad-${title}`} className="block text-sm font-medium text-gray-700 mb-2">
            Advertisement Copy
          </label>
          <textarea
            id={`text-ad-${title}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter your advertisement text here. Include headlines, body copy, call-to-action, and any other text elements..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            rows={8}
          />
        </div>

        {/* Statistics */}
        <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center">
            <Type className="w-4 h-4 mr-1" />
            <span>Characters: {charCount}</span>
          </div>
          <div>
            <span>Words: {wordCount}</span>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">💡 Text Ad Guidelines:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Include a compelling headline</li>
            <li>• Add clear value proposition</li>
            <li>• Include a strong call-to-action</li>
            <li>• Mention key benefits or features</li>
            <li>• Consider target audience language</li>
          </ul>
        </div>

        {/* Preview */}
        {value.trim() && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">Preview:</h4>
            <div className="bg-gray-50 rounded p-3 text-sm text-gray-800 whitespace-pre-wrap">
              {value}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextAdInput;