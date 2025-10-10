import React from 'react';

const Loader = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`loader ${sizeClasses[size]} ${className}`}>
      <style jsx>{`
        .loader {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: inline-block;
          position: relative;
          border: 3px solid;
          border-color: #FFF #FFF transparent transparent;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }
        .loader::after,
        .loader::before {
          content: '';  
          box-sizing: border-box;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          border: 3px solid;
          border-color: transparent transparent #FF3D00 #FF3D00;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-sizing: border-box;
          animation: rotationBack 0.5s linear infinite;
          transform-origin: center center;
        }
        .loader::before {
          width: 32px;
          height: 32px;
          border-color: #FFF #FFF transparent transparent;
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
        .loader.small {
          width: 24px;
          height: 24px;
        }
        .loader.small::after {
          width: 20px;
          height: 20px;
        }
        .loader.small::before {
          width: 16px;
          height: 16px;
        }

        .loader.large {
          width: 64px;
          height: 64px;
        }
        .loader.large::after {
          width: 56px;
          height: 56px;
        }
        .loader.large::before {
          width: 48px;
          height: 48px;
        }

        .loader.xl {
          width: 80px;
          height: 80px;
        }
        .loader.xl::after {
          width: 72px;
          height: 72px;
        }
        .loader.xl::before {
          width: 64px;
          height: 64px;
        }
      `}</style>
    </div>
  );
};

export default Loader;

