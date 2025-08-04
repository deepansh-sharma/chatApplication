const express = require("express");
const Room = require("../models/Room");
const auth = require("../middleware/auth");
const Message = require("../models/Message"); // This line was missing

const router = express.Router();

// Create room
router.post("/create", auth, async (req, res) => {
  try {
    const { name } = req.body;
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    const room = new Room({
      roomId,
      name,
      createdBy: req.user._id,
    });

    await room.save();
    res.status(201).json({ room });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get room by ID
router.get("/:roomId", auth, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId }).populate(
      "createdBy",
      "username _id"
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ room });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete room by ID
router.delete("/:roomId", auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Security Check: Ensure the user deleting the room is the one who created it
    if (room.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: You are not authorized to delete this room.",
      });
    }

    // Step 1: Delete all messages in the room
    await Message.deleteMany({ roomId });

    // Step 2: Delete the room itself
    await Room.deleteOne({ roomId });

    res.json({ message: "Room and all messages deleted successfully." });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
