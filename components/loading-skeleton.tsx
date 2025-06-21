import { Video } from 'lucide-react';
import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="h-screen flex flex-col gap- items-center justify-center p-4">
      <div className="relative">
        <div className="absolute inset-0">
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
      </div>

      {/* <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-medium">
            Initializing AI Interview System
          </span>
          <span className="text-purple-400 text-sm">Loading...</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse w-2/3"></div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-slate-400 text-sm animate-pulse">
            Setting up your personalized interview experience...
          </p>
        </div>
      </div> */}

      {/* Loading Messages */}
      {/* <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 text-purple-300">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm animate-pulse">
            Connecting to AI mentor...
          </span>
        </div>
      </div> */}
    </div>
  );
}
