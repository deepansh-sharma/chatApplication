import React from "react";
import { Link } from "react-router-dom";
import config from "../../config/config";

const Logo = () => (
  <Link to="/" className="flex-shrink-0 flex items-center group">
    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
      <span className="text-white font-bold text-xl">C</span>
    </div>
    <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
      {config.APP_NAME}
    </span>
  </Link>
);

export default Logo;
