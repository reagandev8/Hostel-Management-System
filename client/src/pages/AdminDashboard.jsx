import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, BedDouble, Users, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({ room_number: '', capacity: '', price: '' });
    const [showAddModal, setShowAddModal] = useState(false);

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

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            await api.post('/rooms', newRoom);
            setShowAddModal(false);
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

            <main className="p-6 max-w-7xl mx-auto space-y-8">
                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-4 opacity-10">
                            <BedDouble size={100} />
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">Total Rooms</h3>
                        <p className="text-4xl font-bold mt-2">{rooms.length}</p>
                    </div>
                    <div className="glass p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-4 opacity-10">
                            <Users size={100} />
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">Total Students</h3>
                        <p className="text-4xl font-bold mt-2">--</p>
                    </div>
                    <div className="glass p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-4 opacity-10">
                            <BedDouble size={100} />
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">Booked Rooms</h3>
                        <p className="text-4xl font-bold mt-2">{rooms.filter(r => r.is_occupied).length}</p>
                    </div>
                </div>

                {/* Room Management */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Manage Rooms</h2>
                        <button
                            onClick={() => setShowAddModal(true)}
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
                                    <th className="p-4 text-slate-400 font-medium text-sm">Price</th>
                                    <th className="p-4 text-slate-400 font-medium text-sm">Status</th>
                                    <th className="p-4 text-slate-400 font-medium text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map(room => (
                                    <tr key={room.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                                        <td className="p-4 font-medium">{room.room_number}</td>
                                        <td className="p-4 text-slate-400">{room.capacity}</td>
                                        <td className="p-4 text-slate-400">${room.price}</td>
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
                        </table>
                        {rooms.length === 0 && (
                            <div className="p-8 text-center text-slate-500">No rooms found. Add one to get started.</div>
                        )}
                    </div>
                </div>
            </main>

            {/* Add Room Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="glass w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Add New Room</h2>
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
                                <label className="block text-sm text-slate-400 mb-1">Price (Monthly)</label>
                                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 outline-none focus:border-purple-500" required
                                    value={newRoom.price} onChange={e => setNewRoom({ ...newRoom, price: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 hover:bg-slate-800 rounded-lg text-slate-400">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold">Add Room</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
