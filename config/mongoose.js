const mongoose = require("mongoose");
try {
  mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
} catch {
  console.log("error in connecting to db");
}
const db = mongoose.connection;
db.on("error", function () {
  console.log("error in connecting to mongodb");
});

db.once("open", function () {
  console.log("connected to mongodb ");
});

module.exports = db;
