import React from "react";

const RecentRooms = ({
  recentRooms,
  joinRecentRoom,
  clearRecentRooms,
  formatDate,
  isLoading,
  invalidRooms,
  clearInvalidRooms,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Recent Rooms
      </h3>
      {recentRooms.length > 0 && !isLoading && (
        <button
          onClick={clearRecentRooms}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          Clear All
        </button>
      )}
    </div>

    {isLoading ? (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Validating rooms...
        </p>
      </div>
    ) : recentRooms.length > 0 ? (
      <div className="max-h-48 overflow-y-auto pr-2 space-y-3">
        {invalidRooms.length > 0 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Some rooms are no longer available.
            </p>
            <button
              onClick={clearInvalidRooms}
              className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline"
            >
              Clear them
            </button>
          </div>
        )}
        {recentRooms.map((room) => {
          const isInvalid = invalidRooms.includes(room.roomId);
          return (
            <div
              key={room.roomId}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                isInvalid
                  ? "bg-red-50 dark:bg-red-900/20 opacity-60"
                  : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
              }`}
              onClick={() => !isInvalid && joinRecentRoom(room)}
            >
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium text-gray-900 dark:text-white truncate ${
                    isInvalid ? "line-through" : ""
                  }`}
                >
                  {room.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {room.roomId}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDate(room.createdAt || room.joinedAt)}
                </p>
              </div>
              {!isInvalid && (
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
              )}
              {isInvalid && (
                <span className="text-xs text-red-500 dark:text-red-400">
                  Not Found
                </span>
              )}
            </div>
          );
        })}
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
);

const UserStats = ({ recentRooms }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Your Stats
    </h3>
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Recent Rooms</span>
        <span className="font-semibold text-gray-900 dark:text-white">
          {recentRooms.length}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Account Status</span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
          Active
        </span>
      </div>
    </div>
  </div>
);

const Sidebar = (props) => (
  <div className="space-y-6">
    <RecentRooms {...props} />
    <UserStats {...props} />
  </div>
);

export default Sidebar;
