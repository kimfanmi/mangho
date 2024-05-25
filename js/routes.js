const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

router.get("/wb", (req, res) => {
  res.sendFile(__dirname + "/public/wb.html");
});

router.get("/wb2", (req, res) => {
  res.sendFile(__dirname + "/public/wb2.html");
});

module.exports = router;