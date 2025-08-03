import React, { useState } from "react";

// Mock hooks since we can't import the actual context in this demo
const useAuth = () => ({ user: null });
const useTheme = () => ({ isDarkMode: false });

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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
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

  const toggleTheme = () => {
    // This would normally use the theme context
    console.log("Theme toggle - handled by navbar");
  };

  const mockLogin = () => {
    // This would normally use the auth context
    console.log("Login - would redirect to auth");
  };

  const mockLogout = () => {
    // This would normally use the auth context
    console.log("Logout - would clear auth");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Connect. Communicate.
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  {" "}
                  Collaborate.
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Experience the future of team communication with ChatConnect.
                Real-time messaging, secure rooms, and seamless collaboration -
                all in one powerful platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                {user ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => console.log("Navigate to dashboard")}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Go to Dashboard
                    </button>
                    <span className="flex items-center text-gray-600 dark:text-gray-300">
                      Welcome, {user.name}!
                      <button
                        onClick={mockLogout}
                        className="ml-2 text-sm underline"
                      >
                        Logout
                      </button>
                    </span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={mockLogin}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Start Free Trial
                    </button>
                    <button
                      onClick={mockLogin}
                      className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border-2 border-blue-600 dark:border-blue-400"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  No credit card required
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  14-day free trial
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  24/7 support
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-50 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full opacity-50 animate-pulse delay-2000"></div>
        </section>

        {/* Stats Section */}
        <section className="bg-white dark:bg-gray-800 py-16 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  50K+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Active Users
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  99.9%
                </div>
                <div className="text-gray-600 dark:text-gray-400">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  10M+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Messages Sent
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  150+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Countries
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Everything you need to build strong team connections and boost
                productivity
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-200">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Real-time Messaging
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Lightning-fast message delivery with WebSocket technology. No
                  delays, no lag - just instant communication.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-200">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Smart Room Management
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Create public or private rooms, set permissions, and organize
                  conversations by topics or teams.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-200">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  User Presence
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  See who's online, away, or busy. Know when your teammates are
                  available for collaboration.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-200">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Enterprise Security
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  End-to-end encryption, SSO integration, and compliance with
                  industry security standards.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-200">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">📁</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  File Sharing
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Share documents, images, and files seamlessly with
                  drag-and-drop functionality.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-200">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Advanced Search
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Find any message, file, or conversation instantly with our
                  powerful search capabilities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Join thousands of teams who trust ChatConnect
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl transition-colors duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Sarah Johnson
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Product Manager, TechCorp
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "ChatConnect has revolutionized how our team communicates. The
                  real-time features are incredible and the interface is so
                  intuitive."
                </p>
                <div className="flex text-yellow-400 mt-4">★★★★★</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl transition-colors duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Mike Chen
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      CTO, StartupXYZ
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "The security features give us peace of mind, and the
                  performance is outstanding. Highly recommended for any growing
                  team."
                </p>
                <div className="flex text-yellow-400 mt-4">★★★★★</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl transition-colors duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Anna Rodriguez
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Team Lead, DesignStudio
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "We've tried many chat platforms, but ChatConnect's room
                  management and file sharing capabilities are unmatched."
                </p>
                <div className="flex text-yellow-400 mt-4">★★★★★</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Choose the plan that fits your team's needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-colors duration-200">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Starter
                  </h3>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                    $0
                    <span className="text-lg text-gray-600 dark:text-gray-400">
                      /month
                    </span>
                  </div>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>Up to 10
                      users
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>5 chat rooms
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>Basic file
                      sharing
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>Email
                      support
                    </li>
                  </ul>
                  <button
                    onClick={mockLogin}
                    className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Get Started Free
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-2 border-blue-500 relative transition-colors duration-200">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Professional
                  </h3>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                    $15
                    <span className="text-lg text-gray-600 dark:text-gray-400">
                      /month
                    </span>
                  </div>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>Up to 100
                      users
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>Unlimited
                      rooms
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>Advanced
                      file sharing
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>Priority
                      support
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>Analytics
                      dashboard
                    </li>
                  </ul>
                  <button
                    onClick={mockLogin}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Start Free Trial
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-colors duration-200">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Enterprise
                  </h3>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                    $50
                    <span className="text-lg text-gray-600 dark:text-gray-400">
                      /month
                    </span>
                  </div>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>Unlimited
                      users
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>Advanced
                      security
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>SSO
                      integration
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>24/7 phone
                      support
                    </li>
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>Custom
                      integrations
                    </li>
                  </ul>
                  <button
                    onClick={mockLogin}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Get answers to common questions about ChatConnect
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-colors duration-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  How secure is ChatConnect?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  ChatConnect uses end-to-end encryption for all messages and
                  files. We're SOC 2 compliant and follow industry best
                  practices for data security.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-colors duration-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Can I integrate ChatConnect with other tools?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! ChatConnect offers integrations with popular tools like
                  Slack, Microsoft Teams, Google Workspace, and many more
                  through our API.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-colors duration-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Is there a mobile app?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  ChatConnect is fully responsive and works great on mobile
                  browsers. Native iOS and Android apps are coming soon!
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-colors duration-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What's included in the free trial?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  The 14-day free trial includes full access to Professional
                  plan features with no limitations or credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section
          id="feedback"
          className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 transition-colors duration-200"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                We'd Love Your Feedback
              </h2>
              <p className="text-xl text-blue-100 dark:text-blue-200">
                Help us improve ChatConnect by sharing your thoughts and
                suggestions
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl transition-colors duration-200">
              {submitMessage ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-green-600 dark:text-green-400">
                      ✓
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Thank You!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {submitMessage}
                  </p>
                  <button
                    onClick={() => setSubmitMessage("")}
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit}>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={feedbackForm.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={feedbackForm.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="your.email@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={feedbackForm.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={feedbackForm.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="general">General Feedback</option>
                        <option value="feature">Feature Request</option>
                        <option value="bug">Bug Report</option>
                        <option value="support">Support Question</option>
                        <option value="partnership">Partnership Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating
                    </label>
                    <div className="flex items-center space-x-2">
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
                          className={`text-2xl ${
                            star <= feedbackForm.rating
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          } hover:text-yellow-400 transition-colors`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        ({feedbackForm.rating}/5)
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={feedbackForm.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Share your thoughts, suggestions, or questions..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Feedback"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <span className="ml-2 text-xl font-bold">ChatConnect</span>
                </div>
                <p className="text-gray-400 dark:text-gray-500">
                  Connecting teams worldwide with powerful, secure communication
                  tools.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                  <li>
                    <a
                      href="#features"
                      className="hover:text-white transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pricing"
                      className="hover:text-white transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      API Docs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Integrations
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Mobile Apps
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      System Requirements
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Press Kit
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Community
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Status Page
                    </a>
                  </li>
                  <li>
                    <a
                      href="#feedback"
                      className="hover:text-white transition-colors"
                    >
                      Contact Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 dark:border-gray-700 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex space-x-6 mb-4 md:mb-0">
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
                  >
                    GDPR
                  </a>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 dark:text-gray-500">
                    Follow us:
                  </span>
                  <div className="flex space-x-3">
                    <a
                      href="#"
                      className="w-8 h-8 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <span className="text-sm">𝕏</span>
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <span className="text-sm">in</span>
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <span className="text-sm">f</span>
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <span className="text-sm">@</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center text-gray-400 dark:text-gray-500">
                <p>
                  &copy; 2025 ChatConnect. All rights reserved. Made with ❤️ for
                  better team communication.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
