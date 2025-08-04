import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import motion components
// In the parent component where you define 'features'
const features = [
  {
    icon: "⚡️",
    title: "Real-Time Messaging",
    description: "Lightning-fast message delivery with WebSocket technology.",
    color: "blue",
  },
  {
    icon: "⚙️",
    title: "Room Management",
    description: "Create and manage rooms with advanced permissions.",
    color: "green",
  },
  {
    icon: "👤",
    title: "User Presence",
    description: "Real-time user status and presence indicators.",
    color: "yellow",
  },
  {
    icon: "🔒",
    title: "Secure Chats",
    description: "End-to-end encryption and enterprise-grade security.",
    color: "red",
  },
  {
    icon: "📎",
    title: "File Sharing",
    description: "Seamless file sharing with drag-and-drop support.",
    color: "purple",
  },
  {
    icon: "🔎",
    title: "Powerful Search",
    description: "Find anything instantly with powerful search.",
    color: "indigo",
  },
];
const FeaturesSection = ({ activeFeature, setActiveFeature, features }) => {
  // Fix for dynamic Tailwind classes: Map colors to full class names
  const iconColorClasses = {
    blue: "bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30",
    green:
      "bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30",
    purple:
      "bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30",
    red: "bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30",
    yellow:
      "bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30",
    indigo:
      "bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30",
  };

  return (
    <section className="py-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-y border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-16 animate-slideInUp"
          id="features-header"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Powerful Features That
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {" "}
              Scale
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to build stronger team connections and boost
            productivity
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Feature List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-500 transform hover:scale-102 ${
                  activeFeature === index
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white shadow-2xl scale-105"
                    : "bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:bg-gray-50/90 dark:hover:bg-gray-700/90 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50"
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`text-2xl p-3 rounded-lg transition-all duration-300 ${
                      activeFeature === index
                        ? "bg-white/20 backdrop-blur-sm"
                        : // Use the color map here for reliable styling
                          iconColorClasses[feature.color] || "bg-gray-100"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {feature.title}
                    </h3>
                    <p
                      className={`transition-colors duration-300 ${
                        activeFeature === index
                          ? "text-blue-100"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {/* Use description from the feature object, not a separate function */}
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Animated Display with Framer Motion */}
          <div className="relative h-96">
            <AnimatePresence mode="wait">
              <motion.div
                // The key is crucial for AnimatePresence to detect changes
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-full max-w-sm">
                  <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                    <div className="text-center space-y-6">
                      <div className="text-6xl">
                        {features[activeFeature].icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {features[activeFeature].title}
                      </h3>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 h-3 rounded-full transition-all duration-1000 shadow-sm"
                          style={{
                            width: `${
                              ((activeFeature + 1) / features.length) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        Feature {activeFeature + 1} of {features.length}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
