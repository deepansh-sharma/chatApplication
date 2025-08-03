import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import config from "../config/config";

const Dashboard = () => {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentRooms, setRecentRooms] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  const { user, apiClient, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Load recent rooms from localStorage or API
    const savedRooms = localStorage.getItem(`recentRooms_${user?.id}`);
    if (savedRooms) {
      setRecentRooms(JSON.parse(savedRooms));
    }
  }, [user]);

  const saveRecentRoom = (room) => {
    const updatedRooms = [
      room,
      ...recentRooms.filter((r) => r.roomId !== room.roomId),
    ].slice(0, 5); // Keep only 5 recent rooms

    setRecentRooms(updatedRooms);
    localStorage.setItem(
      `recentRooms_${user.id}`,
      JSON.stringify(updatedRooms)
    );
  };

  const createRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      setError("Please enter a room name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post(config.ENDPOINTS.ROOMS.CREATE, {
        name: roomName.trim(),
      });

      const { room } = response.data;

      // Save to recent rooms
      saveRecentRoom({
        roomId: room.roomId,
        name: room.name,
        createdAt: new Date().toISOString(),
      });

      navigate(`/room/${room.roomId}`);
    } catch (error) {
      console.error("Create room error:", error);
      setError(error.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }

    setJoinLoading(true);
    setError("");

    try {
      const response = await apiClient.get(
        `${config.ENDPOINTS.ROOMS.GET_BY_ID}/${roomId.trim().toUpperCase()}`
      );

      const { room } = response.data;

      // Save to recent rooms
      saveRecentRoom({
        roomId: room.roomId,
        name: room.name,
        joinedAt: new Date().toISOString(),
      });

      navigate(`/room/${roomId.trim().toUpperCase()}`);
    } catch (error) {
      console.error("Join room error:", error);
      if (error.response?.status === 404) {
        setError("Room not found. Please check the room ID.");
      } else {
        setError("Failed to join room. Please try again.");
      }
    } finally {
      setJoinLoading(false);
    }
  };

  const joinRecentRoom = (room) => {
    navigate(`/room/${room.roomId}`);
  };

  const clearRecentRooms = () => {
    setRecentRooms([]);
    localStorage.removeItem(`recentRooms_${user.id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Create a new chat room or join an existing one
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online</span>
              </div>

              <ThemeToggle />

              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
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
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <svg
                className="w-5 h-5 text-red-400 dark:text-red-300 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Create Room Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-lg transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-blue-600 dark:text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Create Room
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Start a new chat room
                        </p>
                      </div>
                    </div>
                  </div>

                  {!showCreateForm ? (
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                    >
                      Create New Room
                    </button>
                  ) : (
                    <form onSubmit={createRoom} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Enter room name"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 placeholder-gray-500 dark:placeholder-gray-400"
                        maxLength={50}
                      />
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={loading || !roomName.trim()}
                          className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <svg
                                className="animate-spin w-4 h-4 mr-2"
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
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Creating...
                            </div>
                          ) : (
                            "Create"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCreateForm(false);
                            setRoomName("");
                            setError("");
                          }}
                          className="px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Join Room Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-lg transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Join Room
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Enter an existing room
                        </p>
                      </div>
                    </div>
                  </div>

                  {!showJoinForm ? (
                    <button
                      onClick={() => setShowJoinForm(true)}
                      className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                    >
                      Join Existing Room
                    </button>
                  ) : (
                    <form onSubmit={joinRoom} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Enter room ID"
                        value={roomId}
                        onChange={(e) =>
                          setRoomId(e.target.value.toUpperCase())
                        }
                        disabled={joinLoading}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 font-mono text-center placeholder-gray-500 dark:placeholder-gray-400"
                        maxLength={10}
                      />
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={joinLoading || !roomId.trim()}
                          className="flex-1 px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {joinLoading ? (
                            <div className="flex items-center justify-center">
                              <svg
                                className="animate-spin w-4 h-4 mr-2"
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
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Joining...
                            </div>
                          ) : (
                            "Join"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowJoinForm(false);
                            setRoomId("");
                            setError("");
                          }}
                          className="px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    Real-time Chat
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Instant messaging with live updates
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
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
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    Multi-user
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Chat with multiple people simultaneously
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-pink-600 dark:text-pink-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    Secure
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Protected rooms with unique IDs
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Rooms Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Rooms
                </h3>
                {recentRooms.length > 0 && (
                  <button
                    onClick={clearRecentRooms}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {recentRooms.length > 0 ? (
                <div className="space-y-3">
                  {recentRooms.map((room, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                      onClick={() => joinRecentRoom(room)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {room.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {room.roomId}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDate(room.createdAt || room.joinedAt)}
                        </p>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    No recent rooms
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Rooms you create or join will appear here
                  </p>
                </div>
              )}
            </div>

            {/* User Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Recent Rooms
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {recentRooms.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Account Status
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
