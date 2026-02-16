import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, BedDouble, Users, Plus, Trash2, Search, FileText, Edit2, X, Download, ChevronDown, GraduationCap, Phone, Mail, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [rooms, setRooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [newRoom, setNewRoom] = useState({ room_number: '', capacity: '', price: '' });
    const [newStudent, setNewStudent] = useState({
        name: '', email: '', phone: '', student_id: '', room_number: '',
        course: '', year: '', guardian_name: '', guardian_phone: '', amount_paid: ''
    });
    const [showAddRoomModal, setShowAddRoomModal] = useState(false);
    const [showEditStudentModal, setShowEditStudentModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ rooms: [], students: [] });
    const [searchType, setSearchType] = useState('all');
    const [report, setReport] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [studentView, setStudentView] = useState('register');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const fetchRooms = async () => {
        try {
            const res = await api.get('/rooms');
            setRooms(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await api.get('/students');
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRooms();
        fetchStudents();
    }, []);

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            await api.post('/rooms', newRoom);
            setShowAddRoomModal(false);
            setNewRoom({ room_number: '', capacity: '', price: '' });
            fetchRooms();
        } catch (err) {
            alert('Failed to add room');
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm('Are you sure you want to delete this room?')) {
            return;
        }
        try {
            await api.delete(`/rooms/${roomId}`);
            fetchRooms();
        } catch (err) {
            console.error(err);
            alert('Failed to delete room');
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/students', newStudent);
            setNewStudent({
                name: '', email: '', phone: '', student_id: '', room_number: '',
                course: '', year: '', guardian_name: '', guardian_phone: '', amount_paid: ''
            });
            fetchStudents();
            alert('Student registered successfully!');
            setStudentView('list');
        } catch (err) {
            alert('Failed to add student');
        }
    };

    const handleEditStudent = (student) => {
        setEditingStudent({ ...student });
        setShowEditStudentModal(true);
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/students/${editingStudent.id}`, editingStudent);
            setShowEditStudentModal(false);
            setEditingStudent(null);
            fetchStudents();
        } catch (err) {
            alert('Failed to update student');
        }
    };

    const handleDeleteStudent = async (studentId) => {
        if (!window.confirm('Are you sure you want to delete this student?')) {
            return;
        }
        try {
            await api.delete(`/students/${studentId}`);
            fetchStudents();
        } catch (err) {
            console.error(err);
            alert('Failed to delete student');
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults({ rooms: [], students: [] });
            return;
        }
        try {
            const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
            setSearchResults(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery) {
                handleSearch();
            } else {
                setSearchResults({ rooms: [], students: [] });
            }
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery, searchType]);

    const generateReport = async () => {
        try {
            const res = await api.get('/reports');
            setReport(res.data);
            setShowReportModal(true);
        } catch (err) {
            console.error(err);
            alert('Failed to generate report');
        }
    };

    const downloadReport = () => {
        if (!report) return;
        const reportText = `
HOSTEL MANAGEMENT SYSTEM REPORT
Generated: ${new Date(report.generatedAt).toLocaleString()}
================================

SUMMARY
-------
Total Rooms: ${report.summary.totalRooms}
Occupied Rooms: ${report.summary.occupiedRooms}
Available Rooms: ${report.summary.availableRooms}
Occupancy Rate: ${report.summary.occupancyRate}%
Total Capacity: ${report.summary.totalCapacity} students
Total Students: ${report.summary.totalStudents}
Total Bookings: ${report.summary.totalBookings}
Pending Bookings: ${report.summary.pendingBookings}
Total Revenue: $${report.summary.totalRevenue.toFixed(2)}

ROOMS
-----
${report.rooms.map(r => `Room ${r.room_number} - Capacity: ${r.capacity}, Price: $${r.price}, Status: ${r.is_occupied ? 'Occupied' : 'Available'}`).join('\n')}

STUDENTS
--------
${report.students.map(s => `${s.name} (${s.student_id}) - Room: ${s.room_number || 'N/A'}, Course: ${s.course || 'N/A'}, Paid: $${s.amount_paid || 0}`).join('\n')}
`;
        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hostel_report_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'search', label: 'Search', icon: Search },
        { id: 'reports', label: 'Reports', icon: FileText },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            <nav className="h-16 glass sticky top-0 z-50 px-6 flex items-center justify-between border-b border-slate-800">
                <div className="text-xl font-bold flex items-center gap-2">
                    <LayoutDashboard className="text-purple-500" />
                    <span>Admin<span className="text-purple-500">Panel</span></span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-sm">
                            A
                        </div>
                        <span className="text-sm text-slate-300 font-medium hidden sm:block">Admin</span>
                    </div>
                    <button onClick={handleLogout} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>

            {/* Tab Navigation */}
            <div className="border-b border-slate-800 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-1 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${activeTab === tab.id
                                    ? 'text-purple-400 border-purple-500 bg-purple-500/10'
                                    : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="p-6 max-w-7xl w-full mx-auto space-y-8">
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <>
                        {/* Stats Row */}
                        <div className="grid md:grid-cols-4 gap-6">
                            <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 border border-transparent transition-all">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <BedDouble size={80} />
                                </div>
                                <h3 className="text-slate-400 text-sm font-medium">Total Rooms</h3>
                                <p className="text-4xl font-bold mt-2">{rooms.length}</p>
                            </div>
                            <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-green-500/30 border border-transparent transition-all">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <BedDouble size={80} />
                                </div>
                                <h3 className="text-slate-400 text-sm font-medium">Available Rooms</h3>
                                <p className="text-4xl font-bold mt-2 text-green-400">{rooms.filter(r => !r.is_occupied).length}</p>
                            </div>
                            <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 border border-transparent transition-all">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Users size={80} />
                                </div>
                                <h3 className="text-slate-400 text-sm font-medium">Total Students</h3>
                                <p className="text-4xl font-bold mt-2 text-blue-400">{students.length}</p>
                            </div>
                            <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/30 border border-transparent transition-all">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <BedDouble size={80} />
                                </div>
                                <h3 className="text-slate-400 text-sm font-medium">Occupied Rooms</h3>
                                <p className="text-4xl font-bold mt-2 text-red-400">{rooms.filter(r => r.is_occupied).length}</p>
                            </div>
                        </div>

                        {/* Room Management */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Manage Rooms</h2>
                                <button
                                    onClick={() => setShowAddRoomModal(true)}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold transition-all flex items-center gap-2 text-sm"
                                >
                                    <Plus size={16} /> Add Room
                                </button>
                            </div>

                            <div className="glass rounded-2xl border border-slate-800 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-900/50 border-b border-slate-800">
                                            <th className="p-4 text-slate-400 font-medium text-sm">Room No</th>
                                            <th className="p-4 text-slate-400 font-medium text-sm">Capacity</th>
                                            <th className="p-4 text-slate-400 font-medium text-sm">Price/Student</th>
                                            <th className="p-4 text-slate-400 font-medium text-sm">Total Amount</th>
                                            <th className="p-4 text-slate-400 font-medium text-sm">Status</th>
                                            <th className="p-4 text-slate-400 font-medium text-sm text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rooms.map(room => (
                                            <tr key={room.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                                                <td className="p-4 font-medium">{room.room_number}</td>
                                                <td className="p-4 text-slate-400">{room.capacity}</td>
                                                <td className="p-4 text-slate-400">Ksh.{room.price}</td>
                                                <td className="p-4 font-bold text-green-400">Ksh.{(room.capacity * room.price).toLocaleString()}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${room.is_occupied ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                                        {room.is_occupied ? 'Occupied' : 'Available'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteRoom(room.id)}
                                                        className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        {/* Occupied Rooms Revenue */}
                                        <tr className="bg-green-900/20 border-t-2 border-green-500/50">
                                            <td colSpan="3" className="p-4 font-bold text-lg text-slate-200">
                                                OCCUPIED ROOMS REVENUE (Current)
                                            </td>
                                            <td className="p-4 font-bold text-2xl text-green-400">
                                                Ksh.{rooms.filter(r => r.is_occupied).reduce((sum, room) => sum + (room.capacity * room.price), 0).toLocaleString()}
                                            </td>
                                            <td colSpan="2" className="p-4 text-slate-400 text-sm">
                                                {rooms.filter(r => r.is_occupied).length} rooms
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                                {rooms.length === 0 && (
                                    <div className="p-8 text-center text-slate-500">No rooms found. Add one to get started.</div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Students Tab */}
                {activeTab === 'students' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <GraduationCap className="text-blue-500" />
                                Student Management
                            </h2>
                        </div>

                        {/* Sub-tabs for Students section */}
                        <div className="flex gap-2 border-b border-slate-800 pb-4">
                            <button
                                onClick={() => setStudentView('register')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${studentView === 'register'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                <Plus size={16} /> Register New Student
                            </button>
                            <button
                                onClick={() => setStudentView('list')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${studentView === 'list'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                <Users size={16} /> Student List ({students.length})
                            </button>
                        </div>

                        {/* Register Student Form */}
                        {studentView === 'register' && (
                            <div className="glass p-6 rounded-2xl border border-slate-800">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <GraduationCap size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Student Registration Form</h3>
                                        <p className="text-slate-400 text-sm">Enter student details to register them in the hostel</p>
                                    </div>
                                </div>

                                <form onSubmit={handleAddStudent} className="space-y-6">
                                    {/* Personal Information */}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                                            <Users size={14} /> Personal Information
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-2">Full Name <span className="text-red-400">*</span></label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter full name"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                                    required
                                                    value={newStudent.name}
                                                    onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-2">Student ID <span className="text-red-400">*</span></label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., STU-2026-001"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                                    required
                                                    value={newStudent.student_id}
                                                    onChange={e => setNewStudent({ ...newStudent, student_id: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-2">Email Address <span className="text-red-400">*</span></label>
                                                <input
                                                    type="email"
                                                    placeholder="student@university.edu"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                                    required
                                                    value={newStudent.email}
                                                    onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-2">Phone Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="+254 7XX XXX XXX"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                                    value={newStudent.phone}
                                                    onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Academic Information */}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                                            <GraduationCap size={14} /> Academic Information
                                        </h4>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-2">Course/Program</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Computer Science"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                                    value={newStudent.course}
                                                    onChange={e => setNewStudent({ ...newStudent, course: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-2">Year of Study</label>
                                                <select
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                                    value={newStudent.year}
                                                    onChange={e => setNewStudent({ ...newStudent, year: e.target.value })}
                                                >
                                                    <option value="">Select Year</option>
                                                    <option value="1st Year">1st Year</option>
                                                    <option value="2nd Year">2nd Year</option>
                                                    <option value="3rd Year">3rd Year</option>
                                                    <option value="4th Year">4th Year</option>
                                                    <option value="5th Year">5th Year</option>
                                                    <option value="Postgraduate">Postgraduate</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-2">Assign Room</label>
                                                <select
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                                    value={newStudent.room_number}
                                                    onChange={e => setNewStudent({ ...newStudent, room_number: e.target.value })}
                                                >
                                                    <option value="">Select Room</option>
                                                    {rooms.filter(r => !r.is_occupied).map(room => (
                                                        <option key={room.id} value={room.room_number}>
                                                            Room {room.room_number} (Capacity: {room.capacity}, Ksh{room.price}/semester)
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guardian Information */}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                                            <Home size={14} /> Guardian/Emergency Contact
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-2">Guardian Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Parent/Guardian full name"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                                    value={newStudent.guardian_name}
                                                    onChange={e => setNewStudent({ ...newStudent, guardian_name: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-2">Guardian Phone</label>
                                                <input
                                                    type="text"
                                                    placeholder="+254 7XX XXX XXX"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                                    value={newStudent.guardian_phone}
                                                    onChange={e => setNewStudent({ ...newStudent, guardian_phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Information */}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                                            <FileText size={14} /> Payment Information
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-2">Amount Paid (Ksh)</label>
                                                <input
                                                    type="number"
                                                    placeholder="0.00"
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
                                                    value={newStudent.amount_paid}
                                                    onChange={e => setNewStudent({ ...newStudent, amount_paid: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                                        <button
                                            type="button"
                                            onClick={() => setNewStudent({
                                                name: '', email: '', phone: '', student_id: '', room_number: '',
                                                course: '', year: '', guardian_name: '', guardian_phone: '', amount_paid: ''
                                            })}
                                            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-all"
                                        >
                                            Clear Form
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold transition-all flex items-center gap-2"
                                        >
                                            <Plus size={18} /> Register Student
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Student List */}
                        {studentView === 'list' && (
                            <div className="glass rounded-2xl border border-slate-800 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-900/50 border-b border-slate-800">
                                                <th className="p-4 text-slate-400 font-medium text-sm">Student ID</th>
                                                <th className="p-4 text-slate-400 font-medium text-sm">Name</th>
                                                <th className="p-4 text-slate-400 font-medium text-sm">Email</th>
                                                <th className="p-4 text-slate-400 font-medium text-sm">Phone</th>
                                                <th className="p-4 text-slate-400 font-medium text-sm">Room</th>
                                                <th className="p-4 text-slate-400 font-medium text-sm">Course</th>
                                                <th className="p-4 text-slate-400 font-medium text-sm">Paid</th>
                                                <th className="p-4 text-slate-400 font-medium text-sm text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map(student => (
                                                <tr key={student.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                                                    <td className="p-4 font-medium text-blue-400">{student.student_id}</td>
                                                    <td className="p-4 font-medium">{student.name}</td>
                                                    <td className="p-4 text-slate-400">{student.email}</td>
                                                    <td className="p-4 text-slate-400">{student.phone}</td>
                                                    <td className="p-4">
                                                        <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-bold">
                                                            {student.room_number || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-slate-400">{student.course || 'N/A'}</td>
                                                    <td className="p-4 text-green-400">${student.amount_paid || 0}</td>
                                                    <td className="p-4 text-right flex gap-1 justify-end">
                                                        <button
                                                            onClick={() => handleEditStudent(student)}
                                                            className="p-2 hover:bg-blue-500/10 text-slate-500 hover:text-blue-400 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteStudent(student.id)}
                                                            className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {students.length === 0 && (
                                        <div className="p-8 text-center text-slate-500">No students found. Go to "Register New Student" to add one.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Search Tab */}
                {activeTab === 'search' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Search className="text-purple-500" size={28} />
                            <h2 className="text-2xl font-bold">Search</h2>
                        </div>

                        <div className="glass p-6 rounded-2xl border border-slate-800">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, room number, student ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-purple-500 transition-colors"
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        value={searchType}
                                        onChange={(e) => setSearchType(e.target.value)}
                                        className="appearance-none bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pr-10 outline-none focus:border-purple-500 transition-colors cursor-pointer"
                                    >
                                        <option value="all">All</option>
                                        <option value="rooms">Rooms Only</option>
                                        <option value="students">Students Only</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Search Results */}
                        {searchQuery && (
                            <div className="space-y-6">
                                {/* Rooms Results */}
                                {(searchType === 'all' || searchType === 'rooms') && searchResults.rooms.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            <BedDouble className="text-purple-400" size={20} />
                                            Rooms ({searchResults.rooms.length})
                                        </h3>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {searchResults.rooms.map(room => (
                                                <div key={room.id} className="glass p-4 rounded-xl border border-slate-800 hover:border-purple-500/30 transition-all">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold text-lg">Room {room.room_number}</h4>
                                                            <p className="text-slate-400 text-sm">Capacity: {room.capacity} students</p>
                                                            <p className="text-blue-400 font-bold mt-2">${room.price}/month</p>
                                                        </div>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${room.is_occupied ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                                            {room.is_occupied ? 'Occupied' : 'Available'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Students Results */}
                                {(searchType === 'all' || searchType === 'students') && searchResults.students.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            <Users className="text-blue-400" size={20} />
                                            Students ({searchResults.students.length})
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {searchResults.students.map(student => (
                                                <div key={student.id} className="glass p-4 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-all">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-lg">
                                                            {student.name[0].toUpperCase()}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold">{student.name}</h4>
                                                            <p className="text-blue-400 text-sm">{student.student_id}</p>
                                                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-400">
                                                                <span className="flex items-center gap-1"><Mail size={12} />{student.email}</span>
                                                                <span className="flex items-center gap-1"><Phone size={12} />{student.phone}</span>
                                                                <span className="flex items-center gap-1"><Home size={12} />Room {student.room_number || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* No Results */}
                                {searchResults.rooms.length === 0 && searchResults.students.length === 0 && (
                                    <div className="glass p-12 rounded-2xl border border-slate-800 text-center">
                                        <Search className="mx-auto text-slate-600 mb-4" size={48} />
                                        <p className="text-slate-500 text-lg">No results found for "{searchQuery}"</p>
                                        <p className="text-slate-600 text-sm mt-1">Try searching with different keywords</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!searchQuery && (
                            <div className="glass p-12 rounded-2xl border border-slate-800 text-center">
                                <Search className="mx-auto text-slate-600 mb-4" size={48} />
                                <p className="text-slate-500 text-lg">Enter a search query to find rooms or students</p>
                                <p className="text-slate-600 text-sm mt-1">Search by name, email, student ID, room number, etc.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Reports Tab */}
                {activeTab === 'reports' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="text-green-500" size={28} />
                                <h2 className="text-2xl font-bold">Reports</h2>
                            </div>
                            <button
                                onClick={generateReport}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold transition-all flex items-center gap-2"
                            >
                                <FileText size={18} /> Generate Report
                            </button>
                        </div>

                        <div className="glass p-8 rounded-2xl border border-slate-800 text-center">
                            <FileText className="mx-auto text-slate-600 mb-4" size={64} />
                            <h3 className="text-xl font-bold mb-2">Generate Hostel Report</h3>
                            <p className="text-slate-500 max-w-md mx-auto mb-6">
                                Click the button above to generate a comprehensive report including room statistics,
                                student details, booking information, and revenue summary.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 text-sm">
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full">Room Statistics</span>
                                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full">Student List</span>
                                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full">Revenue Summary</span>
                                <span className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full">Booking Details</span>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Add Room Modal */}
            {showAddRoomModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="glass w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Add New Room</h2>
                            <button onClick={() => setShowAddRoomModal(false)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleAddRoom} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Room Number</label>
                                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none focus:border-purple-500" required
                                    value={newRoom.room_number} onChange={e => setNewRoom({ ...newRoom, room_number: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Capacity</label>
                                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none focus:border-purple-500" required
                                    value={newRoom.capacity} onChange={e => setNewRoom({ ...newRoom, capacity: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Price (per semester)</label>
                                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none focus:border-purple-500" required
                                    value={newRoom.price} onChange={e => setNewRoom({ ...newRoom, price: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setShowAddRoomModal(false)} className="px-4 py-2 hover:bg-slate-800 rounded-lg text-slate-400">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold">Add Room</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            {showEditStudentModal && editingStudent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="glass w-full max-w-2xl p-6 rounded-2xl border border-slate-700 shadow-2xl my-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Edit Student</h2>
                            <button onClick={() => setShowEditStudentModal(false)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateStudent} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Full Name *</label>
                                    <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none focus:border-blue-500" required
                                        value={editingStudent.name} onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Student ID *</label>
                                    <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none focus:border-blue-500" required
                                        value={editingStudent.student_id} onChange={e => setEditingStudent({ ...editingStudent, student_id: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Email *</label>
                                    <input type="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none focus:border-blue-500" required
                                        value={editingStudent.email} onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Phone</label>
                                    <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none focus:border-blue-500"
                                        value={editingStudent.phone || ''} onChange={e => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Room Number</label>
                                    <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none focus:border-blue-500"
                                        value={editingStudent.room_number || ''} onChange={e => setEditingStudent({ ...editingStudent, room_number: e.target.value })}>
                                        <option value="">Select Room</option>
                                        {rooms.map(room => (
                                            <option key={room.id} value={room.room_number}>Room {room.room_number}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Course</label>
                                    <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none focus:border-blue-500"
                                        value={editingStudent.course || ''} onChange={e => setEditingStudent({ ...editingStudent, course: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Year</label>
                                    <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none focus:border-blue-500"
                                        value={editingStudent.year || ''} onChange={e => setEditingStudent({ ...editingStudent, year: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Amount Paid ($)</label>
                                    <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none focus:border-blue-500"
                                        value={editingStudent.amount_paid || ''} onChange={e => setEditingStudent({ ...editingStudent, amount_paid: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Guardian Name</label>
                                    <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none focus:border-blue-500"
                                        value={editingStudent.guardian_name || ''} onChange={e => setEditingStudent({ ...editingStudent, guardian_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Guardian Phone</label>
                                    <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none focus:border-blue-500"
                                        value={editingStudent.guardian_phone || ''} onChange={e => setEditingStudent({ ...editingStudent, guardian_phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setShowEditStudentModal(false)} className="px-4 py-2 hover:bg-slate-800 rounded-lg text-slate-400">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold">Update Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {showReportModal && report && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="glass w-full max-w-4xl p-6 rounded-2xl border border-slate-700 shadow-2xl my-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <FileText className="text-green-500" />
                                Hostel Report
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={downloadReport} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold flex items-center gap-2">
                                    <Download size={16} /> Download
                                </button>
                                <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <p className="text-slate-500 text-sm mb-6">Generated: {new Date(report.generatedAt).toLocaleString()}</p>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                                <p className="text-3xl font-bold text-purple-400">{report.summary.totalRooms}</p>
                                <p className="text-slate-400 text-sm">Total Rooms</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                                <p className="text-3xl font-bold text-green-400">{report.summary.availableRooms}</p>
                                <p className="text-slate-400 text-sm">Available</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                                <p className="text-3xl font-bold text-blue-400">{report.summary.totalStudents}</p>
                                <p className="text-slate-400 text-sm">Students</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                                <p className="text-3xl font-bold text-emerald-400">${report.summary.totalRevenue.toFixed(0)}</p>
                                <p className="text-slate-400 text-sm">Total Revenue</p>
                            </div>
                        </div>

                        {/* Occupancy Rate */}
                        <div className="bg-slate-800/50 p-4 rounded-xl mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-400">Occupancy Rate</span>
                                <span className="font-bold text-purple-400">{report.summary.occupancyRate}%</span>
                            </div>
                            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                                    style={{ width: `${report.summary.occupancyRate}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Room List */}
                        <div className="mb-6">
                            <h3 className="font-bold mb-3">Room Details</h3>
                            <div className="bg-slate-800/50 rounded-xl overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            <th className="p-3 text-left text-slate-400">Room</th>
                                            <th className="p-3 text-left text-slate-400">Capacity</th>
                                            <th className="p-3 text-left text-slate-400">Price</th>
                                            <th className="p-3 text-left text-slate-400">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.rooms.slice(0, 5).map(room => (
                                            <tr key={room.id} className="border-b border-slate-700/50">
                                                <td className="p-3">{room.room_number}</td>
                                                <td className="p-3">{room.capacity}</td>
                                                <td className="p-3">${room.price}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${room.is_occupied ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                                        {room.is_occupied ? 'Occupied' : 'Available'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {report.rooms.length > 5 && (
                                    <p className="p-3 text-center text-slate-500 text-sm">...and {report.rooms.length - 5} more rooms</p>
                                )}
                            </div>
                        </div>

                        {/* Additional Stats */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl">
                                <p className="text-slate-400 text-sm">Total Capacity</p>
                                <p className="text-2xl font-bold">{report.summary.totalCapacity} students</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl">
                                <p className="text-slate-400 text-sm">Total Bookings</p>
                                <p className="text-2xl font-bold">{report.summary.totalBookings}</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl">
                                <p className="text-slate-400 text-sm">Pending Bookings</p>
                                <p className="text-2xl font-bold text-orange-400">{report.summary.pendingBookings}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
