const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Routes
// Register
app.post('/api/register', (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });

    const existingUser = db.users.find(u => u.username === username);
    if (existingUser) return res.status(400).json({ error: "Username already exists" });

    const newUser = db.users.create({ username, password, role: role || 'student' });
    res.json(newUser);
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

// Get Rooms
app.get('/api/rooms', (req, res) => {
    const rooms = db.rooms.findAll();
    res.json(rooms);
});

// Add Room (Admin)
app.post('/api/rooms', (req, res) => {
    const { room_number, capacity, price } = req.body;
    const newRoom = db.rooms.create({ room_number, capacity, price });
    res.json(newRoom);
});

// Delete Room (Admin)
app.delete('/api/rooms/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = db.rooms.delete(id);
    if (deleted) {
        res.json({ message: 'Room deleted successfully', room: deleted });
    } else {
        res.status(404).json({ error: 'Room not found' });
    }
});

// Book Room
app.post('/api/bookings', (req, res) => {
    const { user_id, room_id, start_date, end_date } = req.body;
    const booking = db.bookings.create({ user_id, room_id, start_date, end_date });

    // Update room status to occupied
    db.rooms.update(room_id, { is_occupied: true });

    res.json(booking);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
