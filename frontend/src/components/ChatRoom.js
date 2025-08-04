import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import socketManager from "../utils/socket";
import ConfirmationModal from "./ConfirmationModal.js";

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 mx-auto mb-4"></div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Connecting to room...
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        Please wait while we set up your chat experience
      </p>
    </div>
  </div>
);

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomUsers, setRoomUsers] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState({});
  const [showUsersList, setShowUsersList] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { roomId } = useParams();
  const { user, apiClient } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    let socket = null;

    const initializeRoom = async () => {
      try {
        // Fetch room info first
        const response = await fetch(
          `http://localhost:5000/api/rooms/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Room not found");
        const data = await response.json();

        if (!isMounted) return;
        setRoomInfo(data.room);

        // Initialize socket only once
        socket = socketManager.connect();
        socketRef.current = socket;

        // Socket event handlers with duplicate prevention
        const handleChatHistory = (history) => {
          if (isMounted) {
            setMessages(history);
            setLoading(false); // Stop loading ONLY after history is received
          }
        };
        const handleConnect = () => {
          if (isMounted) {
            setIsConnected(true);
            console.log("Socket connected");
          }
        };

        const handleDisconnect = () => {
          if (isMounted) {
            setIsConnected(false);
            console.log("Socket disconnected");
          }
        };

        const handleReceiveMessage = (messageData) => {
          if (!isMounted) return;

          setMessages((prev) => {
            // Check if message already exists to prevent duplicates
            const messageExists = prev.some(
              (msg) =>
                msg.id === messageData.id ||
                (msg.message === messageData.message &&
                  msg.userId === messageData.userId &&
                  Math.abs(
                    new Date(msg.timestamp) - new Date(messageData.timestamp)
                  ) < 1000)
            );

            if (messageExists) {
              console.log("Duplicate message prevented:", messageData);
              return prev;
            }

            return [
              ...prev,
              {
                ...messageData,
                id: messageData.id || `msg-${Date.now()}-${Math.random()}`,
                timestamp: messageData.timestamp || new Date(),
              },
            ];
          });
        };

        const handleUserJoined = (userData) => {
          if (!isMounted) return;

          setMessages((prev) => [
            ...prev,
            {
              id: `system-join-${userData.userId}-${Date.now()}`,
              message: `${userData.username} joined the conversation`,
              system: true,
              timestamp: new Date(),
              type: "join",
            },
          ]);
        };

        const handleUserLeft = (userData) => {
          if (!isMounted) return;

          setMessages((prev) => [
            ...prev,
            {
              id: `system-leave-${userData.userId}-${Date.now()}`,
              message: `${userData.username} left the conversation`,
              system: true,
              timestamp: new Date(),
              type: "leave",
            },
          ]);
        };

        const handleRoomUsers = (users) => {
          if (!isMounted) return;

          // Remove duplicates based on userId
          const uniqueUsers = users.filter(
            (user, index, self) =>
              index === self.findIndex((u) => u.userId === user.userId)
          );

          console.log("Room users updated:", uniqueUsers);
          setRoomUsers(uniqueUsers);
        };

        const handleUserTyping = ({ userId, username, isTyping: typing }) => {
          if (!isMounted || userId === user.id) return;

          setIsTyping((prev) => ({
            ...prev,
            [userId]: typing ? username : undefined,
          }));
        };

        // Remove any existing listeners first
        socket.off("connect");
        socket.off("disconnect");
        socket.off("receive-message");
        socket.off("user-joined");
        socket.off("user-left");
        socket.off("room-users");
        socket.off("user-typing");
        socket.off("chat-history");

        // Attach event listeners

        socket.on("connect", handleConnect);
        socket.on("chat-history", handleChatHistory);
        socket.on("disconnect", handleDisconnect);
        socket.on("receive-message", handleReceiveMessage);
        socket.on("user-joined", handleUserJoined);
        socket.on("user-left", handleUserLeft);
        socket.on("room-users", handleRoomUsers);
        socket.on("user-typing", handleUserTyping);

        // Join room only if we have a valid connection
        if (socket.connected) {
          socket.emit("join-room", {
            roomId,
            userId: user.id,
            username: user.username,
          });
        } else {
          socket.on("connect", () => {
            socket.emit("join-room", {
              roomId,
              userId: user.id,
              username: user.username,
            });
          });
        }

        // Set loading to false after ensuring connection
        // setTimeout(() => {
        //   if (isMounted) {
        //     setLoading(false);
        //   }
        // }, 1000);
      } catch (error) {
        console.error("Error initializing room:", error);
        if (isMounted) {
          navigate("/dashboard");
        }
      }
    };

    initializeRoom();

    // Cleanup function
    return () => {
      isMounted = false;

      if (socket) {
        console.log("Cleaning up socket connection");

        // Remove all listeners
        socket.off("chat-history");
        socket.off("connect");
        socket.off("disconnect");
        socket.off("receive-message");
        socket.off("user-joined");
        socket.off("user-left");
        socket.off("room-users");
        socket.off("user-typing");

        // Leave room before disconnecting
        socket.emit("leave-room", {
          roomId,
          userId: user.id,
          username: user.username,
        });

        socketManager.disconnect();
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [roomId, user?.id, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTyping = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("typing", {
        roomId,
        userId: user.id,
        username: user.username,
        isTyping: true,
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.emit("typing", {
            roomId,
            userId: user.id,
            username: user.username,
            isTyping: false,
          });
        }
      }, 2000);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current || !isConnected) return;

    socketRef.current.emit("send-message", {
      roomId,
      message: newMessage.trim(),
      userId: user.id,
      username: user.username,
    });

    setNewMessage("");

    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socketRef.current.emit("typing", {
        roomId,
        userId: user.id,
        username: user.username,
        isTyping: false,
      });
    }
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit("leave-room", {
        roomId,
        userId: user.id,
        username: user.username,
      });
    }
    navigate("/dashboard");
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const getTypingUsers = () => {
    const typingUsers = Object.values(isTyping).filter(Boolean);
    if (typingUsers.length === 0) return "";
    if (typingUsers.length === 1) return `${typingUsers[0]} is typing...`;
    if (typingUsers.length === 2)
      return `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
    return `${typingUsers.slice(0, -1).join(", ")}, and ${
      typingUsers[typingUsers.length - 1]
    } are typing...`;
  };

  const handleDeleteRoom = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete(`/rooms/${roomId}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to delete room:", error);
      alert(
        error.response?.data?.message ||
          "Failed to delete the room. Please try again."
      );
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const getUserInitials = (username) => {
    if (!username) return "?";
    return username.charAt(0).toUpperCase();
  };

  const getUserColor = (userId) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-teal-500",
    ];
    const index = userId ? userId.toString().charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteRoom}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone and all messages will be permanently lost."
        confirmText="Delete Room"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile back button */}
            <button
              onClick={leaveRoom}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {roomInfo?.name || "Chat Room"}
                </h1>
                <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-mono">#{roomId}</span>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-1.5 ${
                        isConnected ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span>{isConnected ? "Connected" : "Reconnecting..."}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile users button */}
            <button
              onClick={() => setShowUsersList(!showUsersList)}
              className="lg:hidden flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              {roomUsers.length}
            </button>

            {/* Desktop user count */}
            <div className="hidden lg:flex items-center text-sm text-gray-600 dark:text-gray-300">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              {roomUsers.length} {roomUsers.length === 1 ? "member" : "members"}
            </div>

            {/* Delete room button - only show for room creator */}
            {roomInfo?.createdBy?._id === user.id && (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isDeleting}
                className="hidden lg:flex items-center px-4 py-2 text-sm font-medium text-red-700 dark:text-red-500 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}

            {/* Leave room button */}
            <button
              onClick={leaveRoom}
              className="hidden lg:flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Leave Room
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Messages Area */}
        <main className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message, index) => {
                const prevMessage = messages[index - 1];
                const showDate =
                  !prevMessage ||
                  formatDate(message.timestamp) !==
                    formatDate(prevMessage.timestamp);
                const showAvatar =
                  !prevMessage ||
                  prevMessage.userId !== message.userId ||
                  prevMessage.system !== message.system ||
                  new Date(message.timestamp) -
                    new Date(prevMessage.timestamp) >
                    300000; // 5 minutes

                return (
                  <div key={message.id}>
                    {/* Date Divider */}
                    {showDate && (
                      <div className="flex justify-center my-6">
                        <span className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                    )}

                    {/* Message */}
                    <div
                      className={`flex ${
                        message.system
                          ? "justify-center"
                          : message.userId === user.id
                          ? "justify-end"
                          : "justify-start"
                      } ${showAvatar ? "mt-6" : "mt-1"}`}
                    >
                      {message.system ? (
                        // System Message
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              message.type === "join"
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "bg-red-100 dark:bg-red-900/30"
                            }`}
                          >
                            {message.type === "join" ? (
                              <svg
                                className="w-3 h-3 text-green-600 dark:text-green-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-3 h-3 text-red-600 dark:text-red-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {message.message}
                          </span>
                        </div>
                      ) : (
                        // Regular Message
                        <div
                          className={`flex ${
                            message.userId === user.id
                              ? "flex-row-reverse"
                              : "flex-row"
                          } items-end space-x-3 max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl`}
                        >
                          {/* Avatar */}
                          {showAvatar && message.userId !== user.id && (
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getUserColor(
                                message.userId
                              )}`}
                            >
                              {getUserInitials(message.username)}
                            </div>
                          )}

                          <div
                            className={`${
                              message.userId === user.id ? "mr-3" : "ml-3"
                            } flex-1`}
                          >
                            {/* Username and timestamp */}
                            {showAvatar && (
                              <div
                                className={`flex items-center space-x-2 mb-1 ${
                                  message.userId === user.id
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {message.userId === user.id
                                    ? "You"
                                    : message.username}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                            )}

                            {/* Message bubble */}
                            <div
                              className={`px-4 py-3 rounded-2xl ${
                                message.userId === user.id
                                  ? "bg-blue-600 text-white"
                                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-sm"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                {message.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {getTypingUsers() && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {getTypingUsers()}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 transition-colors duration-200">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={sendMessage} className="flex items-end space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(e);
                        }
                      }}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                      placeholder={
                        isConnected ? "Type your message..." : "Connecting..."
                      }
                      maxLength={500}
                      disabled={!isConnected}
                    />

                    {/* Character count */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {newMessage.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Connection status */}
                  {!isConnected && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 px-4">
                      Connection lost. Trying to reconnect...
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!newMessage.trim() || !isConnected}
                  className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 transform hover:scale-105 active:scale-95"
                >
                  <svg
                    className="w-5 h-5 transform rotate-45"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </main>

        {/* Users Sidebar - Desktop */}
        <aside className="hidden lg:block w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Room Members
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {roomUsers.length}{" "}
                {roomUsers.length === 1 ? "member" : "members"} online
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {roomUsers.map((roomUser, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getUserColor(
                          roomUser.userId
                        )}`}
                      >
                        {getUserInitials(roomUser.username)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {roomUser.username}
                        {roomUser.userId === user.id && (
                          <span className="text-blue-600 dark:text-blue-400 ml-2">
                            (You)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Online
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {roomUsers.length === 0 && (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No members
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Members will appear here when they join.
                  </p>
                </div>
              )}
            </div>

            {/* Room Info */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Room Information
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Room ID
                  </span>
                  <div className="mt-1 font-mono text-sm bg-white dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                    {roomId}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Status
                  </span>
                  <div className="mt-1 flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        isConnected ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {isConnected ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Users List Overlay */}
        {showUsersList && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setShowUsersList(false)}
          >
            <div
              className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Room Members
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {roomUsers.length} members online
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUsersList(false)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-3">
                    {roomUsers.map((roomUser, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="relative">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getUserColor(
                              roomUser.userId
                            )}`}
                          >
                            {getUserInitials(roomUser.username)}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {roomUser.username}
                            {roomUser.userId === user.id && (
                              <span className="text-blue-600 dark:text-blue-400 ml-2">
                                (You)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Online
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {roomUsers.length === 0 && (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        No members
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Members will appear here when they join.
                      </p>
                    </div>
                  )}
                </div>

                {/* Room Info in Mobile */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Room Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Room ID
                      </span>
                      <div className="mt-1 font-mono text-sm bg-white dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                        {roomId}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Status
                      </span>
                      <div className="mt-1 flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            isConnected ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {isConnected ? "Connected" : "Disconnected"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
