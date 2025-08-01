import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import socketManager from "../utils/socket";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomUsers, setRoomUsers] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const initializeRoom = async () => {
      try {
        // Fetch room info
        const response = await fetch(
          `http://localhost:5000/api/rooms/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Room not found");
        }

        const data = await response.json();
        setRoomInfo(data.room);

        // Initialize socket connection
        socketRef.current = socketManager.connect();
        const socket = socketRef.current;

        // Join room
        socket.emit("join-room", {
          roomId,
          userId: user.id,
          username: user.username,
        });

        // Socket event listeners
        socket.on("receive-message", (messageData) => {
          setMessages((prev) => [...prev, messageData]);
        });

        socket.on("user-joined", (userData) => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              message: `${userData.username} joined the room`,
              system: true,
              timestamp: new Date(),
            },
          ]);
        });

        socket.on("user-left", (userData) => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              message: `${userData.username} left the room`,
              system: true,
              timestamp: new Date(),
            },
          ]);
        });

        socket.on("room-users", (users) => {
          setRoomUsers(users);
        });

        setLoading(false);
      } catch (error) {
        console.error("Error initializing room:", error);
        navigate("/dashboard");
      }
    };

    initializeRoom();

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave-room", {
          roomId,
          userId: user.id,
          username: user.username,
        });
        socketManager.disconnect();
      }
    };
  }, [roomId, user, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit("send-message", {
      roomId,
      message: newMessage,
      userId: user.id,
      username: user.username,
    });

    setNewMessage("");
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

  if (loading) {
    return <div className="loading">Loading room...</div>;
  }

  return (
    <div className="chat-room">
      <div className="chat-header">
        <div>
          <h2>{roomInfo?.name || "Chat Room"}</h2>
          <span>Room ID: {roomId}</span>
        </div>
        <button onClick={leaveRoom} className="btn btn-secondary">
          Leave Room
        </button>
      </div>

      <div className="chat-main">
        <div className="messages-container">
          <div className="messages-list">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.system
                    ? "system"
                    : message.userId === user.id
                    ? "own"
                    : "other"
                }`}
              >
                {!message.system && (
                  <div className="message-header">
                    <span className="username">{message.username}</span>
                    <span className="timestamp">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                )}
                <div className="message-content">{message.message}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              maxLength={500}
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        </div>

        <div className="users-sidebar">
          <h3>Online Users ({roomUsers.length})</h3>
          <ul className="users-list">
            {roomUsers.map((roomUser, index) => (
              <li key={index}>
                {roomUser.username}
                {roomUser.userId === user.id && " (You)"}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
