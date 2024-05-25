const SocketIO = require("socket.io");

module.exports = (server, rooms, db) => {
  const io = SocketIO(server, {
    path: "/socket.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    pingTimeout: 30000, // 30초로 설정
    pingInterval: 10000 // 10초마다 핑 패킷 전송
  });





  io.on("connection", (socket) => {

    socket.on("joinRoom", (roomId, userId) => {
      
      socket.name = findUser(userId).userName;
      socket.roomId = roomId;

      socket.join(socket.roomId);

      io.to(socket.roomId).emit("chat message", "notice", socket.name+"님이 망호에 참여하셨습니다." );
    })

    socket.on("disconnect", () => {

    })





  })
}
