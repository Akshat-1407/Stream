if(process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cookieParser = require("cookie-parser");
const cors = require('cors');
const connectDB = require("./config/dbConnection");

const PORT = process.env.PORT || 8080;

connectDB();

const AuthRouter = require("./routes/AuthRouter");
const DiscoverRouter = require("./routes/DiscoverRouter");
const MovieRouter = require("./routes/MovieRouter");
const TvRouter = require("./routes/TvRouter");
const VideoRouter = require("./routes/VideoRouter");
const UserRouter = require("./routes/UserRouter");
const PaymentRouter = require("./routes/PaymentRouter");
const RoomRouter = require("./routes/RoomRouter");

// Initialize Socket.IO
require("./socket").init(server);

app.use(cors({
  origin: [
    "https://stream-seven-mocha.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/discover", DiscoverRouter);
app.use("/api/rooms", RoomRouter);
app.use("/api/movies", MovieRouter);
app.use("/api/tv", TvRouter);
app.use("/api/video", VideoRouter);
app.use("/api/payment", PaymentRouter);

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
});



