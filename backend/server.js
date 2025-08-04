const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// --- Constants for Buffering ---
const FLUSH_INTERVAL = 10000; // 10 seconds
const BUFFER_SIZE_LIMIT = 20; // messages

// --- State Management ---
const rooms = new Map(); // Stores room data and users
const messageBuffers = new Map(); // Buffers messages for each room
const socketToRoomMap = new Map(); // OPTIMIZATION: Maps socket.id to roomId for fast disconnects

// --- Database Connection ---
connectDB();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use("/api/auth", require("./routes/auth"));
app.use("/api/rooms", require("./routes/rooms"));

// --- Core Functions ---

/**
 * Writes the message buffer for a given room to the database.
 * This is a highly efficient bulk operation.
 * @param {string} roomId The ID of the room to flush.
 */
const flushMessageBuffer = async (roomId) => {
  if (messageBuffers.has(roomId) && messageBuffers.get(roomId).length > 0) {
    const messagesToSave = messageBuffers.get(roomId);
    messageBuffers.set(roomId, []); // Clear buffer immediately to prevent race conditions

    try {
      await Message.insertMany(messagesToSave);
      console.log(
        `[DB] Flushed ${messagesToSave.length} messages for room ${roomId}`
      );
    } catch (error) {
      console.error(`[DB] Error flushing messages for room ${roomId}:`, error);
      // Optional: Re-queue failed messages if necessary
      // const currentBuffer = messageBuffers.get(roomId) || [];
      // messageBuffers.set(roomId, [...messagesToSave, ...currentBuffer]);
    }
  }
};

// Periodically flush all buffers to ensure no messages are left in memory for too long.
setInterval(() => {
  for (const roomId of messageBuffers.keys()) {
    flushMessageBuffer(roomId);
  }
}, FLUSH_INTERVAL);

// --- Socket.IO Connection Logic ---

io.on("connection", (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  socket.on("join-room", async ({ roomId, userId, username }) => {
    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map()); // Use a Map for users for efficient lookups
    }
    rooms.get(roomId).set(socket.id, { userId, username });
    socketToRoomMap.set(socket.id, roomId); // OPTIMIZATION: Track which room this socket is in

    // Fetch and send recent chat history to the joining user
    try {
      const history = await Message.find({ roomId })
        .sort({ createdAt: "asc" })
        .limit(100);
      const formattedHistory = history.map((msg) => ({
        id: msg._id,
        message: msg.message,
        userId: msg.user.userId,
        username: msg.user.username,
        timestamp: msg.createdAt,
      }));
      socket.emit("chat-history", formattedHistory);
    } catch (error) {
      console.error(
        `[DB] Error fetching chat history for room ${roomId}:`,
        error
      );
    }

    // Notify others and update user list
    socket.to(roomId).emit("user-joined", { userId, username });
    io.to(roomId).emit("room-users", Array.from(rooms.get(roomId).values()));
  });

  socket.on("send-message", ({ roomId, message, userId, username }) => {
    // 1. Immediately broadcast the message for a real-time feel
    const displayData = {
      id: `temp-${Date.now()}`, // Temporary ID for client-side key prop
      message,
      userId,
      username,
      timestamp: new Date(),
    };
    io.to(roomId).emit("receive-message", displayData);

    // 2. Prepare the message for database storage (without temporary ID)
    const messageToStore = {
      roomId,
      message,
      user: { userId, username },
    };

    // 3. Add to buffer
    if (!messageBuffers.has(roomId)) {
      messageBuffers.set(roomId, []);
    }
    messageBuffers.get(roomId).push(messageToStore);

    // 4. Flush buffer if it reaches the size limit
    if (messageBuffers.get(roomId).length >= BUFFER_SIZE_LIMIT) {
      flushMessageBuffer(roomId);
    }
  });

  const handleDisconnect = () => {
    const roomId = socketToRoomMap.get(socket.id);
    if (!roomId || !rooms.has(roomId)) return;

    // Flush any pending messages for this room before proceeding
    flushMessageBuffer(roomId);

    const roomUsers = rooms.get(roomId);
    const user = roomUsers.get(socket.id);

    if (user) {
      // Remove user and notify others
      roomUsers.delete(socket.id);
      socket
        .to(roomId)
        .emit("user-left", { userId: user.userId, username: user.username });

      // If the room is now empty, clean up its resources
      if (roomUsers.size === 0) {
        rooms.delete(roomId);
        messageBuffers.delete(roomId); // Also clear the message buffer
        console.log(`[Room] Cleaned up empty room: ${roomId}`);
      } else {
        // Otherwise, just update the user list
        io.to(roomId).emit("room-users", Array.from(roomUsers.values()));
      }
    }
    socketToRoomMap.delete(socket.id);
    console.log(`[Socket] User disconnected: ${socket.id} from room ${roomId}`);
  };

  socket.on("leave-room", handleDisconnect);
  socket.on("disconnect", handleDisconnect);
});

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
