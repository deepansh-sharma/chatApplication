const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/rooms", require("./routes/rooms"));

// Socket.IO connection handling
const rooms = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("join-room", ({ roomId, userId, username }) => {
    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add({ userId, username, socketId: socket.id });

    // Notify others in the room
    socket.to(roomId).emit("user-joined", { userId, username });

    // Send current users list
    const roomUsers = Array.from(rooms.get(roomId));
    io.to(roomId).emit("room-users", roomUsers);
  });

  // Handle messages
  socket.on("send-message", ({ roomId, message, userId, username }) => {
    const messageData = {
      id: Date.now(),
      message,
      userId,
      username,
      timestamp: new Date(),
    };

    io.to(roomId).emit("receive-message", messageData);
  });

  // Leave room
  socket.on("leave-room", ({ roomId, userId, username }) => {
    socket.leave(roomId);

    if (rooms.has(roomId)) {
      const roomUsers = rooms.get(roomId);
      roomUsers.forEach((user) => {
        if (user.socketId === socket.id) {
          roomUsers.delete(user);
        }
      });

      if (roomUsers.size === 0) {
        rooms.delete(roomId);
      } else {
        socket.to(roomId).emit("user-left", { userId, username });
        const updatedUsers = Array.from(roomUsers);
        io.to(roomId).emit("room-users", updatedUsers);
      }
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove user from all rooms
    rooms.forEach((roomUsers, roomId) => {
      roomUsers.forEach((user) => {
        if (user.socketId === socket.id) {
          roomUsers.delete(user);
          socket.to(roomId).emit("user-left", {
            userId: user.userId,
            username: user.username,
          });

          if (roomUsers.size === 0) {
            rooms.delete(roomId);
          } else {
            const updatedUsers = Array.from(roomUsers);
            io.to(roomId).emit("room-users", updatedUsers);
          }
        }
      });
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
