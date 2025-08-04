import React from "react";

const PricingSection = ({ mockLogin }) => {
  const plans = [
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
  ];

  const getButtonText = (index) => {
    const texts = ["Get Started Free", "Start Free Trial", "Contact Sales"];
    return texts[index];
  };

  return (
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
          {plans.map((plan, index) => (
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
                  {getButtonText(index)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
