const express = require("express");
const app = express();
const webSocket = require("./js/socket");
const cors = require("cors");

const Rooms = require("./js/rooms");
const rooms = new Rooms();
const MySQL = require('./js/mysql');
const db = new MySQL();

const port = 5000;

// 라우팅을 정의한 파일을 가져옴
const page = require('./js/page')();
const api = require('./js/api')(db);

// 라우팅을 사용
app.use('/', page); 
app.use('/', api); 

const server = app.listen(port, () => {
  console.log("listen on : " + port)
});


webSocket(server, rooms, db);