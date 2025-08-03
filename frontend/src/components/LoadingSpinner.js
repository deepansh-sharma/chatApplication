import React from "react";
import config from "../config/config";

const LoadingSpinner = ({
  size = "default",
  message = "Loading...",
  fullScreen = true,
}) => {
  const sizeClasses = {
    small: "h-6 w-6",
    default: "h-12 w-12",
    large: "h-16 w-16",
  };

  const textSizeClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg",
  };

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          {/* Logo */}
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-white font-bold text-2xl">C</span>
          </div>

          {/* Spinning loader */}
          <div className="relative mb-4">
            <div
              className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto ${sizeClasses[size]}`}
            ></div>
          </div>

          {/* Loading text */}
          <div
            className={`text-gray-600 font-medium ${textSizeClasses[size]} mb-2`}
          >
            {message}
          </div>

          {/* App name */}
          <div className="text-gray-500 text-sm">{config.APP_NAME}</div>

          {/* Loading dots animation */}
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Inline spinner (not full screen)
  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto ${sizeClasses[size]} mb-2`}
        ></div>
        {message && (
          <div className={`text-gray-600 ${textSizeClasses[size]}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton loader for content
export const SkeletonLoader = ({ lines = 3, className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 rounded h-4 mb-3 last:mb-0"
        ></div>
      ))}
    </div>
  );
};

// Card skeleton loader
export const CardSkeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-white rounded-xl shadow-lg p-6 ${className}`}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="ml-4 flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
