const express = require("express");
const app = express();
const webSocket = require("./js/socket");
const cors = require("cors");

const Rooms = require("./js/rooms");
const rooms = new Rooms();
const MySQL = require('./js/mysql');
const db = new MySQL();

const port = 5000;

// app.use(cors({
//   origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
// }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/wb", (req, res) => {
  res.sendFile(__dirname + "/public/wb.html");
});

app.get("/wb2", (req, res) => {
  res.sendFile(__dirname + "/public/wb2.html");
});

const server = app.listen(port, () => {
  console.log("listen on : " + port)
});


webSocket(server, rooms, db);