const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const playbackStateSchema = new mongoose.Schema({
    isPlaying: {
        type: Boolean,
        default: false
    },
    currentTime: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    movieId: {
        type: String,
        required: true
    },
    mediaType: {
        type: String,
        required: true,
        enum: ["movies", "tv", "premium"]
    },
    movieName: {
        type: String,
        required: true
    },
    posterPath: {
        type: String
    },
    description: {
        type: String
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    playbackState: {
        type: playbackStateSchema,
        default: () => ({})
    },
    messages: [chatMessageSchema],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 4  // Auto-delete after 4 hours (MongoDB TTL index)
    }
});

const RoomModel = mongoose.model("Room", roomSchema);

module.exports = RoomModel;
