import React, { useState } from "react";

const LoadingIcon = () => (
  <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
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
);

const CreateRoom = ({
  roomName,
  setRoomName,
  createRoom,
  loading,
  setError,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCancel = () => {
    setShowCreateForm(false);
    setRoomName("");
    setError("");
  };

  if (!showCreateForm) {
    return (
      <button
        onClick={() => setShowCreateForm(true)}
        className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
      >
        Create New Room
      </button>
    );
  }

  return (
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
          className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <LoadingIcon /> Creating...
            </>
          ) : (
            "Create"
          )}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const JoinRoom = ({ roomId, setRoomId, joinRoom, joinLoading, setError }) => {
  const [showJoinForm, setShowJoinForm] = useState(false);

  const handleCancel = () => {
    setShowJoinForm(false);
    setRoomId("");
    setError("");
  };

  if (!showJoinForm) {
    return (
      <button
        onClick={() => setShowJoinForm(true)}
        className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
      >
        Join Existing Room
      </button>
    );
  }

  return (
    <form onSubmit={joinRoom} className="space-y-4">
      <input
        type="text"
        placeholder="Enter room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value.toUpperCase())}
        disabled={joinLoading}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 font-mono text-center placeholder-gray-500 dark:placeholder-gray-400"
        maxLength={10}
      />
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={joinLoading || !roomId.trim()}
          className="flex-1 px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {joinLoading ? (
            <>
              <LoadingIcon /> Joining...
            </>
          ) : (
            "Join"
          )}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const RoomActions = (props) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-lg transition-all duration-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
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
      <CreateRoom {...props} />
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-lg transition-all duration-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
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
      <JoinRoom {...props} />
    </div>
  </div>
);

export default RoomActions;
