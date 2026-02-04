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

    // Restrict student from registering as admin
    const finalRole = role === 'admin' ? 'student' : (role || 'student');

    const existingUser = db.users.find(u => u.username === username);
    if (existingUser) return res.status(400).json({ error: "Username already exists" });

    const newUser = db.users.create({ username, password, role: finalRole });
    res.json(newUser);
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password, role } = req.body;
    console.log(`Login attempt: role=${role}, username=${username}`);

    if (role === 'admin') {
        const user = db.users.find(u => u.username === username && u.password === password && u.role === 'admin');
        if (user) {
            console.log('Admin login successful');
            return res.json(user);
        }
    } else {
        // Student login: username = student_id, password = email
        const student = db.students.findAll().find(s =>
            s.student_id.trim().toLowerCase() === username.trim().toLowerCase() &&
            s.email.trim().toLowerCase() === password.trim().toLowerCase()
        );

        if (student) {
            console.log('Student login successful:', student.name);
            return res.json({
                ...student,
                username: student.name,
                role: 'student'
            });
        } else {
            console.log('Student not found with matching ID/Email');
        }
    }

    console.log('Login failed');
    res.status(401).json({ error: "Invalid credentials or unauthorized" });
});

// ======== ROOMS ========
// Get Rooms
app.get('/api/rooms', (req, res) => {
    const rooms = db.rooms.findAll();
    res.json(rooms);
});

// Search Rooms
app.get('/api/rooms/search', (req, res) => {
    const { q } = req.query;
    if (!q) return res.json(db.rooms.findAll());
    const results = db.rooms.search(q);
    res.json(results);
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

// ======== STUDENTS ========
// Get all Students
app.get('/api/students', (req, res) => {
    const students = db.students.findAll();
    res.json(students);
});

// Search Students
app.get('/api/students/search', (req, res) => {
    const { q } = req.query;
    if (!q) return res.json(db.students.findAll());
    const results = db.students.search(q);
    res.json(results);
});

// Get Single Student
app.get('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = db.students.findById(id);
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});

// Add Student
app.post('/api/students', (req, res) => {
    const { name, email, phone, student_id, room_number, course, year, guardian_name, guardian_phone, amount_paid } = req.body;
    if (!name || !email || !student_id) {
        return res.status(400).json({ error: "Name, email, and student ID are required" });
    }
    const newStudent = db.students.create({
        name, email, phone, student_id, room_number, course, year,
        guardian_name, guardian_phone, amount_paid: parseFloat(amount_paid) || 0
    });
    res.json(newStudent);
});

// Update Student
app.put('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updates = req.body;
    if (updates.amount_paid) {
        updates.amount_paid = parseFloat(updates.amount_paid) || 0;
    }
    const updated = db.students.update(id, updates);
    if (updated) {
        res.json(updated);
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});

// Delete Student
app.delete('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = db.students.delete(id);
    if (deleted) {
        res.json({ message: 'Student deleted successfully', student: deleted });
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});

// ======== BOOKINGS ========
// Get all Bookings
app.get('/api/bookings', (req, res) => {
    const bookings = db.bookings.findAll();
    res.json(bookings);
});

// Book Room
app.post('/api/bookings', (req, res) => {
    const { user_id, room_id, start_date, end_date } = req.body;
    const booking = db.bookings.create({ user_id, room_id, start_date, end_date });

    // Update room status to occupied
    db.rooms.update(room_id, { is_occupied: true });

    res.json(booking);
});

// ======== SEARCH (Global) ========
app.get('/api/search', (req, res) => {
    const { q, type } = req.query;
    if (!q) return res.status(400).json({ error: "Search query is required" });

    let results = { rooms: [], students: [] };

    if (!type || type === 'all' || type === 'rooms') {
        results.rooms = db.rooms.search(q);
    }
    if (!type || type === 'all' || type === 'students') {
        results.students = db.students.search(q);
    }

    res.json(results);
});

// ======== REPORTS ========
app.get('/api/reports', (req, res) => {
    const report = db.reports.generate();
    res.json(report);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
