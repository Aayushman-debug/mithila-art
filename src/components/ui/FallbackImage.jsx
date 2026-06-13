import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiImage } from 'react-icons/fi';
import { buildApiPath } from '../../api';
import { imageMap } from '../../data/paintings';

const FallbackImage = ({ src, alt, className, fallbackSrc = null, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    let finalSrc = src;
    if (typeof src === 'string') {
      if (src.startsWith('/uploads') || src.startsWith('uploads/')) {
        finalSrc = buildApiPath(src);
      } else if (imageMap[src]) {
        finalSrc = imageMap[src];
      }
    }
    setImgSrc(finalSrc);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError && fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`} {...props}>
      {/* Skeleton loader */}
      {isLoading && !hasError && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
          }}
          style={{ backgroundSize: '200% 100%' }}
        />
      )}

      {/* Actual Image */}
      {!hasError ? (
        <img
          src={imgSrc}
          alt={alt || 'Image'}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : (
        /* Error State Placeholder */
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
          <FiImage className="w-10 h-10 mb-2 opacity-50" />
          <span className="text-xs font-medium tracking-wider uppercase opacity-75">Image not found</span>
        </div>
      )}
    </div>
  );
};

export default FallbackImage;
