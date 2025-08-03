// src/config/config.js
const config = {
  API_BASE_URL:
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || "http://localhost:5000",
  APP_NAME: process.env.REACT_APP_APP_NAME || "ChatConnect",
  APP_VERSION: process.env.REACT_APP_APP_VERSION || "1.0.0",

  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      ME: "/auth/me",
      REFRESH: "/auth/refresh",
    },
    ROOMS: {
      CREATE: "/rooms/create",
      GET_ALL: "/rooms",
      GET_BY_ID: "/rooms",
      JOIN: "/rooms/join",
      LEAVE: "/rooms/leave",
    },
    MESSAGES: {
      GET_HISTORY: "/messages",
      SEND: "/messages/send",
    },
  },

  // App Settings
  SETTINGS: {
    MESSAGE_MAX_LENGTH: 500,
    ROOM_NAME_MAX_LENGTH: 50,
    USERNAME_MAX_LENGTH: 30,
    PASSWORD_MIN_LENGTH: 6,
    AUTO_SCROLL_THRESHOLD: 100,
  },
};

export default config;
