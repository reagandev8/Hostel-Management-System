import React from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>
            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 z-10 glass p-10 rounded-3xl border border-slate-800 shadow-2xl">
                <div className="space-y-8 flex flex-col justify-center">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                            <Building2 size={16} /> Hostel Management
                        </div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                            Stay Connected. <br /> Live Comfortably.
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Experience the modern way to manage your hostel life. Book rooms, track payments, and connect with your community seamlessly.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/student/login" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/25 text-center">
                            Student Portal
                        </Link>
                        <Link to="/admin/login" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all hover:scale-105 border border-slate-700 text-center">
                            Admin Access
                        </Link>
                    </div>

                </div>
                <div className="hidden md:flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                    <Building2 size={240} className="text-slate-700 relative z-10 drop-shadow-2xl" />
                </div>
            </div>
        </div>
    );
};

export default Home;
