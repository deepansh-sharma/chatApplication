import React, { useState } from "react";

const ChatDemo = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Sarah",
      message: "Hey team! Ready for the presentation?",
      time: "10:30 AM",
      avatar: "S",
    },
    {
      id: 2,
      user: "Mike",
      message: "Yes! Just finished the slides",
      time: "10:31 AM",
      avatar: "M",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      user: "You",
      message: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: "Y",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            user: "Alex",
            message: "Great work everyone! 🎉",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            avatar: "A",
          },
        ]);
      }, 2000);
    }, 500);
  };

  const getAvatarColor = (user) => {
    const colors = {
      You: "from-blue-500 to-blue-600",
      Sarah: "from-pink-500 to-pink-600",
      Mike: "from-green-500 to-green-600",
      Alex: "from-purple-500 to-purple-600",
    };
    return colors[user] || "from-gray-500 to-gray-600";
  };

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-md mx-auto transform hover:scale-105 transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200/70 dark:border-gray-600/70">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Team Chat
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            3 online
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4 h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex items-start space-x-3 animate-slideInUp"
            style={{ animationDelay: `${msg.id * 0.1}s` }}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg bg-gradient-to-r ${getAvatarColor(
                msg.user
              )}`}
            >
              {msg.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline space-x-2">
                <span className="font-medium text-sm text-gray-900 dark:text-white">
                  {msg.user}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {msg.time}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                {msg.message}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start space-x-3 animate-slideInUp">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg">
              A
            </div>
            <div className="flex-1">
              <span className="font-medium text-sm text-gray-900 dark:text-white">
                Alex
              </span>
              <div className="flex space-x-1 mt-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 w-fit">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatDemo;
