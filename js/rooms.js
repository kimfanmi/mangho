class Rooms {
  constructor() {
    this.rooms = [];
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

  makeRoom(roomName, maxUser = 4) {
    let roomId = this.randomId();
    let room = { roomName, maxUser, roomId, users: [] };
    this.rooms.push(room);
    return roomId;
  }

  destroyRoom(roomId) {
    let roomIndex = this.rooms.findIndex(room => room.roomId === roomId);
    if (roomIndex !== -1) {
      this.rooms.splice(roomIndex, 1);
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
  }

  getUserCount(roomId) {
    let room = this.findRoomById(roomId);
    if (!room) {
      console.log(`Room with ID ${roomId} does not exist.`);
      return;
    }

    return `${room.users.length}/${room.maxUser}`;
  }

  getRooms() {
    return this.rooms;
  }
}

module.exports = Rooms;
