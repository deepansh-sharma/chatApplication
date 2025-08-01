import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Dashboard = () => {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const createRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      setError("Please enter a room name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/rooms/create",
        {
          name: roomName,
        }
      );

      const { room } = response.data;
      navigate(`/room/${room.roomId}`);
    } catch (error) {
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

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/rooms/${roomId}`
      );
      navigate(`/room/${roomId}`);
    } catch (error) {
      if (error.response?.status === 404) {
        setError("Room not found");
      } else {
        setError("Failed to join room");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>Welcome to your Dashboard, {user.username}!</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-section">
        <h2>Create a New Room</h2>
        <form onSubmit={createRoom} className="room-form">
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Room"}
          </button>
        </form>
      </div>

      <div className="dashboard-section">
        <h2>Join Existing Room</h2>
        <form onSubmit={joinRoom} className="join-room-form">
          <input
            type="text"
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Room"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
