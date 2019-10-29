const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http");
const socketIO = require("socket.io");
//mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/libreria", {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Conectado a la base de datos MongoDB Libreria");
  });

//Settings
const port = process.env.PORT || 3000;

app.use(
  express.json({
    inflate: true,
    reviver: null,
    strict: true,
    type: "application/json"
  })
);

//CORS Middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use(require("./routes/router"));

const server = http.createServer(app);
const io = socketIO(server);

app.set("io", io);

//app.use(express.static(path.join(__dirname, "dist")));

server.listen(port, () => {
  console.log("listen on port" + port);
});
