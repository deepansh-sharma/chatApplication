import React from "react";

const TestimonialsSection = ({ isVisible }) => {
  const testimonials = [
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
  ];

  return (
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
          {testimonials.map((testimonial, index) => (
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
  );
};

export default TestimonialsSection;
