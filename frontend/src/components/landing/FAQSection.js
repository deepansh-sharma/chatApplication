import React, { useState } from "react";

const FAQItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50">
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
};

const FAQSection = () => {
  const faqs = [
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
  ];

  return (
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
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
