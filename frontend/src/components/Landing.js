import React, { useState, useEffect, useRef } from "react";

// Mock hooks since we can't import the actual context in this demo
const useAuth = () => ({ user: null });
const useTheme = () => ({ isDarkMode: false }); // Set to true to show dark theme

const Landing = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    rating: 5,
    category: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothMousePosition, setSmoothMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [isVisible, setIsVisible] = useState({});
  const [activeFeature, setActiveFeature] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef(null);
  const cursorRef = useRef(null);

  const typingTexts = [
    "Connect teams globally",
    "Collaborate in real-time",
    "Communicate securely",
    "Build stronger relationships",
  ];

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Smooth cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth mouse position animation
  useEffect(() => {
    const animateFrame = () => {
      setSmoothMousePosition((prev) => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.1,
        y: prev.y + (mousePosition.y - prev.y) * 0.1,
      }));
    };

    const interval = setInterval(animateFrame, 16); // ~60fps
    return () => clearInterval(interval);
  }, [mousePosition]);

  // Typing animation effect
  useEffect(() => {
    if (!mounted) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    const typeText = () => {
      const currentText = typingTexts[textIndex];

      if (!isDeleting) {
        setTypedText(currentText.substring(0, charIndex + 1));
        charIndex++;

        if (charIndex === currentText.length) {
          isDeleting = true;
          timeout = setTimeout(typeText, 2000);
        } else {
          timeout = setTimeout(typeText, 100);
        }
      } else {
        setTypedText(currentText.substring(0, charIndex - 1));
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % typingTexts.length;
          timeout = setTimeout(typeText, 500);
        } else {
          timeout = setTimeout(typeText, 50);
        }
      }
    };

    timeout = setTimeout(typeText, 1000);
    return () => clearTimeout(timeout);
  }, [mounted]);

  // Feature carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setSubmitMessage(
        "Thank you for your feedback! We'll get back to you soon."
      );
      setFeedbackForm({
        name: "",
        email: "",
        company: "",
        message: "",
        rating: 5,
        category: "general",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const mockLogin = () => {
    console.log("Login - would redirect to auth");
  };

  const features = [
    { icon: "⚡", title: "Real-time Messaging", color: "blue" },
    { icon: "🏠", title: "Smart Room Management", color: "green" },
    { icon: "👥", title: "User Presence", color: "purple" },
    { icon: "🔒", title: "Enterprise Security", color: "red" },
    { icon: "📁", title: "File Sharing", color: "yellow" },
    { icon: "🔍", title: "Advanced Search", color: "indigo" },
  ];

  // Interactive Chat Demo Component
  const ChatDemo = () => {
    const [messages, setMessages] = useState([
      {
        id: 1,
        user: "Sarah",
        message: "Hey team! Ready for the presentation?",
        time: "10:30 AM",
        avatar: "S",
      },
      {
        id: 2,
        user: "Mike",
        message: "Yes! Just finished the slides",
        time: "10:31 AM",
        avatar: "M",
      },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = () => {
      if (!newMessage.trim()) return;

      const message = {
        id: messages.length + 1,
        user: "You",
        message: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "Y",
      };

      setMessages((prev) => [...prev, message]);
      setNewMessage("");

      // Simulate typing indicator
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              user: "Alex",
              message: "Great work everyone! 🎉",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              avatar: "A",
            },
          ]);
        }, 2000);
      }, 500);
    };

    return (
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-md mx-auto transform hover:scale-105 transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200/70 dark:border-gray-600/70">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Team Chat
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              3 online
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-4 h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-start space-x-3 animate-slideInUp"
              style={{ animationDelay: `${msg.id * 0.1}s` }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg ${
                  msg.user === "You"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600"
                    : msg.user === "Sarah"
                    ? "bg-gradient-to-r from-pink-500 to-pink-600"
                    : msg.user === "Mike"
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : "bg-gradient-to-r from-purple-500 to-purple-600"
                }`}
              >
                {msg.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                  <span className="font-medium text-sm text-gray-900 dark:text-white">
                    {msg.user}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {msg.time}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-3 animate-slideInUp">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                A
              </div>
              <div className="flex-1">
                <span className="font-medium text-sm text-gray-900 dark:text-white">
                  Alex
                </span>
                <div className="flex space-x-1 mt-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 w-fit">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Send
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-all duration-300 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-purple-600/30 dark:from-blue-600/20 dark:to-purple-800/20 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-indigo-400/30 to-cyan-600/30 dark:from-indigo-600/20 dark:to-cyan-800/20 rounded-full animate-pulse delay-1000"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>

          {/* Smooth Cursor Tracker */}
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

        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
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
                      {typedText}
                      <span className="animate-blink text-blue-600 dark:text-blue-400">
                        |
                      </span>
                    </p>
                  </div>

                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Experience the future of team communication with
                    ChatConnect. Real-time messaging, secure collaboration, and
                    powerful integrations that scale with your business.
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

              {/* Right Content - Interactive Demo */}
              <div className="flex justify-center lg:justify-end animate-slideInRight">
                <div className="relative">
                  <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-400/10 dark:to-purple-400/10 rounded-3xl blur-2xl animate-pulse"></div>
                  <ChatDemo />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              data-animate
              id="stats"
            >
              {[
                {
                  number: "50K+",
                  label: "Active Users",
                  icon: "👥",
                  color: "blue",
                },
                {
                  number: "99.9%",
                  label: "Uptime",
                  icon: "⚡",
                  color: "green",
                },
                {
                  number: "10M+",
                  label: "Messages",
                  icon: "💬",
                  color: "purple",
                },
                {
                  number: "150+",
                  label: "Countries",
                  icon: "🌍",
                  color: "indigo",
                },
              ].map((stat, index) => (
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
                    className="text-4xl mb-3 animate-bounce"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {stat.icon}
                  </div>
                  <div
                    className={`text-3xl font-bold bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-700 dark:from-${stat.color}-400 dark:to-${stat.color}-500 bg-clip-text text-transparent mb-2`}
                  >
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Features Showcase */}
        <section className="py-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-y border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="text-center mb-16 animate-slideInUp"
              data-animate
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
              {/* Feature Cards */}
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
                            ? "bg-white/20 backdrop-blur-sm animate-pulse"
                            : `bg-gradient-to-r from-${feature.color}-100 to-${feature.color}-200 dark:from-${feature.color}-900/30 dark:to-${feature.color}-800/30`
                        }`}
                      >
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p
                          className={`transition-colors duration-300 ${
                            activeFeature === index
                              ? "text-blue-100"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {index === 0 &&
                            "Lightning-fast message delivery with WebSocket technology"}
                          {index === 1 &&
                            "Create and manage rooms with advanced permissions"}
                          {index === 2 &&
                            "Real-time user status and presence indicators"}
                          {index === 3 &&
                            "End-to-end encryption and enterprise-grade security"}
                          {index === 4 &&
                            "Seamless file sharing with drag-and-drop support"}
                          {index === 5 &&
                            "Find anything instantly with powerful search"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Feature Display */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 dark:from-blue-600/10 dark:to-purple-800/10 rounded-2xl blur-2xl animate-pulse"></div>
                <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                  <div className="text-center space-y-6">
                    <div className="text-6xl animate-bounce">
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
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials */}
        <section className="py-20 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-md border-y border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="text-center mb-16 animate-slideInUp"
              data-animate
              id="testimonials-header"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Loved by Teams Worldwide
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                See what our customers have to say
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Product Manager",
                  company: "TechCorp",
                  avatar: "S",
                  rating: 5,
                  color: "blue",
                  testimonial:
                    "ChatConnect has revolutionized how our team communicates. The real-time features are incredible and the interface is so intuitive.",
                },
                {
                  name: "Mike Chen",
                  role: "CTO",
                  company: "StartupXYZ",
                  avatar: "M",
                  rating: 5,
                  color: "green",
                  testimonial:
                    "The security features give us peace of mind, and the performance is outstanding. Highly recommended for any growing team.",
                },
                {
                  name: "Anna Rodriguez",
                  role: "Team Lead",
                  company: "DesignStudio",
                  avatar: "A",
                  rating: 5,
                  color: "purple",
                  testimonial:
                    "We've tried many chat platforms, but ChatConnect's room management and file sharing capabilities are unmatched.",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 ${
                    isVisible["testimonials-header"]
                      ? "animate-slideInUp"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex items-center mb-6">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r from-${testimonial.color}-500 to-${testimonial.color}-600 dark:from-${testimonial.color}-400 dark:to-${testimonial.color}-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg animate-pulse`}
                    >
                      {testimonial.avatar}
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>

                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                    "{testimonial.testimonial}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Pricing */}
        <section
          id="pricing"
          className="py-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="text-center mb-16 animate-slideInUp"
              data-animate
              id="pricing-header"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Choose the plan that fits your team's needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Starter",
                  price: "$0",
                  features: [
                    "Up to 10 users",
                    "5 chat rooms",
                    "Basic file sharing",
                    "Email support",
                  ],
                  popular: false,
                  color: "gray",
                },
                {
                  name: "Professional",
                  price: "$15",
                  features: [
                    "Up to 100 users",
                    "Unlimited rooms",
                    "Advanced file sharing",
                    "Priority support",
                    "Analytics dashboard",
                  ],
                  popular: true,
                  color: "blue",
                },
                {
                  name: "Enterprise",
                  price: "$50",
                  features: [
                    "Unlimited users",
                    "Advanced security",
                    "SSO integration",
                    "24/7 phone support",
                    "Custom integrations",
                  ],
                  popular: false,
                  color: "purple",
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 ${
                    plan.popular
                      ? "ring-4 ring-blue-500/20 dark:ring-blue-400/20 scale-105"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 text-white px-6 py-2 rounded-full text-sm font-semibold animate-pulse shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {plan.name}
                    </h3>
                    <div
                      className={`text-5xl font-bold bg-gradient-to-r from-${plan.color}-600 to-${plan.color}-700 dark:from-${plan.color}-400 dark:to-${plan.color}-500 bg-clip-text text-transparent mb-6`}
                    >
                      {plan.price}
                      <span className="text-lg text-gray-600 dark:text-gray-400">
                        /month
                      </span>
                    </div>
                    <ul className="text-left space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center text-gray-700 dark:text-gray-300"
                        >
                          <svg
                            className="w-5 h-5 text-green-500 dark:text-green-400 mr-3 animate-pulse"
                            style={{ animationDelay: `${featureIndex * 0.1}s` }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={mockLogin}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      {index === 0
                        ? "Get Started Free"
                        : index === 1
                        ? "Start Free Trial"
                        : "Contact Sales"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced FAQ Section */}
        <section className="py-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md border-y border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="text-center mb-16 animate-slideInUp"
              data-animate
              id="faq-header"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Get answers to common questions about ChatConnect
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "How secure is ChatConnect?",
                  answer:
                    "ChatConnect uses end-to-end encryption for all messages and files. We're SOC 2 compliant and follow industry best practices for data security with regular security audits and penetration testing.",
                },
                {
                  question: "Can I integrate ChatConnect with other tools?",
                  answer:
                    "Yes! ChatConnect offers robust integrations with popular tools like Slack, Microsoft Teams, Google Workspace, Jira, Trello, and many more through our comprehensive API and webhook system.",
                },
                {
                  question: "Is there a mobile app?",
                  answer:
                    "ChatConnect is fully responsive and works seamlessly on mobile browsers. Our native iOS and Android apps are launching Q2 2025 with full feature parity and offline message sync.",
                },
                {
                  question: "What's included in the free trial?",
                  answer:
                    "The 14-day free trial includes full access to Professional plan features with no limitations, no credit card required, and includes priority email support to help you get started.",
                },
                {
                  question: "How does file sharing work?",
                  answer:
                    "Upload files up to 100MB via drag-and-drop or click-to-browse. Files are encrypted in transit and at rest, with automatic virus scanning and preview support for 50+ file types.",
                },
                {
                  question: "Can I customize ChatConnect for my brand?",
                  answer:
                    "Enterprise customers can customize colors, logos, and domain names. We also offer white-label solutions and custom integrations for larger organizations.",
                },
              ].map((faq, index) => {
                const [isOpen, setIsOpen] = useState(false);

                return (
                  <div
                    key={index}
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50/80 dark:hover:bg-gray-700/80 rounded-xl transition-all duration-300"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                        {faq.question}
                      </h3>
                      <svg
                        className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enhanced Feedback Section */}
        <section
          id="feedback"
          className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-700 dark:via-purple-700 dark:to-indigo-700 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-floatSlow"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-floatSlow delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-floatSlow delay-2000"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                We'd Love Your Feedback
              </h2>
              <p className="text-xl text-blue-100 dark:text-blue-200">
                Help us improve ChatConnect by sharing your thoughts and
                suggestions
              </p>
            </div>

            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
              {submitMessage ? (
                <div className="text-center py-8 animate-slideInUp">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <svg
                      className="w-10 h-10 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Thank You!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {submitMessage}
                  </p>
                  <button
                    onClick={() => setSubmitMessage("")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-300 font-medium transform hover:scale-105 shadow-lg"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={feedbackForm.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={feedbackForm.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="your.email@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={feedbackForm.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Your company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Category
                      </label>
                      <select
                        name="category"
                        value={feedbackForm.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      >
                        <option value="general">General Feedback</option>
                        <option value="feature">Feature Request</option>
                        <option value="bug">Bug Report</option>
                        <option value="support">Support Question</option>
                        <option value="partnership">Partnership Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      How would you rate your interest?
                    </label>
                    <div className="flex items-center space-x-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setFeedbackForm((prev) => ({
                              ...prev,
                              rating: star,
                            }))
                          }
                          className={`text-3xl transition-all duration-300 transform hover:scale-110 ${
                            star <= feedbackForm.rating
                              ? "text-yellow-400 animate-pulse"
                              : "text-gray-300 dark:text-gray-600 hover:text-yellow-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="ml-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                        ({feedbackForm.rating}/5 stars)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={feedbackForm.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                      placeholder="Share your thoughts, suggestions, or questions. We'd love to hear from you!"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send Feedback"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-black text-white py-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-5 gap-8 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">C</span>
                  </div>
                  <span className="ml-3 text-2xl font-bold">ChatConnect</span>
                </div>
                <p className="text-gray-400 dark:text-gray-500 mb-6 leading-relaxed">
                  Connecting teams worldwide with powerful, secure communication
                  tools. Join thousands of companies who trust ChatConnect for
                  their team collaboration.
                </p>
                <div className="flex space-x-4">
                  {["𝕏", "in", "f", "@"].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className="w-10 h-10 bg-gray-800 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                    >
                      <span className="text-sm font-bold">{social}</span>
                    </a>
                  ))}
                </div>
              </div>

              {[
                {
                  title: "Product",
                  links: [
                    "Features",
                    "Pricing",
                    "API Docs",
                    "Integrations",
                    "Mobile Apps",
                    "System Requirements",
                  ],
                },
                {
                  title: "Company",
                  links: [
                    "About Us",
                    "Careers",
                    "Press Kit",
                    "Contact",
                    "Blog",
                    "Investors",
                  ],
                },
                {
                  title: "Support",
                  links: [
                    "Help Center",
                    "Community",
                    "Status Page",
                    "Contact Support",
                    "Training",
                    "Certification",
                  ],
                },
              ].map((section, index) => (
                <div key={index}>
                  <h4 className="text-lg font-semibold mb-6 text-white">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href="#"
                          className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800 dark:border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-sm">
                  {[
                    "Privacy Policy",
                    "Terms of Service",
                    "Cookie Policy",
                    "GDPR",
                    "Security",
                  ].map((link, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  ))}
                </div>

                <div className="text-center text-gray-400 dark:text-gray-500">
                  <p>
                    &copy; 2025 ChatConnect. All rights reserved. Made with ❤️
                    for better team communication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

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

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 3s ease infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 1s infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Landing;
