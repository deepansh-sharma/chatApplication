import React from "react";
import {
  useMouseTracking,
  useIntersectionObserver,
  useCarousel,
} from "../hooks/useAnimations";
import BackgroundElements from "./landing/BackgroundElements";
import HeroSection from "./landing/HeroSection";
import StatsSection from "./landing/StatsSection";
import FeaturesSection from "./landing/FeaturesSection";
import TestimonialsSection from "./landing/TestimonialsSection";
import PricingSection from "./landing/PricingSection";
import FAQSection from "./landing/FAQSection";
import FeedbackSection from "./landing/FeedbackSection";
import Footer from "./landing/Footer";

// Mock hooks
const useAuth = () => ({ user: null });
const useTheme = () => ({ isDarkMode: false });

const Landing = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  // Custom hooks
  const { mousePosition, smoothMousePosition } = useMouseTracking();
  const isVisible = useIntersectionObserver();

  const features = [
    { icon: "⚡", title: "Real-time Messaging", color: "blue" },
    { icon: "🏠", title: "Smart Room Management", color: "green" },
    { icon: "👥", title: "User Presence", color: "purple" },
    { icon: "🔒", title: "Enterprise Security", color: "red" },
    { icon: "📁", title: "File Sharing", color: "yellow" },
    { icon: "🔍", title: "Advanced Search", color: "indigo" },
  ];

  const { activeIndex: activeFeature, setActiveIndex: setActiveFeature } =
    useCarousel(features.length);

  const mockLogin = () => {
    console.log("Login - would redirect to auth");
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-all duration-300 relative overflow-hidden">
        <BackgroundElements
          smoothMousePosition={smoothMousePosition}
          mousePosition={mousePosition}
        />

        <HeroSection mockLogin={mockLogin} />

        <StatsSection isVisible={isVisible} />

        <FeaturesSection
          activeFeature={activeFeature}
          setActiveFeature={setActiveFeature}
          features={features}
        />

        <TestimonialsSection isVisible={isVisible} />

        <PricingSection mockLogin={mockLogin} />

        <FAQSection />

        <FeedbackSection />

        <Footer />
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }

        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 3s ease infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-floatSlow {
          animation: floatSlow 8s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 1s infinite;
        }

        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-slideInDown {
          animation: slideInDown 0.8s ease-out forwards;
        }

        .animate-gradientShift {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }

        .bg-grid-pattern {
          background-image: linear-gradient(
              rgba(0, 0, 0, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: rgb(209 213 219);
        }

        .dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: rgb(75 85 99);
        }
      `}</style>
    </div>
  );
};

export default Landing;
