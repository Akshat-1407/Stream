const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');
const PORT = 8080;
const dotenv = require("dotenv");
dotenv.config(); 

const connectDB = require("./config/dbConnection");
connectDB();

const AuthRouter = require("./routes/AuthRouter");
const DiscoverRouter = require("./routes/DiscoverRouter");
const MovieRouter = require("./routes/MovieRouter");
const TvRouter = require("./routes/TvRouter");
const VideoRouter = require("./routes/VideoRouter");
const UserRouter = require("./routes/UserRouter");
const PaymentRouter = require("./routes/PaymentRouter");


app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/discover", DiscoverRouter);
app.use("/api/movies", MovieRouter);
app.use("/api/tv", TvRouter);
app.use("/api/video", VideoRouter);
app.use("/api/payment", PaymentRouter);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
})



