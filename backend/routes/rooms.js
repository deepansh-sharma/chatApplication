const express = require("express");
const Room = require("../models/Room");
const auth = require("../middleware/auth");

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
      "username"
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ room });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
