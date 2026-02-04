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
  bookings: [],
  students: []
};

function readDb() {
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  const data = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
  // Ensure students array exists for backwards compatibility
  if (!data.students) {
    data.students = [];
  }
  return data;
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
    findAll: () => {
      const data = readDb();
      return data.users;
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
    findById: (id) => {
      const data = readDb();
      return data.rooms.find(r => r.id === id);
    },
    search: (query) => {
      const data = readDb();
      const q = query.toLowerCase();
      return data.rooms.filter(room =>
        room.room_number.toLowerCase().includes(q) ||
        room.capacity.toString().includes(q) ||
        room.price.toString().includes(q)
      );
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
  students: {
    findAll: () => {
      const data = readDb();
      return data.students;
    },
    findById: (id) => {
      const data = readDb();
      return data.students.find(s => s.id === id);
    },
    search: (query) => {
      const data = readDb();
      const q = query.toLowerCase();
      return data.students.filter(student =>
        student.name.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        student.phone.includes(q) ||
        student.student_id.toLowerCase().includes(q) ||
        (student.room_number && student.room_number.toLowerCase().includes(q))
      );
    },
    create: (student) => {
      const data = readDb();
      const newStudent = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        ...student
      };
      data.students.push(newStudent);
      writeDb(data);
      return newStudent;
    },
    update: (id, updates) => {
      const data = readDb();
      const index = data.students.findIndex(s => s.id === id);
      if (index !== -1) {
        data.students[index] = { ...data.students[index], ...updates };
        writeDb(data);
        return data.students[index];
      }
      return null;
    },
    delete: (id) => {
      const data = readDb();
      const index = data.students.findIndex(s => s.id === id);
      if (index !== -1) {
        const deleted = data.students.splice(index, 1)[0];
        writeDb(data);
        return deleted;
      }
      return null;
    }
  },
  bookings: {
    findAll: () => {
      const data = readDb();
      return data.bookings;
    },
    create: (booking) => {
      const data = readDb();
      const newBooking = { id: Date.now(), status: 'pending', ...booking };
      data.bookings.push(newBooking);
      writeDb(data);
      return newBooking;
    }
  },
  reports: {
    generate: () => {
      const data = readDb();
      const totalRooms = data.rooms.length;
      const occupiedRooms = data.rooms.filter(r => r.is_occupied).length;
      const availableRooms = totalRooms - occupiedRooms;
      const totalStudents = data.students.length;
      const totalBookings = data.bookings.length;
      const pendingBookings = data.bookings.filter(b => b.status === 'pending').length;
      const totalRevenue = data.students.reduce((sum, s) => sum + (parseFloat(s.amount_paid) || 0), 0);
      const totalCapacity = data.rooms.reduce((sum, r) => sum + (parseInt(r.capacity) || 0), 0);
      const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0;

      return {
        summary: {
          totalRooms,
          occupiedRooms,
          availableRooms,
          occupancyRate: parseFloat(occupancyRate),
          totalStudents,
          totalBookings,
          pendingBookings,
          totalRevenue,
          totalCapacity
        },
        rooms: data.rooms,
        students: data.students,
        bookings: data.bookings,
        generatedAt: new Date().toISOString()
      };
    }
  }
};

module.exports = db;
