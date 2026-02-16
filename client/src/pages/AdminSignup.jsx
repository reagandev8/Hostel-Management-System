import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, AlertCircle, Mail, Lock, User, Shield, CheckCircle } from 'lucide-react';
import api from '../api';

const AdminSignup = () => {
    const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/register/admin', {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            setSuccess(response.data.message || "Registration successful!");
            setTimeout(() => navigate('/admin/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
                    alt="Modern Admin Building"
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/80 to-slate-950/95"></div>
            </div>

            <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl border border-slate-800 relative z-10 animate-fade-in">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                        <Shield className="text-purple-400" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Admin Registration
                    </h2>
                    <p className="text-slate-500 mt-2">Create your administrator account</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm animate-slide-in">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400 text-sm animate-slide-in">
                        <CheckCircle size={18} />
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="form-group">
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-100 placeholder-slate-600"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-100 placeholder-slate-600"
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-100 placeholder-slate-600"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-100 placeholder-slate-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-100 placeholder-slate-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-3 rounded-lg font-bold transition-all mt-6 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 transform"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Admin Account'}
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/admin/login" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                            Already have an account? Login
                        </Link>
                    </div>

                    <div className="text-center mt-2">
                        <Link to="/" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
                            Back to Home
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSignup;
