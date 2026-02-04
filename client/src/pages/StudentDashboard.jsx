import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Building2, BedDouble, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const roomsRes = await api.get('/rooms');
                // In a real app, we'd filter booked rooms or fetched user specific bookings
                setRooms(roomsRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleBook = async (roomId) => {
        try {
            await api.post('/bookings', {
                user_id: user.id,
                room_id: roomId,
                start_date: new Date().toISOString(),
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // +30 days
            });
            alert('Booking request sent!');
        } catch (err) {
            alert('Booking failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            <nav className="h-16 glass sticky top-0 z-50 px-6 flex items-center justify-between border-b border-slate-800">
                <div className="text-xl font-bold flex items-center gap-2">
                    <Building2 className="text-blue-500" />
                    <span>Hostel<span className="text-blue-500">M8</span></span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">
                            {user.username[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-300 font-medium hidden sm:block">{user.username}</span>
                    </div>
                    <button onClick={handleLogout} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white" title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>

            <main className="p-6 max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Find a Room</h1>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle size={12} /> Available</span>
                        <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-medium flex items-center gap-1"><XCircle size={12} /> Occupied</span>
                    </div>
                </div>

                {loading ? (
                    <p className="text-slate-500">Loading rooms...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map(room => (
                            <div key={room.id} className="glass p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/5 group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Room {room.room_number}</h3>
                                        <p className="text-sm text-slate-400">Capacity: {room.capacity} Students</p>
                                    </div>
                                    <div className={`p-2 rounded-lg ${room.is_occupied ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                        <BedDouble size={20} />
                                    </div>
                                </div>

                                <div className="flex items-end justify-between mt-6">
                                    <div>
                                        <span className="text-2xl font-bold text-blue-400">${room.price}</span>
                                        <span className="text-slate-500 text-sm">/month</span>
                                    </div>
                                    <button
                                        onClick={() => handleBook(room.id)}
                                        disabled={room.is_occupied}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${room.is_occupied
                                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-95'
                                            }`}
                                    >
                                        {room.is_occupied ? 'Occupied' : 'Book Now'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;
