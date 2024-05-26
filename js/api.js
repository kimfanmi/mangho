const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.post("/users", async (req, res) => {

  });


  // socket.on("userId", async (userId) => {
  //   try {
  //     const user = await db.findUser(userId);
  //     socket.user = user;
  //     console.log("User info:", socket.user);
  //   } catch (error) {
  //     console.error("Error finding user:", error);
  //   }
  // });

  return router;
};