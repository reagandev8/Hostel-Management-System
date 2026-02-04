const fs = require('fs');
const path = require('path');

const dbFile = path.resolve(__dirname, 'db.json');

const defaultData = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' }
  ],
  rooms: [
    { id: 1, room_number: '101', capacity: 2, price: 500, is_occupied: false },
    { id: 2, room_number: '102', capacity: 3, price: 400, is_occupied: false },
    { id: 3, room_number: '103', capacity: 2, price: 500, is_occupied: true },
    { id: 4, room_number: '201', capacity: 4, price: 300, is_occupied: false },
  ],
  bookings: []
};

function readDb() {
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
}

function writeDb(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

const db = {
  users: {
    find: (predicate) => {
      const data = readDb();
      return data.users.find(predicate);
    },
    create: (user) => {
      const data = readDb();
      const newUser = { id: Date.now(), ...user };
      data.users.push(newUser);
      writeDb(data);
      return newUser;
    }
  },
  rooms: {
    findAll: () => {
      const data = readDb();
      return data.rooms;
    },
    create: (room) => {
      const data = readDb();
      const newRoom = { id: Date.now(), is_occupied: false, ...room };
      data.rooms.push(newRoom);
      writeDb(data);
      return newRoom;
    },
    update: (id, updates) => {
      const data = readDb();
      const index = data.rooms.findIndex(r => r.id === id);
      if (index !== -1) {
        data.rooms[index] = { ...data.rooms[index], ...updates };
        writeDb(data);
        return data.rooms[index];
      }
      return null;
    },
    delete: (id) => {
      const data = readDb();
      const index = data.rooms.findIndex(r => r.id === id);
      if (index !== -1) {
        const deleted = data.rooms.splice(index, 1)[0];
        writeDb(data);
        return deleted;
      }
      return null;
    }
  },
  bookings: {
    create: (booking) => {
      const data = readDb();
      const newBooking = { id: Date.now(), status: 'pending', ...booking };
      data.bookings.push(newBooking);
      writeDb(data);
      return newBooking;
    }
  }
};

module.exports = db;
