const EventEmitter = require('events');

class Rooms extends EventEmitter {
  constructor() {
    super();
    this.rooms = [];
  }


  makeRoom(roomName, maxUser = 4) {
    let roomId = this.randomId();
    let room = { roomName, maxUser, roomId, users: [], state:"모집중" };
    this.rooms.push(room);
    this.emit('change'); // 방 목록이 변경될 때 이벤트 발생
    return roomId;
  }

  destroyRoom(roomId) {
    let roomIndex = this.rooms.findIndex(room => room.roomId === roomId);
    if (roomIndex !== -1) {
      this.rooms.splice(roomIndex, 1);
      this.emit('change'); // 방 목록이 변경될 때 이벤트 발생
      console.log(`Room with ID ${roomId} has been destroyed.`);
    } else {
      console.log(`Room with ID ${roomId} does not exist.`);
    }
  }

  joinUser(user, roomId) {
    let room = this.findRoomById(roomId);
    if (!room) {
      console.log(`Room with ID ${roomId} does not exist.`);
      return -1;
    }

    if (room.users.length < room.maxUser) {
      room.users.push(user);
      console.log(`${user.name} has joined ${room.roomName}.`);
      this.emit('change'); // 방 목록이 변경될 때 이벤트 발생
      return 1;
    } else {
      console.log(`Room ${room.roomName} is full. ${user.name} cannot join.`);
      return 0;
    }
  }

  leaveUser(user, roomId) {
    let room = this.findRoomById(roomId);
    if (!room) {
      console.log(`Room with ID ${roomId} does not exist.`);
      return;
    }

    room.users = room.users.filter(u => u !== user);
    this.emit('change'); // 방 목록이 변경될 때 이벤트 발생
  }

  getUserCount(roomId) {
    let room = this.findRoomById(roomId);
    if (!room) {
      console.log(`Room with ID ${roomId} does not exist.`);
      return;
    }

    return `${room.users.length}/${room.maxUser}`;
  }

  changeState(roomId, state) {
    let room = this.findRoomById(roomId);
    if (!room) {
      console.log(`Room with ID ${roomId} does not exist.`);
      return;
    }
    room.state = state;
    this.emit('change'); // 방 목록이 변경될 때 이벤트 발생
  }

  getRooms() {
    return this.rooms;
  }




  
  randomId() {
    const generateId = () => {
      return Math.random().toString(36).substring(2, 9); // Generates a random string of length 9
    };

    let id;
    do {
      id = generateId();
    } while (this.rooms.some(room => room.roomId === id)); // Check if ID already exists

    return id;
  }

  findRoomById(roomId) {
    return this.rooms.find(room => room.roomId === roomId);
  }
}

module.exports = Rooms;
