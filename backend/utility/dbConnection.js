const mongoose = require("mongoose");;
// const { DB_PASSWORD, DB_USER } = process.env;

const uri = "mongodb://localhost:27017/users";

function connectDB() {
    return mongoose.connect(uri)
        .then(() => {
            console.log("connected to db...")
        })
        .catch((err) => {
            console.log(err);
        });

}

module.exports = connectDB;