const mongoose = require("mongoose");;

function connectDB() {
    return mongoose.connect(process.env.DB_URL)
        .then(() => {
            console.log("connected to db...")
        })
        .catch((err) => {
            console.log(err);
        });

}

module.exports = connectDB;