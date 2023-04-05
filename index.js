const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const axios = require("axios");

const fs = require("fs");
const data = require("./db");

// var db;

// fs.readFileSync("db.json", (err, data) => {
//   db = data;
//   console.log('888888', data);
// })

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/db", (req, res) => {
  res.sendFile(__dirname + "/db.json");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    const dbcontent = data;
    const msgObject = {
      msg: {
        content: msg,
        time: Date.now(),
      },
    };
    dbcontent.push(msgObject);

    fs.writeFileSync("db.json", JSON.stringify(dbcontent), (err) => {
      if (err) return console.log("Write file error");
    });
    io.emit("chat message", msg);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
