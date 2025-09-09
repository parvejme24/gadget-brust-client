import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image, X } from 'lucide-react';

const FileUpload = ({ 
  onFileChange, 
  preview, 
  accept = "image/*", 
  className = "",
  disabled = false 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileChange(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-[#38AD81] bg-[#38AD81]/5 scale-[1.02]' 
            : 'border-gray-300 hover:border-[#38AD81]/50 hover:bg-gray-50/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${preview ? 'p-4' : 'p-8'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {preview ? (
          // Preview Mode
          <div className="space-y-4">
            <div className="relative group">
              <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Remove Button */}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-1">Image Preview</p>
              <p className="text-xs text-gray-500">Click or drag to change image</p>
            </div>
          </div>
        ) : (
          // Upload Mode
          <div className="text-center space-y-4">
            <div className={`
              w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors duration-200
              ${isDragOver 
                ? 'bg-[#38AD81] text-white' 
                : 'bg-gray-100 text-gray-400 hover:bg-[#38AD81]/10 hover:text-[#38AD81]'
              }
            `}>
              <Upload className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-700">
                {isDragOver ? 'Drop image here' : 'Upload Image'}
              </h3>
              <p className="text-sm text-gray-500">
                Drag and drop your image here, or{' '}
                <span className="text-[#38AD81] font-medium">browse</span>
              </p>
              <p className="text-xs text-gray-400">
                Supports: JPG, PNG, GIF, WebP
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
