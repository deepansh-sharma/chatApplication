import React from "react";
import ChatDemo from "./ChatDemo";
import { TypeAnimation } from "react-type-animation";
// The texts to be typed
const typingTexts = [
  "Connect teams globally",
  "Collaborate in real-time",
  "Communicate securely",
  "Build stronger relationships",
];

// Generate the sequence for the animation
const sequence = typingTexts.flatMap((text) => [text, 1500]); // 1.5s pause after each text

const HeroSection = ({ mockLogin }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[auto,auto] lg:justify-center gap-16 items-center">
          <div
            className="text-center lg:text-left space-y-8 animate-slideInLeft"
            data-animate
            id="hero-content"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 dark:bg-blue-900/40 backdrop-blur-sm text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium animate-slideInDown border border-blue-200/50 dark:border-blue-800/50">
                🚀 Trusted by 50,000+ teams worldwide
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                Where Teams
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 animate-gradientShift">
                  {" "}
                  Connect
                </span>
              </h1>

              <div className="h-8 flex items-center justify-center lg:justify-start">
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
                  <TypeAnimation
                    sequence={sequence}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                    className="custom-type-animation-cursortext-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium"
                    cursor={false}
                  />
                  <span className="animate-blink text-blue-600 dark:text-blue-400">
                    | {/* Custom cursor */}
                  </span>
                </p>
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Experience the future of team communication with ChatConnect.
                Real-time messaging, secure collaboration, and powerful
                integrations that scale with your business.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={mockLogin}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white font-semibold rounded-xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-600 dark:to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center">
                  Start Free Trial
                  <svg
                    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>

              <button
                onClick={mockLogin}
                className="px-8 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white font-semibold rounded-xl text-lg border-2 border-gray-200/70 dark:border-gray-600/70 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Watch Demo
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-8 text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end animate-slideInRight">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-400/10 dark:to-purple-400/10 rounded-3xl blur-2xl animate-pulse"></div>
              <ChatDemo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
