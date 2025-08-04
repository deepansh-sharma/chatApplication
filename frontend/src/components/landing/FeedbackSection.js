import React, { useState } from "react";

const FeedbackForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    rating: 5,
    category: "general",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
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
            value={formData.email}
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
            value={formData.company}
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
            value={formData.category}
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
              onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
              className={`text-3xl transition-all duration-300 transform hover:scale-110 ${
                star <= formData.rating
                  ? "text-yellow-400 animate-pulse"
                  : "text-gray-300 dark:text-gray-600 hover:text-yellow-300"
              }`}
            >
              ★
            </button>
          ))}
          <span className="ml-3 text-sm font-medium text-gray-600 dark:text-gray-400">
            ({formData.rating}/5 stars)
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Message *
        </label>
        <textarea
          name="message"
          value={formData.message}
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
  );
};

const SuccessMessage = ({ message, onReset }) => (
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
    <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
    <button
      onClick={onReset}
      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-300 font-medium transform hover:scale-105 shadow-lg"
    >
      Send Another Message
    </button>
  </div>
);

const FeedbackSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleFeedbackSubmit = async (formData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setSubmitMessage(
        "Thank you for your feedback! We'll get back to you soon."
      );
      setIsSubmitting(false);
    }, 1000);
  };

  const resetForm = () => {
    setSubmitMessage("");
  };

  return (
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
            Help us improve ChatConnect by sharing your thoughts and suggestions
          </p>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
          {submitMessage ? (
            <SuccessMessage message={submitMessage} onReset={resetForm} />
          ) : (
            <FeedbackForm
              onSubmit={handleFeedbackSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
