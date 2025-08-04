import React from "react";

const Footer = () => {
  const footerSections = [
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
  ];

  const legalLinks = [
    "Privacy Policy",
    "Terms of Service",
    "Cookie Policy",
    "GDPR",
    "Security",
  ];
  const socialIcons = ["𝕏", "in", "f", "@"];

  return (
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
              tools. Join thousands of companies who trust ChatConnect for their
              team collaboration.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
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

          {footerSections.map((section, index) => (
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
              {legalLinks.map((link, index) => (
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
                &copy; 2025 ChatConnect. All rights reserved. Made with ❤️ for
                better team communication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
