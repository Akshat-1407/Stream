const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser");

dotenv.config(); 

/**************** db connection *****************/
const dbLink = "mongodb://127.0.0.1:27017/mailSender";

mongoose.connect(dbLink)
    .then(function (connection) {
        console.log("connected to db")
    }).catch(err => console.log(err))

/***********************************************/

const AuthRouter = require("./routers/AuthRouter");
const DiscoverRouter = require("./routers/DiscoverRouter");
const MovieRouter = require("./routers/MovieRouter");
const TvRouter = require("./routers/TvRouter");
const VideoRouter = require("./routers/VideoRouter");
const UserRouter = require("./routers/UserRouter");



app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRouter);
app.use("/api/discover", DiscoverRouter);
app.use("/api/movies", MovieRouter);
app.use("/api/tv", TvRouter);
app.use("/api/video", VideoRouter);
app.use("/api/user", UserRouter);




app.listen(3000, function () {
    console.log("Server started on port 3000");
})



