import React from "react";

const BackgroundElements = ({ smoothMousePosition, mousePosition }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-purple-600/30 dark:from-blue-600/20 dark:to-purple-800/20 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-indigo-400/30 to-cyan-600/30 dark:from-indigo-600/20 dark:to-cyan-800/20 rounded-full animate-pulse delay-1000"></div>

      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>

      <div
        className="absolute w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-60 pointer-events-none transition-opacity duration-300 mix-blend-multiply dark:mix-blend-screen"
        style={{
          left: smoothMousePosition.x - 12,
          top: smoothMousePosition.y - 12,
          transform: `scale(${mousePosition.x > 0 ? 1 : 0})`,
          filter: "blur(2px)",
        }}
      />
      <div
        className="absolute w-3 h-3 bg-white rounded-full opacity-80 pointer-events-none"
        style={{
          left: smoothMousePosition.x - 6,
          top: smoothMousePosition.y - 6,
          transform: `scale(${mousePosition.x > 0 ? 1 : 0})`,
        }}
      />
    </div>
  );
};

export default BackgroundElements;
