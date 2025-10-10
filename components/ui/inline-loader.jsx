import React from 'react';

const InlineLoader = ({ size = 'small', className = '', message = '' }) => {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <div className="inline-loader">
        <style jsx>{`
          .inline-loader {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: inline-block;
            position: relative;
            border: 2px solid;
            border-color: #3B82F6 #3B82F6 transparent transparent;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
          }
          .inline-loader::after,
          .inline-loader::before {
            content: '';  
            box-sizing: border-box;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            border: 2px solid;
            border-color: transparent transparent #EF4444 #EF4444;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            box-sizing: border-box;
            animation: rotationBack 0.5s linear infinite;
            transform-origin: center center;
          }
          .inline-loader::before {
            width: 12px;
            height: 12px;
            border-color: #3B82F6 #3B82F6 transparent transparent;
            animation: rotation 1.5s linear infinite;
          }
              
          @keyframes rotation {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          } 
          @keyframes rotationBack {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(-360deg);
            }
          }

          /* Size variations */
          .inline-loader.small {
            width: 16px;
            height: 16px;
          }
          .inline-loader.small::after {
            width: 12px;
            height: 12px;
          }
          .inline-loader.small::before {
            width: 8px;
            height: 8px;
          }

          .inline-loader.medium {
            width: 24px;
            height: 24px;
          }
          .inline-loader.medium::after {
            width: 20px;
            height: 20px;
          }
          .inline-loader.medium::before {
            width: 16px;
            height: 16px;
          }
        `}</style>
      </div>
      {message && (
        <span className="text-sm text-gray-600">{message}</span>
      )}
    </div>
  );
};

export default InlineLoader;


