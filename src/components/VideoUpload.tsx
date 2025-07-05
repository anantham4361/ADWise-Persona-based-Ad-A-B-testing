import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Video, X, Play } from 'lucide-react';

interface VideoUploadProps {
  title: string;
  video: File | null;
  onVideoChange: (file: File | null) => void;
  disabled?: boolean;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ title, video, onVideoChange, disabled = false }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onVideoChange(acceptedFiles[0]);
    }
  }, [onVideoChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    },
    multiple: false,
    disabled
  });

  const removeVideo = () => {
    onVideoChange(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Video className="w-6 h-6 text-purple-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        {video && (
          <button
            onClick={removeVideo}
            disabled={disabled}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!video ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
            ${isDragActive 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600 mb-2">
            {isDragActive ? 'Drop the video here' : 'Drag & drop a video here'}
          </p>
          <p className="text-sm text-gray-500 mb-4">or click to select a file</p>
          <p className="text-xs text-gray-400">Supports MP4, MOV, AVI, MKV, WebM (max 100MB)</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <video
              src={URL.createObjectURL(video)}
              className="w-full h-64 object-cover"
              controls
              preload="metadata"
            />
            <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg text-sm flex items-center">
              <Play className="w-4 h-4 mr-1" />
              Video
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 truncate">{video.name}</p>
                <p className="text-sm text-gray-600">{formatFileSize(video.size)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Type: {video.type}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;