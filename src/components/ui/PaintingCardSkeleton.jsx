import React from 'react';

export default function PaintingCardSkeleton({ viewMode = 'grid' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col sm:flex-row bg-white/50 dark:bg-warm-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-cream-200/50 dark:border-warm-gray-700/50 shadow-sm animate-pulse">
        {/* Image Placeholder */}
        <div className="w-full sm:w-64 h-64 bg-warm-gray-200 dark:bg-warm-gray-700" />
        
        {/* Content Placeholder */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="h-6 bg-warm-gray-200 dark:bg-warm-gray-700 rounded w-1/3 mb-2" />
          <div className="h-4 bg-warm-gray-200 dark:bg-warm-gray-700 rounded w-1/4 mb-4" />
          <div className="h-4 bg-warm-gray-200 dark:bg-warm-gray-700 rounded w-full mb-2" />
          <div className="h-4 bg-warm-gray-200 dark:bg-warm-gray-700 rounded w-5/6 mb-6" />
          
          <div className="mt-auto flex items-center justify-between">
            <div className="h-8 bg-warm-gray-200 dark:bg-warm-gray-700 rounded w-1/4" />
            <div className="h-10 bg-warm-gray-200 dark:bg-warm-gray-700 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/50 dark:bg-warm-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-cream-200/50 dark:border-warm-gray-700/50 shadow-sm animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full aspect-[4/5] bg-warm-gray-200 dark:bg-warm-gray-700" />
      
      {/* Content Placeholder */}
      <div className="p-5">
        <div className="h-5 bg-warm-gray-200 dark:bg-warm-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-warm-gray-200 dark:bg-warm-gray-700 rounded w-1/2 mb-4" />
        
        <div className="flex items-center justify-between">
          <div className="h-6 bg-warm-gray-200 dark:bg-warm-gray-700 rounded w-1/3" />
          <div className="w-10 h-10 bg-warm-gray-200 dark:bg-warm-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
