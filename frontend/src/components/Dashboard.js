import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import config from "../config/config";
import DashboardHeader from "./dashboard/DashboardHeader";
import RoomActions from "./dashboard/RoomActions";
import Sidebar from "./dashboard/Sidebar";

const Dashboard = () => {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentRooms, setRecentRooms] = useState([]);
  const [recentRoomsLoading, setRecentRoomsLoading] = useState(true);
  const [invalidRooms, setInvalidRooms] = useState([]);

  const { user, apiClient } = useAuth();
  const navigate = useNavigate();

  const validateAndSetRecentRooms = useCallback(async () => {
    if (!user?.id) {
      setRecentRooms([]);
      setRecentRoomsLoading(false);
      return;
    }

    setRecentRoomsLoading(true);
    const savedRoomsRaw = localStorage.getItem(`recentRooms_${user.id}`);

    if (savedRoomsRaw) {
      const savedRooms = JSON.parse(savedRoomsRaw);
      if (savedRooms.length > 0) {
        try {
          const roomIds = savedRooms.map((room) => room.roomId);
          const response = await apiClient.post(
            config.ENDPOINTS.ROOMS.VALIDATE,
            { roomIds }
          );
          const { validRoomIds } = response.data;

          const validRooms = savedRooms.filter((room) =>
            validRoomIds.includes(room.roomId)
          );
          const invalidRoomIds = roomIds.filter(
            (id) => !validRoomIds.includes(id)
          );
          setInvalidRooms(invalidRoomIds);

          if (validRooms.length !== savedRooms.length) {
            localStorage.setItem(
              `recentRooms_${user.id}`,
              JSON.stringify(validRooms)
            );
          }
          setRecentRooms(validRooms);
        } catch (error) {
          console.error("Failed to validate recent rooms:", error);
          setRecentRooms(savedRooms); // Fallback to local data on API error
        } finally {
          setRecentRoomsLoading(false);
        }
      } else {
        setRecentRooms([]);
        setRecentRoomsLoading(false);
      }
    } else {
      setRecentRooms([]);
      setRecentRoomsLoading(false);
    }
  }, [user?.id, apiClient]);

  useEffect(() => {
    validateAndSetRecentRooms();
  }, [validateAndSetRecentRooms]);

  const saveRecentRoom = (room) => {
    setRecentRooms((prevRooms) => {
      const updatedRooms = [
        room,
        ...prevRooms.filter((r) => r.roomId !== room.roomId),
      ].slice(0, 10);
      localStorage.setItem(
        `recentRooms_${user.id}`,
        JSON.stringify(updatedRooms)
      );
      return updatedRooms;
    });
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
      saveRecentRoom({
        roomId: room.roomId,
        name: room.name,
        createdAt: new Date().toISOString(),
      });
      navigate(`/room/${room.roomId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create room");
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
      saveRecentRoom({
        roomId: room.roomId,
        name: room.name,
        joinedAt: new Date().toISOString(),
      });
      navigate(`/room/${roomId.trim().toUpperCase()}`);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Room not found. Please check the room ID.");
      } else {
        setError("Failed to join room. Please try again.");
      }
    } finally {
      setJoinLoading(false);
    }
  };

  const joinRecentRoom = async (room) => {
    setError(""); // Clear previous errors
    try {
      // First, check if the room still exists
      await apiClient.get(`${config.ENDPOINTS.ROOMS.GET_BY_ID}/${room.roomId}`);
      // If the above line doesn't throw an error, the room exists, so we can navigate
      navigate(`/room/${room.roomId}`);
    } catch (error) {
      if (error.response?.status === 404) {
        // Room is deleted, mark as invalid and refresh the list
        setInvalidRooms((prev) => [...prev, room.roomId]);
        validateAndSetRecentRooms(); // Re-run validation which will remove it
      } else {
        setError("Could not connect to the room. Please try again later.");
      }
    }
  };

  const clearRecentRooms = () => {
    setRecentRooms([]);
    localStorage.removeItem(`recentRooms_${user.id}`);
  };

  const clearInvalidRooms = () => {
    const validRooms = recentRooms.filter(
      (room) => !invalidRooms.includes(room.roomId)
    );
    setRecentRooms(validRooms);
    localStorage.setItem(`recentRooms_${user.id}`, JSON.stringify(validRooms));
    setInvalidRooms([]);
    setError("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      <DashboardHeader username={user?.username} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <RoomActions
              roomName={roomName}
              setRoomName={setRoomName}
              createRoom={createRoom}
              loading={loading}
              roomId={roomId}
              setRoomId={setRoomId}
              joinRoom={joinRoom}
              joinLoading={joinLoading}
              setError={setError}
            />
          </div>
          <Sidebar
            recentRooms={recentRooms}
            isLoading={recentRoomsLoading}
            joinRecentRoom={joinRecentRoom}
            clearRecentRooms={clearRecentRooms}
            formatDate={formatDate}
            invalidRooms={invalidRooms}
            clearInvalidRooms={clearInvalidRooms}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
