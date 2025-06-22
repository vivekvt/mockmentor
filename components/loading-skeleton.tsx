import { Video } from 'lucide-react';
import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="h-screen flex flex-col gap-6 items-center justify-center p-4">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 animate-pulse"></div>
            <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-purple-400 animate-ping opacity-20"></div>
            <Video className="absolute inset-0 m-auto w-16 h-16 text-white opacity-80" />
          </div>
        </div>

        {/* Streaming lines effect */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-transparent via-purple-400/30 to-transparent h-0.5 w-full animate-pulse"
              style={{
                top: `${i * 8 + 10}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s',
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Your interview is starting soon
        </h2>
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">
          Setting up your AI mentor and preparing the environment...
        </p>
      </div>
    </div>
  );
}
