import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  title: string;
  image: File | null;
  onImageChange: (file: File | null) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ title, image, onImageChange, disabled = false }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageChange(acceptedFiles[0]);
    }
  }, [onImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    disabled
  });

  const removeImage = () => {
    onImageChange(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ImageIcon className="w-6 h-6 text-indigo-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        {image && (
          <button
            onClick={removeImage}
            disabled={disabled}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!image ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
            ${isDragActive 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600 mb-2">
            {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
          </p>
          <p className="text-sm text-gray-500 mb-4">or click to select a file</p>
          <p className="text-xs text-gray-400">Supports JPEG, PNG, WebP (max 10MB)</p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={URL.createObjectURL(image)}
            alt={title}
            className="w-full h-64 object-cover rounded-lg border border-gray-200"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg text-sm">
            {image.name}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;