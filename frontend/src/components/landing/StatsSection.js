import React from "react";
import CountUp from "react-countup"; // Import the CountUp component

const StatsSection = ({ isVisible }) => {
  const stats = [
    {
      number: 50,
      suffix: "K+",
      label: "Active Users",
      icon: "👥",
      color: "blue",
    },
    {
      number: 99.9,
      decimals: 1,
      suffix: "%",
      label: "Uptime",
      icon: "⚡",
      color: "green",
    },
    {
      number: 10,
      suffix: "M+",
      label: "Messages",
      icon: "💬",
      color: "purple",
    },
    {
      number: 150,
      suffix: "+",
      label: "Countries",
      icon: "🌍",
      color: "indigo",
    },
  ];

  // Fix for dynamic Tailwind classes: Map colors to full class names
  const colorClasses = {
    blue: "from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400",
    green:
      "from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500",
    purple:
      "from-purple-600 to-violet-700 dark:from-purple-400 dark:to-violet-500",
    indigo: "from-indigo-500 to-sky-600 dark:from-indigo-400 dark:to-sky-500",
  };

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          data-animate
          id="stats"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 ${
                isVisible.stats
                  ? "animate-slideInUp"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`text-4xl mb-3 transition-transform duration-700 ${
                  isVisible.stats ? "scale-100" : "scale-0"
                }`}
                style={{ transitionDelay: `${index * 0.2 + 0.2}s` }}
              >
                {stat.icon}
              </div>

              <div
                className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${
                  colorClasses[stat.color]
                } bg-clip-text text-transparent mb-2`}
              >
                {isVisible.stats ? (
                  <CountUp
                    end={stat.number}
                    duration={2.5}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix}
                    enableScrollSpy
                    scrollSpyDelay={100}
                  />
                ) : (
                  `0${stat.suffix || ""}`
                )}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
