const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');
const PORT = 8080;
const dotenv = require("dotenv");
dotenv.config(); 

const connectDB = require("./utility/dbConnection");
connectDB();

const AuthRouter = require("./routers/AuthRouter");
const DiscoverRouter = require("./routers/DiscoverRouter");
const MovieRouter = require("./routers/MovieRouter");
const TvRouter = require("./routers/TvRouter");
const VideoRouter = require("./routers/VideoRouter");
const UserRouter = require("./routers/UserRouter");


app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRouter);
app.use("/api/discover", DiscoverRouter);
app.use("/api/movies", MovieRouter);
app.use("/api/tv", TvRouter);
app.use("/api/video", VideoRouter);
app.use("/api/user", UserRouter);




app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
})



