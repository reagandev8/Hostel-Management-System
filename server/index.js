const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Models
const User = require('./models/User');
const Student = require('./models/Student');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Routes

// Register Student
app.post('/api/register/student', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: "Email, password, and name are required" });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already registered" });

        // Check if student profile already exists (e.g. added by admin)
        let existingStudent = await Student.findOne({ email });

        // Create new user account
        const newUser = await User.create({
            username: email, // Student uses email as username
            email,
            password,
            role: 'student',
            name
        });

        // If no student profile exists, create one so they show up in "Total Students"
        if (!existingStudent) {
            existingStudent = await Student.create({
                name,
                email,
                // We don't have other details yet, but that's fine as we made fields optional
            });
        }

        res.json({ message: "Registration successful! Please login.", user: newUser });
    } catch (error) {
        // If user creation fails (e.g. duplicate email race condition), we should probably not have created the student
        // In a production app, use transactions. Here, we'll just return the error.
        console.error("Registration error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Register Admin
app.post('/api/register/admin', async (req, res) => {
    const { username, password, email, name } = req.body;
    if (!username || !password || !email || !name) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if an admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return res.status(403).json({ error: "Admin account already exists. Only one admin is allowed." });
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(400).json({ error: "Username or Email already exists" });

        const newUser = await User.create({
            username,
            email,
            password,
            role: 'admin',
            name
        });

        res.json({ message: "Admin registration successful! Please login.", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password, role } = req.body;
    console.log(`Login attempt: role=${role}, username/email=${username}`);

    try {
        let user = null;

        if (role === 'admin') {
            // Admin login: Strict check for admin role
            user = await User.findOne({ username, password, role: 'admin' });

            if (user) {
                console.log('Admin login successful');
                return res.json(user);
            }
        } else if (role === 'student') {
            // Student login: Check for student role (email or username)
            // Note: In registration, we set username = email for students, but allow flexibility here
            user = await User.findOne({
                $and: [
                    { $or: [{ email: username }, { username: username }] },
                    { password: password },
                    { role: 'student' }
                ]
            });

            if (user) {
                console.log('Student login successful:', user.name);
                return res.json(user);
            }
        }

        console.log('Login failed: Invalid credentials or role mismatch');
        res.status(401).json({ error: "Invalid credentials or unauthorized access" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ======== ROOMS ========
// Get Rooms
app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search Rooms
app.get('/api/rooms/search', async (req, res) => {
    const { q } = req.query;
    if (!q) {
        const rooms = await Room.find({});
        return res.json(rooms);
    }

    try {
        const regex = new RegExp(q, 'i');
        const results = await Room.find({ room_number: regex });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add Room (Admin)
app.post('/api/rooms', async (req, res) => {
    const { room_number, capacity, price } = req.body;
    try {
        const newRoom = await Room.create({ room_number, capacity, price });
        res.json(newRoom);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Room (Admin)
app.delete('/api/rooms/:id', async (req, res) => {
    try {
        const deleted = await Room.findByIdAndDelete(req.params.id);
        if (deleted) {
            res.json({ message: 'Room deleted successfully', room: deleted });
        } else {
            res.status(404).json({ error: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ======== STUDENTS ========
// Get all Students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find({});
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search Students
app.get('/api/students/search', async (req, res) => {
    const { q } = req.query;
    if (!q) {
        const students = await Student.find({});
        return res.json(students);
    }

    try {
        const regex = new RegExp(q, 'i');
        const results = await Student.find({
            $or: [
                { name: regex },
                { email: regex },
                { students_id: regex }, // Note: Schema uses students_id
                { room_number: regex }
            ]
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Single Student
app.get('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add Student
app.post('/api/students', async (req, res) => {
    const { name, email, phone, student_id, room_number, course, year, guardian_name, guardian_phone, amount_paid } = req.body;
    if (!name || !email || !student_id) {
        return res.status(400).json({ error: "Name, email, and student ID are required" });
    }

    try {
        const newStudent = await Student.create({
            name, email, phone,
            students_id: student_id,
            room_number, course, year,
            guardian_name, guardian_phone,
            amount_paid: parseFloat(amount_paid) || 0
        });
        res.json(newStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Student
app.put('/api/students/:id', async (req, res) => {
    try {
        const updates = req.body;
        if (updates.amount_paid) {
            updates.amount_paid = parseFloat(updates.amount_paid) || 0;
        }
        if (updates.student_id) {
            updates.students_id = updates.student_id;
            delete updates.student_id;
        }

        const updated = await Student.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Student
app.delete('/api/students/:id', async (req, res) => {
    try {
        const deleted = await Student.findByIdAndDelete(req.params.id);
        if (deleted) {
            res.json({ message: 'Student deleted successfully', student: deleted });
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ======== BOOKINGS ========
// Get all Bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user_id').populate('room_id');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Book Room
app.post('/api/bookings', async (req, res) => {
    const { user_id, room_id, start_date, end_date } = req.body;
    try {
        // Find the room
        const room = await Room.findById(room_id);
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        // Count existing *active* bookings (pending or confirmed) for this room.
        // Assuming 'cancelled' doesn't count towards capacity.
        const currentBookingsCount = await Booking.countDocuments({
            room_id: room_id,
            status: { $in: ['pending', 'confirmed'] }
        });

        // Check capacity
        if (currentBookingsCount >= room.capacity) {
            return res.status(400).json({ error: "Room is fully booked" });
        }

        // Create booking
        const booking = await Booking.create({ user_id, room_id, start_date, end_date });

        // Update room status ONLY if capacity is reached
        // New count = current + 1
        if (currentBookingsCount + 1 >= room.capacity) {
            await Room.findByIdAndUpdate(room_id, { is_occupied: true });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ======== REPORTS ========
app.get('/api/reports', async (req, res) => {
    try {
        const totalRooms = await Room.countDocuments();
        // Occupied rooms are those marked is_occupied=true (meaning full)
        const fullyOccupiedRooms = await Room.countDocuments({ is_occupied: true });

        // This 'availableRooms' calculation might be misleading if we only count *fully* occupied rooms.
        // A room with capacity 4 having 3 students is technically 'available' but partially occupied.
        // For simplicity, let's keep it as total - full.
        const availableRooms = totalRooms - fullyOccupiedRooms;

        const totalStudents = await Student.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });

        // Aggregate revenue
        const revenueResult = await Student.aggregate([
            { $group: { _id: null, total: { $sum: "$amount_paid" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Aggregate capacity
        const capacityResult = await Room.aggregate([
            { $group: { _id: null, total: { $sum: "$capacity" } } }
        ]);
        const totalCapacity = capacityResult.length > 0 ? capacityResult[0].total : 0;

        const occupancyRate = totalRooms > 0 ? ((fullyOccupiedRooms / totalRooms) * 100).toFixed(1) : 0;

        const rooms = await Room.find({});
        const students = await Student.find({});
        const bookings = await Booking.find({});

        res.json({
            summary: {
                totalRooms,
                occupiedRooms: fullyOccupiedRooms,
                availableRooms,
                occupancyRate: parseFloat(occupancyRate),
                totalStudents,
                totalBookings,
                pendingBookings,
                totalRevenue,
                totalCapacity
            },
            rooms,
            students,
            bookings,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
