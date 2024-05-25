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

  // 클라이언트가 소켓에 연결되었을 때 실행되는 이벤트 핸들러
  io.on("connection", (socket) => {

    // 클라이언트로부터 userId 이벤트를 받았을 때 사용자 정보를 가져와서 소켓에 저장
    socket.on("userId", async (userId) => {
      try {
        const user = await db.findUser(userId);
        socket.user = user;
        console.log("User info:", socket.user);
      } catch (error) {
        console.error("Error finding user:", error);
      }
    });

    // 클라이언트가 방에 참여할 때 실행되는 이벤트 핸들러
    socket.on("joinRoom", (roomId) => {
      if (!socket.user) {
        socket.emit("userIdRequest"); // 클라이언트에게 userId 요청
        return;
      }
      rooms.joinUser(socket.user, roomId);
      socket.roomId = roomId;
      socket.join(socket.roomId);
      io.to(socket.roomId).emit("chat message", "notice", socket.user.nickName + "님이 망호에 참여하셨습니다.");
    });

    // 클라이언트가 방을 떠날 때 실행되는 이벤트 핸들러
    socket.on("leaveRoom", (roomId) => {
      if (socket.roomId) {
        rooms.leaveUser(socket.user, roomId);
        socket.leave(socket.roomId);
        io.to(socket.roomId).emit("chat message", "notice", socket.user.nickName + "님이 망호에서 퇴장하셨습니다.");
        socket.roomId = null;
      }
    });

    // 클라이언트가 방을 닫을 때 실행되는 이벤트 핸들러
    socket.on("closeRoom", (roomId) => {
      if (socket.roomId) {
        // 방에 있는 모든 소켓을 가져와서 leaveRoom 처리
        const roomSockets = io.sockets.adapter.rooms.get(roomId);
        if (roomSockets) {
          roomSockets.forEach((roomId) => {
            const roomSocket = io.sockets.sockets.get(roomId);
            roomSocket.leave(roomId);
            roomSocket.roomId = null;
            // 각 소켓에게 roomClosed 이벤트를 보내기
            roomSocket.emit("roomClosed");
          });
        }
        // 방 닫기
        rooms.destroyRoom(roomId);
      }
    });

    // 클라이언트가 소켓 연결을 끊을 때 실행되는 이벤트 핸들러
    socket.on("disconnect", () => {
      if (socket.roomId) {
        // 해당 방에서 클라이언트를 나가게 함
        rooms.leaveUser(socket.user, socket.roomId);
        socket.leave(socket.roomId);
        io.to(socket.roomId).emit("chat message", "notice", socket.user.nickName + "님이 망호에서 퇴장하셨습니다.");
        socket.roomId = null;
      }
    });

    // 클라이언트가 방을 만들 때 실행되는 이벤트 핸들러
    socket.on("makeRoom", (roomName, maxUser) => {
      let roomId = rooms.makeRoom(roomName, maxUser);
      socket.emit("rs_MakeRoom", roomId);
    });

    // 클라이언트가 requestRooms 이벤트를 요청할 때마다 방 목록을 전송
    socket.on("requestRooms", () => {
      // 초기 방 목록 전송
      sendRoomsList(socket);

      // 방 목록이 변경될 때마다 실시간으로 업데이트
      const changeListener = () => {
        sendRoomsList(socket);
      };
      rooms.on("change", changeListener);

      // 클라이언트로부터 stopRequest 이벤트를 받으면 방 목록 업데이트 중지
      socket.once("stopRequest", () => {
        rooms.off("change", changeListener); // 이벤트 리스너 제거
      });
    });
  });

  // 방 목록을 클라이언트에게 전송하는 함수
  function sendRoomsList(socket) {
    socket.emit("rs_getRooms", rooms.getRooms());
  }
};
