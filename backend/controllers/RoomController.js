const RoomModel = require("../models/RoomModel");
const crypto = require("crypto");

const createRoom = async (req, res) => {
    try {
        const { movieId, mediaType, movieName, posterPath, description } = req.body;

        if (!movieId || !mediaType || !movieName) {
            return res.status(400).json({
                status: "failure",
                message: "movieId, mediaType, and movieName are required"
            });
        }

        const roomId = crypto.randomUUID();

        const newRoom = await RoomModel.create({
            roomId,
            movieId,
            mediaType,
            movieName,
            posterPath,
            description,
            host: req.user._id,
            playbackState: {
                isPlaying: false,
                currentTime: 0,
                lastUpdated: new Date()
            }
        });

        return res.status(201).json({
            status: "success",
            room: newRoom
        });
    } catch (err) {
        return res.status(500).json({
            status: "failure",
            message: err.message
        });
    }
};

const getRoomDetails = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await RoomModel.findOne({ roomId }).populate("host", "name email");

        if (!room) {
            return res.status(404).json({
                status: "failure",
                message: "Room not found"
            });
        }

        return res.status(200).json({
            status: "success",
            room
        });
    } catch (err) {
        return res.status(500).json({
            status: "failure",
            message: err.message
        });
    }
};

module.exports = {
    createRoom,
    getRoomDetails
};
